import { decompress } from 'icbon';
import { Request, Response, NextFunction } from 'express';

export function compressed(request: Request, response: Response, next: NextFunction): void {
  if (request.headers['content-type'] !== 'application/x-icbon-compressed') {
    return next(null);
  }

  const chunks: Buffer[] = [];

  request.on('data', (chunk: Buffer): void => {
    chunks.push(chunk);
  });

  request.on('end', (): void => {
    try {
      request.body = decompress(Buffer.concat(chunks));
      return next(null);
    } catch (error) {
      return next(error);
    }
  });

  request.on('error', next);
}

export default compressed;
