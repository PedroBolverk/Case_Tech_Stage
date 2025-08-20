// hooks/useBuildFlow.ts

import { useState, useEffect } from 'react';
import { Area, Process, Subprocess, NodePropsWithType } from './types/types';  // Importando as interfaces

import CustomNode from '../components/CustomNode';  // Importando o componente único para os nós

const useBuildFlow = (areas: Area[], processos: Process[]) => {
  const [nodes, setNodes] = useState<any[]>([]);  // Array de nós
  const [edges, setEdges] = useState<any[]>([]);  // Array de arestas

  // Definindo o nodeTypes corretamente com os tipos de nós
  const nodeTypes: Record<string, React.ComponentType<NodePropsWithType<'area' | 'process' | 'subprocess'>>> = {
    area: CustomNode,      // Usando o componente CustomNode para áreas
    process: CustomNode,   // Usando o componente CustomNode para processos
    subprocess: CustomNode,  // Usando o componente CustomNode para subprocessos
  };

  useEffect(() => {
    const buildFlow = () => {
      let newNodes: any[] = [];
      let newEdges: any[] = [];

      let areaXPosition = 0; // Posição inicial X para as áreas
      let areaYPosition = 0; // Posição Y para as áreas

      const areaSpacing = 200; // Ajuste o espaçamento entre as áreas
      const processSpacing = 100; // Ajuste o espaçamento entre os processos
      const subprocessSpacing = 160; // Ajuste o espaçamento entre subprocessos
      const verticalSpacingBetweenProcesses = 300; // Espaço vertical entre os processos
      const lateralSpacingBetweenGroups = 400; // Espaço lateral entre grupos de subprocessos de processos diferentes

      areas.forEach((area) => {
        const centralProcess = processos.find((p) => p.areaId === area.id);
        if (!centralProcess) return;

        const centralProcessX = areaXPosition + areaSpacing / 2;
        const centralProcessY = areaYPosition + 100;

        // Adiciona a área no gráfico
        newNodes.push({
          id: `area-${area.id}`,
          type: 'area',
          data: { label: area.name },
          position: { x: centralProcessX + 500, y: centralProcessY - 100 },
        });

        areaXPosition += areaSpacing; // Incrementa o espaço para a próxima área

        let processX = centralProcessX;
        let processY = centralProcessY;

        // Adiciona os processos para cada área
        processos
          .filter((p) => p.areaId === area.id)
          .forEach((process) => {
            newNodes.push({
              id: `process-${process.id}`,
              type: 'process',
              data: { label: process.title },
              position: { x: processX, y: processY }, // Posiciona o processo
            });

            newEdges.push({
              id: `edge-${area.id}-${process.id}`,
              source: `area-${area.id}`,
              target: `process-${process.id}`,
              animated: true,
            });

            processX += processSpacing; // Ajusta a posição para o próximo processo

            // Posição Y dos subprocessos (serão abaixo do processo)
            let subprocessX = processX - processSpacing - 160; // Alinha subprocessos com o processo
            let subprocessY = processY + 150; // A posição Y dos subprocessos será abaixo do processo

            // Adiciona subprocessos abaixo dos processos, mas alinhados horizontalmente
            process.subprocesses?.forEach((sub: Subprocess) => {
              newNodes.push({
                id: `subprocess-${sub.id}`,
                type: 'subprocess',
                data: { label: sub.title },
                position: { x: subprocessX, y: subprocessY }, // Subprocessos ficam abaixo do processo
              });

              newEdges.push({
                id: `edge-${process.id}-${sub.id}`,
                source: `process-${process.id}`,
                target: `subprocess-${sub.id}`,
                animated: true,
              });
              subprocessX += subprocessSpacing; // Ajusta o espaço entre subprocessos

              subprocessY = processY + 150; // Garante que todos fiquem na mesma linha abaixo do processo
            });

            processX += lateralSpacingBetweenGroups;
          });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    };

    buildFlow();
  }, [areas, processos]);

  return { nodes, edges, nodeTypes }; // Retorna nodes, edges e nodeTypes
};

export default useBuildFlow;
