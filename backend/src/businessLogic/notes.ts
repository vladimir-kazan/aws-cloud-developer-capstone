import 'source-map-support/register';
import { NotesService, NoteModel } from '../dataLayer/notes.service';
import { createLogger } from '../utils';

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
