import { NextApiRequest } from 'next';
import { verify } from 'jsonwebtoken';

export interface SessionPayload {
  id: number;
  email: string;
  role: string;
}

export async function getSession(req: NextApiRequest): Promise<SessionPayload | null> {
  const token = req.cookies['auth-token'];

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET) as SessionPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}