import { NextFunction, Request, Response } from 'express';
import stripeConfigModel from '@models/stripeConfig.model'
class SettingController {
  
  public getStripeConfigs = async (req: Request, res: Response, next: NextFunction) => {
    let existingStripeConfigs;
    try {
      existingStripeConfigs = await stripeConfigModel.find();
    } catch (error) {
      next(error);
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
      isDefault
    } = req.body;

    /**
     * TODO: Request validation required.
     * TODO: Secrets and keys must be validate before save in db
     */

    let existingStripeConfig;
    try {
      existingStripeConfig = await stripeConfigModel.find({isDefault:true});
    } catch (error) {
      return next(error);
    }
    console.log(existingStripeConfig);
    const newStripeConfig = new stripeConfigModel({
      tag,
      secretKey,
      publishKey,
      webhookKey,
      isDefault: existingStripeConfig.length ? isDefault : true
    });




    if(isDefault){
      existingStripeConfig.forEach(async conf => {
        conf.isDefault =false;
        try {
          await conf.save()
        } catch (error) {
          return next(error);
        }
      });

      
    }


    try {
      await newStripeConfig.save();
    } catch (error) {
      return next(error);
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
