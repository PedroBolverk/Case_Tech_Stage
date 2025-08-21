import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow, { ReactFlowProvider, Background } from 'react-flow-renderer';
import styles from '../src/styles/NewPage.module.css';
import useBuildFlow from '../src/hooks/useBuildFlow';
import ButtonDashBoard from '../src/components/ButtonDashBoard';
import CreateArea from '../src/modal/CreateArea';


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
  importance: number;
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
  const [newProcess, setNewProcess] = useState({
    title: '',
    description: '',
    status: 'PLANNED',
    importance: 3,
    areaId: '',
    responsibleId: '',

  });
  const [newArea, setNewArea] = useState({ name: '', description: '' });
  const [newSubprocess, setNewSubprocess] = useState({ title: '', status: 'PLANNED', processId: '' });
  const { nodes, edges } = useBuildFlow(areas, processos);
  const [showModal, setShowModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false)
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [subProcesses, setSubProcesses] = useState<Subprocess[]>([]);

  const handleSubprocessInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSubprocess({
      ...newSubprocess,
      [name]: value,
    });
  };
  // Carregar Áreas e Processos
  useEffect(() => {
    axios.get('http://localhost:4000/api/areas')
      .then((response) => setAreas(response.data))
      .catch((error) => console.error('Erro ao carregar áreas', error));

    axios.get('http://localhost:4000/api/processes/subprocesses')
      .then((response) => {
        console.log("Resposta dos subprocessos:", response.data);  // Verifica se está recebendo um array de subprocessos
        setSubProcesses(response.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar subprocessos:', error);
      });

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

  const handleDeleteArea = async (areaId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/areas/${areaId}`);

      setAreas(areas.filter((area) => area.id !== areaId));
    } catch (error) {
      console.error('Erro ao excluir área:', error);
    }
  };

  const handleDeleteProcess = async (processId: string) => {
    const confirmDelete = window.confirm('Tem certeza de que deseja excluir este processo e todos os subprocessos vinculados a ele? Esta ação não pode ser desfeita.');

    if (confirmDelete) {
      try {
        console.log('Deletando processo com ID:', processId);

        await axios.delete(`http://localhost:4000/api/processes/${processId}?cascade=true`);

        setProcessos(processos.filter((process) => process.id !== processId));
      } catch (error) {
        console.error('Erro ao excluir processo:', error);

      }
    }
  };


  const handleCreateProcess = async (areaId: string) => {
    try {
      console.log('Dados enviados para o backend:', {
        title: newProcess.title,
        description: newProcess.description,
        status: newProcess.status,
        importance: newProcess.importance,
        responsibleId: newProcess.responsibleId || null,
      });

      const response = await axios.post(
        `http://localhost:4000/api/areas/${areaId}/processes`,
        {
          title: newProcess.title,
          description: newProcess.description,
          status: newProcess.status,
          importance: newProcess.importance,
          responsibleId: newProcess.responsibleId || null,
        }
      );

      setProcessos([...processos, response.data]);
      setShowProcessModal(false);
      setNewProcess({
        title: '',
        description: '',
        status: 'PLANNED',
        importance: 3,
        areaId: '',
        responsibleId: '',
      });
    } catch (error) {
      console.error('Erro ao criar processo:', error);
    }
  };

  const handleProcessSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProcess({ ...newProcess, [name]: value });
  };

  const handleCreateSubprocess = async () => {
    try {

      console.log("Subprocess Data:", newSubprocess);


      const response = await axios.post(
        `http://localhost:4000/api/processes/${newSubprocess.processId}/subprocesses`,
        {
          title: newSubprocess.title,
          status: newSubprocess.status
        }
      );

      setProcessos(processos.map(process =>
        process.id === newSubprocess.processId
          ? {
            ...process,
            subprocesses: [...(process.subprocesses || []), response.data]
          }
          : process
      ));

      setNewSubprocess({ title: '', status: 'PLANNED', processId: '' });
      setShowModal(false);
    } catch (error: unknown) {
      console.error('Erro ao criar subprocesso', error);
    }
  };
  const handleProcessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProcess({ ...newProcess, [name]: value });
  };

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
          <li><ButtonDashBoard /></li>
          <li onClick={() => setShowAreaModal(true)}
            className={styles.buttonCadastrarProcess}>
            <a


            >
              Adicionar Área
            </a>
          </li>
          {/* <li><ProcessButton /></li>
          <li>Subprocessos</li> */}
        </ul>
      </div>

      <div className={styles.content}>
        <CreateArea
          showModal={showAreaModal}
          setShowModal={setShowAreaModal}
        />
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

        {/* Tabela de Áreas */}
        <div className={styles.tableContainer}>
          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {areas.map(area => (
                <tr key={area.id}>
                  <td>{area.name}</td>
                  <td>{area.description}</td>
                  <td>
                    <div className={styles.buttons}>
                      <button className={styles.buttonAdd} onClick={() => {
                        setSelectedAreaId(area.id);
                        setShowProcessModal(true);
                      }}>
                        Adicionar Processo
                      </button>
                      <button className={styles.buttonExcluir} onClick={() => handleDeleteArea(area.id)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tabela de Processos */}
          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th>Processo</th>
                <th>Status</th>
                <th>Importância</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {processos.map(process => (
                <tr key={process.id}>
                  <td>{process.title}</td>
                  <td>{process.status}</td>
                  <td>{process.importance}</td>
                  <td>
                    <div className={styles.buttons}>
                      <button className={styles.buttonAdd} onClick={() => {
                        setNewSubprocess({ ...newSubprocess, processId: process.id });
                        setShowModal(true);
                      }}>Adicionar Subprocesso</button>
                      <button className={styles.buttonExcluir} onClick={() => handleDeleteProcess(process.id)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
{/*         
        <table className={`${styles.table}`}>
          <thead>
            <tr>
              <th>SubProcesso</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(subProcesses) && subProcesses.map(subprocess => (
              <tr key={subprocess.id}>
                <td>{subprocess.title}</td>
                <td>{subprocess.status}</td>
                <td>
                  <div className={styles.buttons}>
                   
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>




      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <h2>Adicionar Subprocesso</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateSubprocess(); }}>
              <div>
                <label>Título do Subprocesso:</label>
                <input
                  type="text"
                  name="title"
                  value={newSubprocess.title}
                  onChange={handleSubprocessInputChange}
                  required
                />
              </div>
              <div>
                <label>Status do Subprocesso:</label>
                <select
                  name="status"
                  value={newSubprocess.status}
                  onChange={handleSubprocessInputChange}
                >
                  <option value="PLANNED">PLANNED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
              <div>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProcessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <h2>Adicionar Processo</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateProcess(selectedAreaId); }}>
              <div>
                <label>Título do Processo:</label>
                <input
                  type="text"
                  name="title"
                  value={newProcess.title}
                  onChange={handleProcessInputChange}
                  required
                />
              </div>
              <div>
                <label>Descrição do Processo:</label>
                <input
                  type="text"
                  name="description"
                  value={newProcess.description}
                  onChange={handleProcessInputChange}
                  required
                />
              </div>
              <div>
                <label>Status do Processo:</label>
                <select
                  name="status"
                  value={newProcess.status}
                  onChange={handleProcessSelectChange}
                >
                  <option value="PLANNED">PLANNED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
              <div>
                <label>Importância:</label>
                <input
                  type="number"
                  name="importance"
                  value={newProcess.importance}
                  onChange={handleProcessInputChange}
                  required
                />
              </div>
              <div>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowProcessModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}




    </div>
  );
};

export default NewDashboard;
