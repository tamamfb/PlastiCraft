import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const token = req.cookies['auth-token'];
  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = decoded.id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: userId },
      select: {
        creation: { // Ambil data 'creation' yang terkait dengan bookmark
          select: {
            id: true,
            gambar: true,
            judul: true,
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    // Ubah struktur data agar sesuai dengan tipe 'Post[]' di frontend
    const bookmarkedPosts = bookmarks.map(bookmark => bookmark.creation);

    return res.status(200).json(bookmarkedPosts);

  } catch (error) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
}