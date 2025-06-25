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
    const userCreations = await prisma.creation.findMany({
      where: { 
        userId: userId,
        type: 'KARYA'
      },
      include: {
        _count: {
          select: { likes: true },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    const userLikes = await prisma.like.findMany({ where: { userId: userId } });
    const userBookmarks = await prisma.bookmark.findMany({ where: { userId: userId } });

    const likedCreationIds = new Set(userLikes.map(like => like.creationId));
    const bookmarkedCreationIds = new Set(userBookmarks.map(bm => bm.creationId));

    const creationsWithStatus = userCreations.map(creation => ({
      ...creation,
      isLiked: likedCreationIds.has(creation.id),
      isBookmarked: bookmarkedCreationIds.has(creation.id),
    }));

    res.status(200).json(creationsWithStatus);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data kreasi' });
  }
}