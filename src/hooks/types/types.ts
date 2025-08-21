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
  importance: number;
  subprocesses?: Subprocess[];
}

export interface Subprocess {
  id: string;
  title: string;
  status: string;
  processId: string;
}

export interface NodeProps {
  data: {
    label: string;
  };
  type: 'area' | 'process' | 'subprocess';  
}

export interface NodePropsWithType<T> {
  data: {
    label: string;
  };
  type: T;
}

