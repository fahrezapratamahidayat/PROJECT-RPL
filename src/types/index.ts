type Timestamp = {
  seconds: number;
  nanoseconds: number;
};
export type TasksData = {
  created_At: string;
  deadline: string;
  description: string;
  modules: any[];
  ownerId: string;
  status: boolean;
  status_task: string;
  teams: any[];
  title: string;
  userId: string;
  taskId: string;
};

export type UserData = {
  id: string;
  updated_At: Timestamp;
  fullname: string;
  created_At: Timestamp;
  tasks: TasksData[];
  password: string;
  email: string;
  idp: string;
}