import { Request, Response } from "express";
import { createSong } from "./song.service";
import { sendResponse } from "../../common/utils/response";
import fs from "fs";
import { prisma } from "../../config/db";
import { AuthRequest } from "../../types/express";

export const uploadSong = async (req: AuthRequest, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new Error("File is required");
  }
  if (!req.user) {
    throw new Error("Unauthorized");
  }

  const { title, artist } = req.body;

  const song = await createSong({
    title,
    artist,
    fileUrl: file.path,
    uploadedBy: req.user.id,
  });

  return sendResponse(res, song, "Song uploaded successfully");
};

export const streamSong = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const song = await prisma.song.findUnique({
    where: { id },
  });

  if (!song) {
    throw new Error("Song not found");
  }

  const filePath = song.fileUrl;

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    throw new Error("Range header required");
  }

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

  const contentLength = end - start + 1;

  const stream = fs.createReadStream(filePath, { start, end });

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
  });

  stream.pipe(res);
};
