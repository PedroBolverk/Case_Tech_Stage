// components/ProcessoTree.tsx
import React from 'react';

// Definindo a interface do tipo Processo
interface Processo {
  id: string;
  title: string;
  children: Processo[];  // Definindo que 'children' é um array de processos
}

const ProcessoTree = ({ process }: { process: Processo }) => {  // Tipando o parâmetro 'process'
  if (!process) return null;

  return (
    <div style={{ marginLeft: '20px' }}>
      <h3>{process.title}</h3>
      {process.children && process.children.length > 0 && (
        <div>
          <h4>Subprocessos:</h4>
          <ul>
            {process.children.map((subprocess: Processo) => (  // Tipando o parâmetro 'subprocess'
              <li key={subprocess.id}>
                <ProcessoTree process={subprocess} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProcessoTree;
