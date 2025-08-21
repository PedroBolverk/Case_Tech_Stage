import { useState, useEffect } from 'react';
import axios from 'axios';

const useProcessos = () => {
  const [processos, setProcessos] = useState([]);
  const [subprocessos, setSubprocessos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/processes')
      .then((response) => {
        const allProcesses = response.data;
        const rootProcesses = allProcesses.filter((process: any) => !process.parentId);
        const childProcesses = allProcesses.filter((process: any) => process.parentId);

        setProcessos(rootProcesses);
        setSubprocessos(childProcesses);
      })
      .catch((error) => console.error('Erro ao carregar processos', error));
  }, []);

  return { processos, subprocessos };
};

export default useProcessos;
