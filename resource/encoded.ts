import { Decoder } from 'icbon';
import { Request, Response, NextFunction } from 'express';

export function encoded(request: Request, response: Response, next: NextFunction): void {
  if (request.headers['content-type'] !== 'application/x-icbon-encoded') {
    return next(null);
  }

  const chunks: Buffer[] = [];

  request.on('data', (chunk: Buffer): void => {
    chunks.push(chunk);
  });

  request.on('end', (): void => {
    try {
      request.body = new Decoder(Buffer.concat(chunks)).any();
      return next(null);
    } catch (error) {
      return next(error);
    }
  });

  request.on('error', next);
}

export default encoded;
