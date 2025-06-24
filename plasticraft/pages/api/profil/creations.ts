import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const loggedInUserId = 1;

    const creations = await prisma.creation.findMany({
      where: { userId: loggedInUserId },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    return res.status(200).json(creations);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}