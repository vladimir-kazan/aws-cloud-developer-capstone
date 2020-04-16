import { createContext, useContext } from 'react';
import { AuthService } from './auth';
import { backendConfig } from '../config';
import { formatToShortDate } from '../utils/date';

export const ApiContext = createContext<ApiService | null>(null);

export const useApi = (): ApiService => {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error('Please configure ApiContext before using "useApi()"');
  }
  return ctx;
};

const notesUrl = `${backendConfig.api}/notes`;

export class ApiService {
  constructor(private readonly localStorage: Storage, private readonly auth: AuthService) {}

  getNotes = async (): Promise<Note[]> => {
    const response = await fetch(notesUrl, {
      headers: this.getHeaders(),
    });
    if (response.status !== 200) {
      return [];
    }
    let items: Note[] = await response.json();
    items = items.map((n) => {
      n.updatedAtString = formatToShortDate(new Date(n.updatedAt));
      return n;
    });
    return items || [];
  };

  private getHeaders = () => {
    return {
      Authorization: `Bearer ${this.auth.getIdToken()}`,
      'Content-Type': 'application/json',
    };
  };
}

export interface Note {
  noteId: string;
  userId: string;
  title: string;
  body: string;
  updatedAt: string;
  createdAt: string;
  [k: string]: any;
}
