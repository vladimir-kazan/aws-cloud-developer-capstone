import 'source-map-support/register';

import { NotesService, NoteModel } from '../dataLayer/notes.service';
import { createLogger } from '../utils';
import { uuid4 } from '../utils/uuid';

const noteService = new NotesService();
const logger = createLogger('BL/notes');

export const getNotes = async (userId: string, sortBy: string): Promise<NoteModel[]> => {
  logger.info('getNotes', { userId, sortBy });
  return noteService.getItems(userId, sortBy);
};

export const getNoteById = async (userId: string, noteId: string): Promise<NoteModel> => {
  logger.info('getNoteById', { userId, noteId });
  return noteService.getById(userId, noteId);
};

export const deleteNoteById = async (userId: string, noteId: string): Promise<void> => {
  logger.info('deleteNoteById', { userId, noteId });
  return noteService.deleteById(userId, noteId);
};

export const addNote = async (
  userId: string,
  note: Pick<NoteModel, 'title' | 'body'>,
): Promise<NoteModel> => {
  logger.info('addNote', { userId, note });
  const now = new Date().toISOString();
  const payload: NoteModel = {
    ...note,
    createdAt: now,
    updatedAt: now,
    noteId: uuid4(),
  };
  return noteService.createItem(userId, payload);
};

export const updateNote = async (
  userId: string,
  note: Pick<NoteModel, 'title' | 'body' | 'noteId' | 'createdAt'>,
): Promise<NoteModel> => {
  logger.info('updateNote', { userId, note });
  const now = new Date().toISOString();
  const payload: NoteModel = {
    ...note,
    updatedAt: now,
  };
  return noteService.updateItem(userId, payload);
};
