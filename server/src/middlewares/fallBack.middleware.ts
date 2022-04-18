import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

const fallBackMiddleware = ()=>{
return async ( req: Request, res: Response, next: NextFunction) => {
  
  try {
    console.log('falback 1');

    await next();
    
    console.log('falback 3');

  } catch (error) {
    console.log('falback2 ');

    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    console.log('falback ');
    return res.status(status).json({ 
      status: 'failed',
      data:[],
      message 
    });
  }
};
}

export default fallBackMiddleware;
