import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../src/styles/Dashboard.module.css';


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
}

interface Subprocess {
  id: string;
  title: string;
  status: string;
}

interface Document {
  id: string;
  title: string;
  url: string;
}

const Dashboard = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [processos, setProcessos] = useState<Process[]>([]);
  const [subprocessos, setSubprocessos] = useState<Subprocess[]>([]);
  const [documentos, setDocumentos] = useState<Document[]>([]);

  useEffect(() => {
  
    axios
      .get('http://localhost:4000/api/areas')
      .then((response) => setAreas(response.data))
      .catch((error) => console.error('Erro ao carregar áreas', error));

  
    axios
      .get('http://localhost:4000/api/processes')
      .then((response) => setProcessos(response.data))
      .catch((error) => console.error('Erro ao carregar processos', error));

  
    axios
      .get('http://localhost:4000/documents')
      .then((response) => setDocumentos(response.data)) 
      .catch((error) => {
        console.error('Erro ao carregar documentos', error);
        setDocumentos([]); 
      });
  }, []);

  const handleAddArea = () => {
    // Função para adicionar novas áreas

  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.section}>
        <h2>Áreas Cadastradas</h2>
        <button onClick={handleAddArea} className={styles.button}>+</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome da Área</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                <td>{area.name}</td>
                <td>{area.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2>Processos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título do Processo</th>
              <th>Status</th>
              <th>Importância</th>
            </tr>
          </thead>
          <tbody>
            {processos.map((processo) => (
              <tr key={processo.id}>
                <td>{processo.title}</td>
                <td>{processo.status}</td>
                <td>{processo.importance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2>Subprocessos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título do Subprocesso</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subprocessos.map((subprocesso) => (
              <tr key={subprocesso.id}>
                <td>{subprocesso.title}</td>
                <td>{subprocesso.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h2>Documentos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título do Documento</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {documentos.length > 0 ? (
              documentos.map((documento) => (
                <tr key={documento.id}>
                  <td>{documento.title}</td>
                  <td>
                    <a href={documento.url} target="_blank" rel="noopener noreferrer">
                      Abrir
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>Nenhum documento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
