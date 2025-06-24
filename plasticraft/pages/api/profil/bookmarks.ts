import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const loggedInUserId = 1;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: loggedInUserId },
      include: {
        creation: {
          include: {
            _count: {
              select: {
                likes: true,
              }
            }
          }
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    // Ekstrak hanya data 'creation' untuk dikirim ke frontend
    const bookmarkedCreations = bookmarks.map(bookmark => bookmark.creation);

    return res.status(200).json(bookmarkedCreations);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}