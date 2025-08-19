// pages/processo/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Definindo a interface para o tipo do processo
interface Tool {
  id: string;
  name: string;
}

interface Document {
  id: string;
  url: string;
}

interface Responsible {
  name: string;
}

interface Processo {
  id: string;
  title: string;
  status: string;
  importance: number;
  description: string;
  tools: Tool[];
  responsible: Responsible;
  documents: Document[];
}

const ProcessoDetalhes = () => {
  const router = useRouter();
  const { id } = router.query;
  const [processo, setProcesso] = useState<Processo | null>(null); // Tipando o estado corretamente

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:4000/api/processes/${id}`)
        .then((response) => setProcesso(response.data)) // Atribui o tipo correto
        .catch((error) => console.error("Erro ao carregar processo:", error));
    }
  }, [id]);

  if (!processo) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Detalhes do Processo: {processo.title}</h1>
      <p><strong>Status:</strong> {processo.status}</p>
      <p><strong>Importância:</strong> {processo.importance}</p>
      <p><strong>Descrição:</strong> {processo.description}</p>

      <h2>Ferramentas:</h2>
      <ul>
        {processo.tools.map((tool) => (
          <li key={tool.id}>{tool.name}</li>
        ))}
      </ul>

      <h2>Responsável:</h2>
      <p>{processo.responsible.name}</p>

      <h2>Documentação:</h2>
      <ul>
        {processo.documents.map((doc) => (
          <li key={doc.id}><a href={doc.url} target="_blank">Abrir Documento</a></li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessoDetalhes;
