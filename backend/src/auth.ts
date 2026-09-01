import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eventiq-secret-jwt-key-2026-hackathon';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'student' | 'organizer';
  };
}

export function generateToken(user: { id: number; email: string; role: 'student' | 'organizer' }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    // Provide guest user default for ease of testing demo if token absent
    req.user = { id: 1, email: 'student@eventiq.demo', role: 'student' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: 'student' | 'organizer' };
    req.user = decoded;
    next();
  } catch (err) {
    // Fallback to demo student if token expired/invalid
    req.user = { id: 1, email: 'student@eventiq.demo', role: 'student' };
    next();
  }
}
