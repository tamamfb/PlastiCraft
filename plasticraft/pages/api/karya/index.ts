import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { categoryBahanId, categoryProdukId, sortBy } = req.query;

  // --- LOGIKA ORDER BY DENGAN OPSI BARU ---
  let orderBy: Prisma.CreationOrderByWithRelationInput;

  switch (sortBy) {
    case 'oldest':
      orderBy = { tanggal: 'asc' };
      break;
    case 'most_liked':
      orderBy = { likes: { _count: 'desc' } }; // Urutkan berdasarkan jumlah like
      break;
    default: // 'newest' atau jika tidak ada parameter
      orderBy = { tanggal: 'desc' };
      break;
  }
  // --- AKHIR LOGIKA ORDER BY ---

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
        // Sertakan _count untuk likes agar bisa di-debug jika perlu
        userId: true,
        _count: {
          select: { likes: true }
        }
      },
      orderBy: orderBy,
    });

    return res.status(200).json(creations);
  } catch (error) {
    console.error('Failed to fetch creations:', error);
    return res.status(500).json({ error: 'Gagal mengambil data karya.' });
  }
}