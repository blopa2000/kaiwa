export interface Message {
  id: string;
  idUser: string;
  message: string;
  timestamp: Date;
}

export interface LastMessage {
  countMessage: number;
  idUser: string;
  lastMessage: string;
  messageSeen: boolean;
  timestamp: Date;
}
