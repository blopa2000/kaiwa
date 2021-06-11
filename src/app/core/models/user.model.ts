export interface User {
  firstName?: string;
  lastName?: string;
  description?: string;
  timestamp?: Date;
  avatar?: string;
  id?: string;
  email?: string;
}

export interface Contact {
  avatar: string;
  email: string;
  lastName: string;
  firstName: string;
  id: string;
  contactsID: string;
  room: {
    lastMessage: string;
    idUser: string;
    timestamp: Date;
    countMessage: number;
    messageSeen: boolean;
  };
  roomID: string;
}

export interface DefaultContact {
  doc?: {
    firstName?: string;
    email?: string;
    avatar?: string;
    lastName?: string;
    description?: string;
  };
  id?: string;
  idContact?: string;
}

export interface Contacts {
  room: string;
  user: string;
}
