import React from 'react';
import styles from '../styles/NewPage.module.css'; 
import { NodePropsWithType } from '../hooks/types/types'

const CustomNode = ({ data, type }: NodePropsWithType<'area' | 'process' | 'subprocess'>) => {
  let nodeClass = styles.reactFlowNode; 

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
