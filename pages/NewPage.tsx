import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow, { ReactFlowProvider, Background } from 'react-flow-renderer';
import styles from '../src/styles/NewPage.module.css';
import useBuildFlow from '../src/hooks/useBuildFlow';
import Processos from '../src/modal/Processos';

interface Area {
    id: string;
    name: string;
    description: string;
}

interface Process {
    id: string;
    title: string;
    description: string;
    status: string;
    areaId: string;
    subprocesses?: Subprocess[];
    importance: string;
}

interface Subprocess {
    id: string;
    title: string;
    status: string;
    processId: string;
}

const NewDashboard = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [processos, setProcessos] = useState<Process[]>([]);
    const [newArea, setNewArea] = useState({ name: '', description: '' });

    const { nodes, edges } = useBuildFlow(areas, processos);

    // Carregar Áreas e Processos
    useEffect(() => {
        axios.get('http://localhost:4000/api/areas')
            .then((response) => setAreas(response.data))
            .catch((error) => console.error('Erro ao carregar áreas', error));

        axios.get('http://localhost:4000/api/processes')
            .then((response) => setProcessos(response.data))
            .catch((error) => console.error('Erro ao carregar processos', error));
    }, []);

    // Função para adicionar novas áreas
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/areas', newArea);
            setAreas([...areas, response.data]);
            setNewArea({ name: '', description: '' });
        } catch (error) {
            console.error('Erro ao adicionar área:', error);
        }
    };

    // Construção dos nós para o React Flow
    const buildFlow = () => {
        let newNodes: any[] = [];
        let newEdges: any[] = [];

        areas.forEach((area, index) => {
            newNodes.push({
                id: `area-${area.id}`,
                type: 'default',
                data: { label: area.name },
                position: { x: 300 * index, y: 50 },
            });

            processos.filter(p => p.areaId === area.id).forEach((process, pIndex) => {
                newNodes.push({
                    id: `process-${process.id}`,
                    type: 'default',
                    data: { label: process.title },
                    position: { x: 300 * index, y: 150 + 100 * pIndex },
                });

                newEdges.push({
                    id: `edge-${area.id}-${process.id}`,
                    source: `area-${area.id}`,
                    target: `process-${process.id}`,
                    animated: true,
                });

                process.subprocesses?.forEach((sub, sIndex) => {
                    newNodes.push({
                        id: `subprocess-${sub.id}`,
                        type: 'default',
                        data: { label: sub.title },
                        position: { x: 300 * index, y: 250 + 100 * pIndex + 50 * sIndex },
                    });

                    newEdges.push({
                        id: `edge-${process.id}-${sub.id}`,
                        source: `process-${process.id}`,
                        target: `subprocess-${sub.id}`,
                        animated: true,
                    });
                });
            });
        });


    };

    useEffect(() => {
        buildFlow();
    }, [areas, processos]);

    return (
        <div className={styles.dashboardContainer}>
      
            <div className={styles.sidebar}>
                <ul>
                    <li><a href='/'>Dashboard</a></li>
                    <li>Áreas</li>
                    <li> <Processos/></li>
                    <li>Subprocessos</li>
                </ul>
            </div>

            <div className={styles.content}>
                <h2>Áreas e Processos</h2>

                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nome da Área"
                            value={newArea.name}
                            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={newArea.description}
                            onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                            required
                        />
                        <button type="submit">Adicionar Área</button>
                    </form>
                </div>

                {/* Tabela de Áreas */}
                <div className="tableContainer">
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descrição</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map(area => (
                                <tr key={area.id}>
                                    <td>{area.name}</td>
                                    <td>{area.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Processo</th>
                                <th>Descrição</th>
                                <th>Status</th>
                                <th>Importancia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processos.map(process => (
                                <tr key={process.id}>
                                    <td>{process.title}</td>
                                    <td>{process.description}</td>
                                    <td>{process.status}</td>
                                    <td>{process.importance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Fluxo de Processos */}
                <div className={styles.reactFlowWrapper}>
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            style={{ width: '100%', height: '500px' }}
                        >
                            <Background color="#000000ff" gap={16} />
                            <div className={styles.legendContainer}>

                                <ul className={styles.legendList}>
                                    <li>
                                        <span className={styles.legendTag} style={{ backgroundColor: '#4A90E2' }}></span>
                                        <span className={styles.legendLabel}>Importante</span>
                                    </li>
                                    <li>
                                        <span className={styles.legendTag} style={{ backgroundColor: '#7ED321' }}></span>
                                        <span className={styles.legendLabel}>Relevante</span>
                                    </li>
                                    <li>
                                        <span className={styles.legendTag} style={{ backgroundColor: '#F5A623' }}></span>
                                        <span className={styles.legendLabel}>Menos Relevante</span>
                                    </li>
                                </ul>
                            </div>
                        </ReactFlow>

                    </ReactFlowProvider>

                </div>

            </div>
        </div>
    );
};

export default NewDashboard;
