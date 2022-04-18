import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  /**
   * TODO: Write all the errors logs some where like logstash ,sentry or even files
   */
  try {
  
    const {status, message} = errorNormalizer(error);

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    return res.status(status).json({ 
      status: 'failed',
      data:{},
      message 
    });
  } catch (error) {
    const {status, message} = errorNormalizer(error);

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    return res.status(status).json({ 
      status: 'failed',
      data:{},
      message 
    });
  }
};

const errorNormalizer = (error)=>{
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  return {
    status,
    message
  };

}

export default errorMiddleware;
