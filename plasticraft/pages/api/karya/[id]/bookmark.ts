import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from '../../../../lib/session';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  if (!session?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const creationId = parseInt(id as string, 10);

  if (req.method === 'POST') {
    try {
      await prisma.bookmark.create({
        data: {
          userId: session.id,
          creationId: creationId,
        },
      });
      return res.status(201).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Gagal bookmark karya' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.bookmark.delete({
        where: {
          userId_creationId: {
            userId: session.id,
            creationId: creationId,
          },
        },
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Gagal menghapus bookmark' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}