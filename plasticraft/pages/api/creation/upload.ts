import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, CreationType, Role } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const verifyUser = (req: NextApiRequest): { id: number; role: Role } | null => {
  const token = req.cookies['auth-token'];
  if (!token) {
    console.error('[API Error] No auth-token cookie found.');
    return null;
  }
  try {
    if (!process.env.JWT_SECRET) {
      console.error('[API Error] JWT_SECRET is not defined in .env');
      throw new Error('JWT Secret not configured');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number; role: Role };
    return decoded;
  } catch (error) {
    console.error('[API Error] JWT verification failed:', error);
    return null;
  }
};

const moveFile = (file: formidable.File, type: 'image' | 'video'): string | null => {
  if (!file || !file.originalFilename) return null;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'image' ? 'images' : 'videos');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const uniqueFilename = `${Date.now()}_${file.originalFilename.replace(/\s/g, '_')}`;
  const newPath = path.join(uploadDir, uniqueFilename);
  try {
    fs.renameSync(file.filepath, newPath);
  } catch (error) {
    console.error(`[File Error] Failed to move file from ${file.filepath} to ${newPath}`, error);
    fs.copyFileSync(file.filepath, newPath);
    fs.unlinkSync(file.filepath);
  }
  return `/uploads/${type === 'image' ? 'images' : 'videos'}/${uniqueFilename}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cek otentikasi lebih awal
  const user = verifyUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Akses ditolak. Sesi tidak valid atau kadaluarsa.' });
  }

  const form = formidable({});
  
  try {
    const [fields, files] = await form.parse(req);
    console.log('[API Debug] Fields received:', fields);
    console.log('[API Debug] Files received:', Object.keys(files));

    const { 
      type, judul, categoryBahanId, categoryProdukId, 
      deskripsi, alatBahan, langkah 
    } = fields;

    // --- Validasi Input yang Ditingkatkan ---
    if (!type?.[0] || !judul?.[0] || !categoryBahanId?.[0] || !categoryProdukId?.[0]) {
      return res.status(400).json({ error: 'Data wajib (judul, tipe, kategori) tidak lengkap.' });
    }
    
    // Validasi ParseInt
    const bahanId = parseInt(categoryBahanId[0]);
    const produkId = parseInt(categoryProdukId[0]);
    if (isNaN(bahanId) || isNaN(produkId)) {
      return res.status(400).json({ error: 'Kategori bahan dan produk harus dipilih.' });
    }
    // --- Akhir Validasi Input ---

    const creationType = type[0].toUpperCase() as CreationType;
    if (creationType === 'TUTORIAL' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Hanya admin yang dapat membuat tutorial.' });
    }

    const gambarFile = files.gambar?.[0];
    if (!gambarFile) {
      return res.status(400).json({ error: 'Gambar utama wajib diunggah.' });
    }
    const gambarUrl = moveFile(gambarFile, 'image');
    if (!gambarUrl) {
      return res.status(500).json({ error: 'Gagal memproses file gambar.' });
    }

    const videoFile = files.video?.[0];
    const videoUrl = videoFile ? moveFile(videoFile, 'video') : undefined;
    
    const newCreation = await prisma.creation.create({
      data: {
        userId: user.id,
        type: creationType,
        judul: judul[0],
        categoryBahanId: bahanId,
        categoryProdukId: produkId,
        deskripsi: deskripsi?.[0] || "",
        gambar: gambarUrl,
        alatBahan: alatBahan?.[0],
        langkah: langkah?.[0],
        video: videoUrl,
      }
    });

    return res.status(201).json({ message: 'Unggah berhasil!', data: newCreation });

  } catch (error) {
    console.error('[API Catch Block] Upload error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server saat mengunggah.' });
  }
}