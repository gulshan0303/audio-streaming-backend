import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/response";
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
  updateAlbum,
} from "./album.service";
import { AuthRequest } from "../../types/express";

export const createAlbumController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { title, artist } = req.body;

  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const album = await createAlbum({
    title,
    artist,
    coverUrl: req.file?.path,
    createdBy: req.user.id,
  });

  return sendResponse(res, album, "Album created");
};

export const getAlbumController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const album = await getAlbumById(id);

  return sendResponse(res, album);
};

export const getAllAlbumsController = async (req: Request, res: Response) => {
  const data = await getAllAlbums(req.query);

  return sendResponse(res, data);
};

export const updateAlbumController = async (req: any, res: Response) => {
  const { id } = req.params as { id: string };

  const album = await updateAlbum(id, {
    title: req.body.title,
    artist: req.body.artist,
    coverUrl: req.file?.path,
  });

  return sendResponse(res, album, "Album updated");
};

export const deleteAlbumController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const result = await deleteAlbum(id);

  return sendResponse(res, result);
};
