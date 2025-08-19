import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para obter todos os Processos
export const getProcesses = async () => {  // Renomeado para refletir corretamente a ação de buscar processos
  try {
    const response = await api.get('/processes');  // Endpoint correto para buscar processos
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar Processos', error);
    throw new Error('Erro ao buscar Processos');  // Melhorando a mensagem de erro
  }
};
