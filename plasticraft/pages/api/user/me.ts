import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const token = req.cookies['auth-token'];

  if (!token) {
    return res.status(401).json({ error: 'Tidak terautentikasi' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT Secret tidak terkonfigurasi');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json(decoded);
  } catch (error) {
    return res.status(401).json({ error: 'Token tidak valid atau kadaluarsa' });
  }
}