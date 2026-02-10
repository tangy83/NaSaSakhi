import { Router, Request, Response } from 'express';
import NextAuth from 'next-auth';
import { authOptions } from '../lib/auth';

const router = Router();

// NextAuth handler for all auth routes
const handler = NextAuth(authOptions);

// Convert Express req/res to Next.js format for NextAuth
router.all('/*', async (req: Request, res: Response) => {
  // Create a Next.js-like request/response object
  const nextReq = {
    ...req,
    query: { ...req.query, ...req.params },
    body: req.body,
    method: req.method,
    headers: req.headers,
    cookies: req.cookies || {},
  } as any;

  const nextRes = {
    ...res,
    send: (body: any) => res.send(body),
    json: (body: any) => res.json(body),
    status: (code: number) => {
      res.status(code);
      return nextRes;
    },
    redirect: (url: string) => res.redirect(url),
    setHeader: (name: string, value: string) => {
      res.setHeader(name, value);
      return nextRes;
    },
  } as any;

  try {
    await handler(nextReq, nextRes);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as authRouter };
