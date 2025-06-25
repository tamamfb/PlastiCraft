
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getSession } from '../../../lib/session';

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFileLocally = async (file: formidable.File): Promise<string> => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const newFilePath = path.join(uploadsDir, file.newFilename);
  fs.renameSync(file.filepath, newFilePath);
  return `/uploads/${file.newFilename}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession(req);
    if (!session?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const loggedInUserId = session.id;

    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;

    const updateData: { name?: string; email?: string; foto?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (files.foto) {
      const photoFile = Array.isArray(files.foto) ? files.foto[0] : files.foto;
      const localPath = await saveFileLocally(photoFile);
      updateData.foto = localPath;
    }

    await prisma.user.update({
      where: { id: loggedInUserId },
      data: updateData,
    });
    
    const updatedFullUser = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      include: {
        _count: {
          select: {
            creations: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!updatedFullUser) {
        return res.status(404).json({ message: "Gagal mengambil data setelah update."});
    }

    const { password, ...result } = updatedFullUser;
    res.status(200).json(result);

  } catch (error) {
    console.error('API Update Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}