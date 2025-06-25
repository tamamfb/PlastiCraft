import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { getSession } from '../../../lib/session';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { categoryBahanId, categoryProdukId, sortBy } = req.query;
  const session = await getSession(req);

  let orderBy: Prisma.CreationOrderByWithRelationInput;
  switch (sortBy) {
    case 'oldest':
      orderBy = { tanggal: 'asc' };
      break;
    case 'most_liked':
      orderBy = { likes: { _count: 'desc' } };
      break;
    default:
      orderBy = { tanggal: 'desc' };
      break;
  }

  try {
    const creations = await prisma.creation.findMany({
      where: {
        type: 'KARYA',
        ...(categoryBahanId && { categoryBahanId: parseInt(categoryBahanId as string) }),
        ...(categoryProdukId && { categoryProdukId: parseInt(categoryProdukId as string) }),
      },
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        gambar: true,
        userId: true,
        _count: {
          select: { likes: true }
        }
      },
      orderBy: orderBy,
    });

    if (!session) {
      return res.status(200).json(creations);
    }

    const userId = session.id;
    const userLikes = await prisma.like.findMany({ where: { userId: userId } });
    const userBookmarks = await prisma.bookmark.findMany({ where: { userId: userId } });

    const likedCreationIds = new Set(userLikes.map(like => like.creationId));
    const bookmarkedCreationIds = new Set(userBookmarks.map(bm => bm.creationId));

    const creationsWithStatus = creations.map(creation => ({
      ...creation,
      isLiked: likedCreationIds.has(creation.id),
      isBookmarked: bookmarkedCreationIds.has(creation.id),
    }));

    return res.status(200).json(creationsWithStatus);

  } catch (error) {
    console.error('Failed to fetch creations:', error);
    return res.status(500).json({ error: 'Gagal mengambil data karya.' });
  }
}