export type TaskStatus = 'todo' | 'done';

export type ProjectTask = {
  id: string;
  title: string;
  status: TaskStatus;
};

export type Phase = {
  id: string;
  title: string;
  tasks: ProjectTask[];
};

export type Project = {
  id: string;
  name: string;
  phases: Phase[];
};
