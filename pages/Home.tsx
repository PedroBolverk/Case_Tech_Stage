import { useEffect, useState } from 'react';
import { getProcesses } from '../src/services/api'; // Importando a função para buscar os processos

const Home = () => {
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Para capturar erros

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        console.log('Fazendo requisição para a API...');  // Log de debug
        const response = await getProcesses(); // Requisição para a API
        console.log('Resposta recebida:', response);  // Log da resposta da API
        setProcesses(response);  // Armazena os dados no estado
        setLoading(false);  // Finaliza o estado de carregamento
      } catch (error) {
        console.error('Erro ao carregar os processos', error); // Exibe erro no console
        setError('Erro ao carregar os processos');
        setLoading(false);
      }
    };

    fetchProcesses();
  }, []); // O array vazio garante que a requisição seja feita apenas uma vez ao carregar a página

  if (loading) {
    return <div>Carregando...</div>;  // Exibe "Carregando..." enquanto estiver buscando os dados
  }

  if (error) {
    return <div>{error}</div>;  // Exibe erro se houver algum problema
  }

  return (
    <div>
      <h1>Lista de Processos</h1>
      <ul>
        {processes.map((process) => (
          <li key={process.id}>{process.title}</li>  // Exibe os processos
        ))}
      </ul>
    </div>
  );
};

export default Home;
