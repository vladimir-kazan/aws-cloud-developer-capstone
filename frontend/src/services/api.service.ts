import 'source-map-support/register';
import { createContext, useContext } from 'react';
import { AuthService } from './auth.service';
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

  getNotes = async (sorting: string = '-updated'): Promise<Note[]> => {
    const response = await this.execute(`${notesUrl}?sort=${encodeURIComponent(sorting)}`);
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

  getNoteById = async (noteId: string): Promise<Note | undefined> => {
    const url = `${notesUrl}/${noteId}`;
    const response = await this.execute(url);
    const item: Note = await response.json();
    return item;
  };

  private execute = async (url: string) => {
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    if (response.status === 403) {
      this.auth.login();
    }
    return response;
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
  userId?: string;
  title: string;
  body: string;
  updatedAt: string;
  createdAt: string;
  [k: string]: any;
}
