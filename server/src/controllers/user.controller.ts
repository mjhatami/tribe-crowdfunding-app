import { NextFunction, Request, response, Response } from 'express';
import donationBoxModel from '@models/donationBox.model';
import userModel from '@/models/users.model';
import { DefaultDeserializer } from 'v8';
import {HttpException} from '@exceptions/HttpException';
class UserController {

  /**
   * 
   * 
   */
  public getTokenByMemberId = async (req: Request, res: Response, next: NextFunction)=>{
    
  }
  
}

export default UserController;
