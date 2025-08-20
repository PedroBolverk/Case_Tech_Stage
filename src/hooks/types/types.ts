// types/types.ts

export interface Area {
  id: string;
  name: string;
  description: string;
}

export interface Process {
  id: string;
  title: string;
  status: string;
  areaId: string;
  subprocesses?: Subprocess[];
}

export interface Subprocess {
  id: string;
  title: string;
  status: string;
  processId: string;
}

// types/types.ts

export interface NodeProps {
  data: {
    label: string;
  };
  type: 'area' | 'process' | 'subprocess';  // Tipagem para os tipos de nó
}

// NodeProps<any> é o tipo esperado pelo React Flow
export interface NodePropsWithType<T> {
  data: {
    label: string;
  };
  type: T;
}

