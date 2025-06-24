import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Role } from '@prisma/client';
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: Role };
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        foto: true,
        _count: {
          select: {
            creations: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
}