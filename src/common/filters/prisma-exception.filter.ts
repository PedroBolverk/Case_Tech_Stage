import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      return res.status(status).json({
        statusCode: status,
        error: typeof response === 'string' ? response : (response as any).message ?? 'Error',
        path: req.url,
        timestamp,
      });
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      let status = HttpStatus.BAD_REQUEST;
      let message = 'Database error';
      if (exception.code === 'P2025') { status = HttpStatus.NOT_FOUND; message = 'Record not found'; }
      else if (exception.code === 'P2002') { status = HttpStatus.CONFLICT; message = `Unique constraint failed on: ${(exception.meta as any)?.target}`; }

      return res.status(status).json({ statusCode: status, error: message, path: req.url, timestamp });
    }

    return res.status(500).json({ statusCode: 500, error: 'Internal Server Error', path: req.url, timestamp });
  }
}
