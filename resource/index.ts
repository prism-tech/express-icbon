import { decompress, unpack } from 'icbon';
import { Request, Response, NextFunction } from 'express';

type BodyParser = (request: Request, response: Response, next: NextFunction) => Promise<void>;

const ICBON_CONTENT_TYPE_COMPRESSED: string = 'binary/icbon-compressed';
const ICBON_CONTENT_TYPE_PACKED: string = 'binary/icbon-packed';

export const icbonBodyParser: BodyParser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const contentType: string = request.headers['content-type'] || '';

  if (![ ICBON_CONTENT_TYPE_COMPRESSED, ICBON_CONTENT_TYPE_PACKED ].includes(contentType)) {
    return next(null);
  }

  try {
    request.body = await new Promise<unknown>((resolve, reject): void => {
      const chunks: Buffer[] = [];

      request.on('data', (chunk: Buffer): void => {
        chunks.push(chunk);
      });

      request.on('end', (): void => {
        try {
          if (contentType === ICBON_CONTENT_TYPE_COMPRESSED) {
            return resolve(decompress(Buffer.concat(chunks)));
          }

          if (contentType === ICBON_CONTENT_TYPE_PACKED) {
            return resolve(unpack(Buffer.concat(chunks)));
          }
        } catch (error) {
          reject(error);
        }
      });

      request.on('error', reject);
    });

    next(null);
  } catch (error) {
    next(error);
  }
};

export default icbonBodyParser;
