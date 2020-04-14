import { NotesService, NoteModel } from "../dataLayer/notes.service";

const noteService = new NotesService();

export const getNotes = async (userId: string): Promise<NoteModel[]> => {
  return noteService.getItems(userId);
};
