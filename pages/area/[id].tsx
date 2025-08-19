// pages/area/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Defina a interface do Processo
interface Processo {
  id: string;
  title: string;
  status: string;
  importance: number;
}

const AreaPage = () => {
  const router = useRouter();
  const { id } = router.query;  // O `id` obtido da URL é o `areaId` para essa área
  const [processos, setProcessos] = useState<Processo[]>([]);  // Tipando explicitamente o estado

  useEffect(() => {
    if (id) {
      // Faz a requisição para a API, passando o `areaId` como parâmetro
      axios.get(`http://localhost:4000/api/processes?areaId=${id}`)
        .then((response) => {
          setProcessos(response.data);  // Atualiza o estado com os processos retornados
        })
        .catch((error) => {
          console.error("Erro ao carregar processos:", error);
        });
    }
  }, [id]);  // Refaça a requisição sempre que o `id` (areaId) mudar

  return (
    <div>
      <h1>Processos da Área: {id}</h1>
      <ul>
        {processos.length > 0 ? (
          processos.map((processo) => (
            <li key={processo.id}>
              {processo.title}
            </li>
          ))
        ) : (
          <p>Não há processos para esta área.</p>
        )}
      </ul>
    </div>
  );
};

export default AreaPage;
