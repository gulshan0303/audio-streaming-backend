import { Response, Request } from "express";
import { sendResponse } from "../../common/utils/response";
import { AuthRequest } from "../../types/express";
import {
  addSongToPlaylist,
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeSongFromPlaylist,
} from "./playlist.service";

export const createPlaylistController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { name } = req.body;
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const playlist = await createPlaylist(req.user.id, name);

  return sendResponse(res, playlist, "Playlist created");
};

export const addSongController = async (req: AuthRequest, res: Response) => {
  const { playlistId, songId } = req.body;
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const result = await addSongToPlaylist(playlistId, songId, req.user.id);

  return sendResponse(res, result, "Song added");
};

export const removeSongController = async (req: AuthRequest, res: Response) => {
  const { playlistId, songId } = req.body;
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const result = await removeSongFromPlaylist(playlistId, songId, req.user.id);

  return sendResponse(res, result);
};

export const getPlaylistController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const playlist = await getPlaylistById(id);

  return sendResponse(res, playlist);
};

export const getUserPlaylistsController = async (
  req: AuthRequest,
  res: Response,
) => {
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const playlists = await getUserPlaylists(req.user.id);

  return sendResponse(res, playlists);
};
