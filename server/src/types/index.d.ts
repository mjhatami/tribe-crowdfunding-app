import * as e from "express";
import { ModelAttributes } from "sequelize/types";

/**
 * TODO: Usually, I would import this type from the tribe sdk if it exists.
 * TODO: In this case, I did not found the type so I decided to hard-code it.
 */

export interface JWTUser {
    id: string;
    networkId?: string;
    networkDomain?: string;
    tokenType?: string;
    entityId?: string;
    permissionContext?: string;
    permissions?: string;
    sessionId?: string;
    iat?: string;
    exp?: string;
}

  
  declare module "express" {
    interface Request extends e.Request {
      user?: JWTUser;
    }
    // interface Response extends e.Response {
    //   json(obj: ResponseObject): any;
    // }
    interface NextFunction extends e.NextFunction {}
  }