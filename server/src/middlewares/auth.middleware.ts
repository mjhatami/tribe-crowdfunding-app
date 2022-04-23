import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import jwt from 'jsonwebtoken';
import { decode } from 'punycode';
import {JWTUser} from '@/types';
const auth = async (req: Request, res: Response, next: NextFunction)=>{

    /**
     * TODO: I don't find any validation method in the SDK
     * TODO: This middleware must changed to use tribe auth service
     * TODO: or tribe gql user validation method
     */
    const token : string =  String(req.query.accessToken)
    if(isEmpty(token)) return next(new HttpException(401, 'Access token is required.'));
    let decoded = await jwt.decode(token) as unknown as JWTUser;
    // console 
    req['user'] = {...decoded}

    next()
 
}

export default auth;
