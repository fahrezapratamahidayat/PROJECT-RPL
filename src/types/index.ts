type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export type addTask = {
  dueDate: string;
  dueTime: string;
  description: string;
  modules?: any[];
  status?: boolean;
  statusTask?: string;
  teams?: any[];
  title: string;
  typeTask: string;
  priority: string;
  category: string[];
  assigned: string;
  notes: string;
  created_At?: Date;
  updated_At?: Date;
}
export type TasksData = {
  id: string;
  createdBy?: string;
  dueDate: string;
  dueTime: string;
  description: string;
  modules: any[];
  status: boolean;
  statusTask: string;
  teams: any[];
  title: string;
  typeTask: string;
  priority: string;
  category: string[];
  assigned: string;
  notes: string;
  created_At: Date;
  updated_At: Date;
};

interface User {
  id: string;
  email: string;
  fullname: string;
}

export type teamsData = {
  id: string;
  leader: string;
  name: string;
  description: string;
  members: User[];
  created_At: Date;
  updated_At: Date;
}
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

export interface ChatRoom {
  id?: string;
  created_at: Date;
  type: string;
  users: string[];
}
export interface Message {
  id?: string;
  message: string;
  sender: string;
  timestamp: Date;
}