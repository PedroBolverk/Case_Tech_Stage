import styles from '../styles/Dashboard.module.css'
import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from "react-bootstrap";

interface Area {
    id: string;
    name: string;
    description: string;
}

interface Process {
    id: string;
    title: string;
    status: string;
    importance: number;
    subprocesses?: Subprocess[];  
}

interface Subprocess {
    id: string;
    title: string;
    status: string;
    processId: string;  
}

const Processos = () => {
    const [processos, setProcessos] = useState<Process[]>([]);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [selectedAreaId, setSelectedAreaId] = useState<string>('');
    const [newProcess, setNewProcess] = useState({
        title: '',
        description: '',
        status: 'PLANNED',
        importance: 3,
        areaId: '',  
        responsibleId: '', 
    });

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

    const handleProcessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProcess({ ...newProcess, [name]: value });
    };

    const handleProcessSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProcess({ ...newProcess, [name]: value });
    };

    return (
        <div className={styles.modal}>
            <a onClick={() => setShowProcessModal(true)} className={styles.buttonCadastrarProcess}>Cadastrar Processo</a>

            <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Novo Processo</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={(e) => { e.preventDefault(); handleCreateProcess(selectedAreaId); }}>
                        <Form.Group controlId="formProcessTitle">
                            <Form.Label>Título do Processo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome do Processo"
                                name="title"
                                value={newProcess.title}
                                onChange={handleProcessInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formProcessDescription">
                            <Form.Label>Descrição do Processo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descrição"
                                name="description"
                                value={newProcess.description}
                                onChange={handleProcessInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formProcessStatus">
                            <Form.Label>Status do Processo</Form.Label>
                            <Form.Select
                                as="select"
                                name="status"
                                value={newProcess.status}
                                onChange={handleProcessSelectChange}
                                required
                            >
                                <option value="PLANNED">PLANNED</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="BLOCKED">BLOCKED</option>
                                <option value="DONE">DONE</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formProcessImportance">
                            <Form.Label>Importância</Form.Label>
                            <Form.Control
                                type="number"
                                name="importance"
                                value={newProcess.importance}
                                onChange={handleProcessInputChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowProcessModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => handleCreateProcess(selectedAreaId)}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Processos;
