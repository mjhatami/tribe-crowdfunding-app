import { NextFunction, Request, Response } from 'express';
import stripeConfigModel from '@models/stripeConfig.model'
import stripeFeeConfigModel from '@models/stripeFeeConfig.model'
import {isEmpty} from '@utils/util'
import {HttpException} from '@exceptions/HttpException'
class SettingController {
  
  public getStripeConfigs = async (req: Request, res: Response, next: NextFunction) => {
    let existingStripeConfigs;
    try {
      existingStripeConfigs = await stripeConfigModel.find();
    } catch (error) {
      return next(new HttpException(500, 'Internal server error.'));

    }

    res.send({
      status: 'ok',
      data: {
        stripeConfigs: existingStripeConfigs
      },
      message: 'stripe configs loaded.'
    })

  };



  public createStripeConfig = async (req: Request, res: Response, next: NextFunction) => {
    const {
      tag,
      secretKey,
      publishKey,
      webhookKey,
      isDefault,
      feeConfig
    } = req.body;

    /**
     * TODO: Request validation required.
     * TODO: Secrets and keys must validate before save in db
     */

    let existingStripeConfig;
    try {
      existingStripeConfig = await stripeConfigModel.find({isDefault:true});
    } catch (error) {
      return next(new HttpException(500, 'Internal server error.'));
    }
    console.log(existingStripeConfig);
    const newStripeConfig = new stripeConfigModel({
      tag,
      secretKey,
      publishKey,
      webhookKey,
      isDefault: existingStripeConfig.length ? isDefault : true
    });

    /**
     * TODO: stripeFeeConfigs must be in app db fixture and auto set here by currency and country
     */
    let createdStripeFeeConf
    if(!isEmpty(feeConfig)){
      createdStripeFeeConf = new stripeFeeConfigModel({
        feeName: 'CAD default',
        currency: 'CAD',
        stripe:{
          fixed:feeConfig.fixed,
          percentage:feeConfig.percentage
        },
        status:'active',
        isDefault:true
      });
      try {
        await createdStripeFeeConf.save();
      } catch (error) {
        console.log(error)
        return next(new HttpException(500, 'Internal server error.'));


      }
      newStripeConfig.stripeFeeConfig= createdStripeFeeConf.id;
    }






    if(isDefault){
      existingStripeConfig.forEach(async conf => {
        conf.isDefault =false;
        try {
          await conf.save()
        } catch (error) {
          return next(new HttpException(500, 'Internal server error.'));

        }
      });

      
    }




    try {
      await newStripeConfig.save();
    } catch (error) {
      return next(new HttpException(500, 'Internal server error.'));

    }


    res.send({
      status: 'ok',
      data: {
        stripeConfig: newStripeConfig
      },
      message: 'New stripe host added.'
    })
  }
}

export default SettingController;
