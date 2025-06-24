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

    // 1. Ambil data pengguna dan hitung relasi yang lebih sederhana (kreasi)
    const userQuery = prisma.user.findUnique({
      where: { id: loggedInUserId },
      include: {
        _count: {
          select: {
            creations: true,
            // Kita hapus followers & following dari sini untuk dihitung manual
          },
        },
      },
    });

    // 2. Hitung jumlah 'followers' (orang yang mengikuti user ini) secara terpisah
    const followersCountQuery = prisma.follow.count({
      where: { followingId: loggedInUserId },
    });

    // 3. Hitung jumlah 'following' (orang yang di-follow oleh user ini) secara terpisah
    const followingCountQuery = prisma.follow.count({
      where: { followerId: loggedInUserId },
    });
    
    // 4. Jalankan semua query secara bersamaan untuk efisiensi
    const [user, followersCount, followingCount] = await Promise.all([
        userQuery,
        followersCountQuery,
        followingCountQuery
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // 5. Gabungkan hasilnya ke dalam satu objek
    const { password, ...userData } = user;
    userData._count.followers = followersCount;
    userData._count.following = followingCount;

    return res.status(200).json(userData);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}