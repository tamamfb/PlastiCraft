import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '../../../lib/session';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession(req);
  if (!session?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userId = session.id;
    const bookmarks = await prisma.bookmark.findMany({
      where: { 
        userId: userId,
        creation: {
          type: 'KARYA'
        }
      },
      include: {
        creation: {
          include: {
            _count: {
              select: { likes: true },
            },
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    const bookmarkedCreations = bookmarks.map(bm => bm.creation);

    const userLikes = await prisma.like.findMany({ where: { userId: userId } });
    const likedCreationIds = new Set(userLikes.map(like => like.creationId));
    
    const bookmarksWithStatus = bookmarkedCreations.map(creation => ({
      ...creation,
      isLiked: likedCreationIds.has(creation.id),
      isBookmarked: true,
    }));

    res.status(200).json(bookmarksWithStatus);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data bookmark' });
  }
}