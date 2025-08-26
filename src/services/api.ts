import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', 
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getProcesses = async () => {  
  try {
    const response = await api.get('/processes');  
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar Processos', error);
    throw new Error('Erro ao buscar Processos');  
  }
};
