import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'POST').end();
  }

  const serializedCookie = serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: -1, 
  });

  res.setHeader('Set-Cookie', serializedCookie);

  res.status(200).json({ message: 'Logout berhasil' });
}