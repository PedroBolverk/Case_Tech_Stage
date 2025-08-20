// components/CustomNode.tsx

import React from 'react';
import styles from '../styles/NewPage.module.css';  // Certifique-se de que o caminho do arquivo CSS está correto
import { NodePropsWithType } from '../hooks/types/types';  // Importando o tipo genérico NodePropsWithType

// Componente único para todos os tipos de nós
const CustomNode = ({ data, type }: NodePropsWithType<'area' | 'process' | 'subprocess'>) => {
  let nodeClass = styles.reactFlowNode;  // Classe base

  // Adiciona uma classe específica dependendo do tipo de nó
  if (type === 'area') {
    nodeClass = `${nodeClass} ${styles.area}`;
  } else if (type === 'process') {
    nodeClass = `${nodeClass} ${styles.process}`;
  } else if (type === 'subprocess') {
    nodeClass = `${nodeClass} ${styles.subprocess}`;
  }

  return (
    <div className={nodeClass}>
      {data.label}
    </div>
  );
};

export default CustomNode;
