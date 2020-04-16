import { NotesService, NoteModel } from "../dataLayer/notes.service";

const noteService = new NotesService();

export const getNotes = async (userId: string): Promise<NoteModel[]> => {
  return noteService.getItems(userId);
};

export const getNoteById = async (userId: string, noteId: string): Promise<NoteModel> => {
  return noteService.getById(userId, noteId);
};
