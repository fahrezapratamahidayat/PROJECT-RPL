type Timestamp = {
  seconds: number;
  nanoseconds: number;
};
export type TasksData = {
  dueDate: string;
  dueTime: string;
  description: string;
  modules: any[];
  ownerId: string;
  status: boolean;
  statusTask: string;
  teams: any[];
  title: string;
  userId: string;
  taskId: string;
  typeTask: string;
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