import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Pastikan path ke prisma client sudah benar

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Hanya izinkan metode GET untuk endpoint ini
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Ambil 'userId' dari query parameter
  const { userId } = req.query;

  // Validasi input: pastikan ID ada dan merupakan string
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'User ID harus disertakan dan valid.' });
  }

  // Konversi ID menjadi angka
  const id = parseInt(userId, 10);

  // Validasi lebih lanjut: pastikan hasil konversi adalah angka yang valid
  if (isNaN(id)) {
    return res.status(400).json({ message: 'User ID harus berupa angka.' });
  }

  try {
    // Cari pengguna di database berdasarkan ID yang telah divalidasi
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      // Pilih hanya kolom yang dibutuhkan oleh frontend
      select: {
        id: true,
        name: true,        // Mengambil nama pengguna
        foto: true,  // Mengambil URL foto profil pengguna
      },
    });

    // Jika pengguna dengan ID tersebut tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    // Jika pengguna berhasil ditemukan, kirim datanya dengan status 200 OK
    return res.status(200).json(user);

  } catch (error) {
    // Tangani error yang mungkin terjadi saat query ke database
    console.error("Gagal mengambil data profil user:", error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
}
