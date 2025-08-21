import { useState, useEffect } from 'react';
import { Area, Process, Subprocess, NodePropsWithType } from './types/types'; 
import CustomNode from '../components/CustomNode';

const useBuildFlow = (areas: Area[], processos: Process[]) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]); 
  const nodeTypes: Record<string, React.ComponentType<NodePropsWithType<'area' | 'process' | 'subprocess'>>> = {
    area: CustomNode,      
    process: CustomNode,   
    subprocess: CustomNode,  
  };

  const getNodeColor = (importance: number) => {
    if (importance > 6) return '#4A90E2';  
    if (importance === 5) return '#7ED321'; 
    return '#F5A623';
  };

  useEffect(() => {
    const buildFlow = () => {
      let newNodes: any[] = [];
      let newEdges: any[] = [];

      let areaXPosition = 0; 
      let areaYPosition = 0; 
      const areaSpacing = 10; 
      const processSpacing = 100; 
      const subprocessSpacing = 160; 
      const verticalSpacingBetweenProcesses = 300; 
      const lateralSpacingBetweenGroups = 400; 
      const verticalSpacingBetweenAreas = 500;

      areas.forEach((area, index) => {
        const centralProcess = processos.find((p) => p.areaId === area.id);
        if (!centralProcess) return;

        const centralProcessX = areaXPosition + areaSpacing / 2;
        const centralProcessY = areaYPosition + verticalSpacingBetweenAreas * index;

        newNodes.push({
          id: `area-${area.id}`,
          type: 'area',
          data: { label: area.name },
          position: { x: centralProcessX + 500, y: centralProcessY - 100 },
        });

        areaXPosition += areaSpacing;
        let processX = centralProcessX;
        let processY = centralProcessY;

        processos
          .filter((p) => p.areaId === area.id)
          .forEach((process) => {
            // Determina a cor do nó do processo com base na importância
            const processColor = getNodeColor(process.importance);

            newNodes.push({
              id: `process-${process.id}`,
              type: 'process',
              data: { label: process.title },
              position: { x: processX, y: processY }, 
              style: { backgroundColor: processColor }, // Define a cor de fundo
            });

            newEdges.push({
              id: `edge-${area.id}-${process.id}`,
              source: `area-${area.id}`,
              target: `process-${process.id}`,
              animated: true,
            });

            processX += processSpacing; 
            
            let subprocessX = processX - processSpacing - 160; 
            let subprocessY = processY + 150; 
    
            process.subprocesses?.forEach((sub: Subprocess) => {
              newNodes.push({
                id: `subprocess-${sub.id}`,
                type: 'subprocess',
                data: { label: sub.title },
                position: { x: subprocessX, y: subprocessY },
                style: { backgroundColor: processColor}
              });

              newEdges.push({
                id: `edge-${process.id}-${sub.id}`,
                source: `process-${process.id}`,
                target: `subprocess-${sub.id}`,
                animated: true,
              });
              subprocessX += subprocessSpacing; 

              subprocessY = processY + 150; 
            });

            processX += lateralSpacingBetweenGroups;
          });
            areaXPosition += areaSpacing;
      });

      setNodes(newNodes);
      setEdges(newEdges);
    };

    buildFlow();
  }, [areas, processos]);

  return { nodes, edges, nodeTypes };
};

export default useBuildFlow;

