import { NextFunction, Request, response, Response } from 'express';
import stripeConfigModel from '@models/stripeConfig.model';
import stripeAccountModel from '@models/stripeAccount.model';
import userModel from '@/models/users.model';
import { DefaultDeserializer } from 'v8';
import {HttpException} from '@exceptions/HttpException';
class StripeController {

  public stripeConfigFixture = async (req: Request, res: Response, next: NextFunction)=>{
    let existingStripeConfig
    
    try {
      existingStripeConfig = await stripeConfigModel.findOne({isDefault:true});
    } catch (error) {
      return next(error);
    }
    if(existingStripeConfig) return next();

    
    const createdConfig = new stripeConfigModel({
      tag: 'derfault',
      secretKey:process.env.STRIPE_SECRET_KEY,
      publishKey:process.env.STRIPE_PUBLISH_KEY,
      webhookKey:process.env.STRIPE_WEBHOOK_KEY,
      status:'active',
      isDefault: true
    })
    try {
      await createdConfig.save();
    } catch (error) {
      return next(error);

    }

    res.send({
      status: 'ok',
      data: {
        stripeConfigs: 'sadf'
      },
      message: 'Existing stripe configs is loaded.'
    })

  }
  
  
  public onboarding = async (req: Request, res: Response, next: NextFunction) => {

    
    const {
      userId,
      tag,
      description
  
    } = req.body;

    if(!userId)next(new HttpException(400,'User id is required.'));
    if(!tag)next(new HttpException(400,'Tag is required.'));
    /**
     * TODO: Retrieve user from qraph-ql
     * TODO: Add collection and space conditions
     */
    


    /**
     * Check status of app configuration and setup stripe client.
     */
    let existingStripeConfig:any ;
    try {
      existingStripeConfig = await stripeConfigModel.findOne({isDefault:true});
    } catch (error) {
      next(new HttpException(500, 'Sorry! An internal server error occurred please try again.'));
    }
    if(!existingStripeConfig)next(new HttpException(503, 'Admin installation is not completed for this app.'));
    let stripe;
    try {
      stripe = await require("stripe")(existingStripeConfig.secretKey);

    } catch (error) {
      /**
       * TODO: check if this error is for invalid secret key
       * TODO: its status must changed to deactivated and set some message to the community admin
       */
      next(new HttpException(503, 'Sorry we can not able to onboard any account.'));
    }
    
    /**
     * Check if onboarded account exist for this user or not;
     */
    let existingAcc: any;
    try {
      existingAcc = await stripeAccountModel.findOne({
        tag, 
        userId
      });
    } catch (error) {
      next(new HttpException(500, 'Sorry! An internal server error occurred please try again.'));
    }

    let account_link
    let stripeAcc;
    let message;
    if(existingAcc){

      try {
        existingAcc.account = await stripe.accounts.retrieve(existingAcc.account.id);
      } catch (error) {
        next(new HttpException(500, 'Sorry we can not able to retrieve your account.'));
      }

      
      if (existingAcc.account.details_submitted){
        existingAcc.status = 'onboarding-completed'

      }else{
        account_link = await this.generateAccountLink(existingAcc.account.id,stripe);
        existingAcc.status = 'onboarding-incomplete'
      }

      try {
        await existingAcc.save();
      } catch (error) {
        next(new HttpException(500, 'Sorry! An internal server error occurred please try again.'));

      }
      stripeAcc = existingAcc
      message = 'Your account is retrieved.'

    }else{
      /**
       * Create new stripe express account.
       */
      let newStripeAccount
      try {
        newStripeAccount = await stripe.accounts.create({type: "express"});
        
      } catch (error) {
        next(new HttpException(500, 'Sorry! we can not create any other account. Please try again later.'));
      }

      const createdStripeAccount = new stripeAccountModel({
        tag,
        description,
        userId,
        account: newStripeAccount,
        isDefault:true
      });

      try {
        account_link = await this.generateAccountLink(newStripeAccount.id,stripe);
        createdStripeAccount.status = 'onboarding-created'
        await createdStripeAccount.save();

      } catch (error) {
        console.log('error',error)
        next(new HttpException(500, 'Sorry! we can not generate oboarding link for your account. Please try again.'));
      }

      stripeAcc=createdStripeAccount;
      message = 'Please continue your onboarding in stripe.'
    }
   
    /**
     * TODO: check existing stripe onboarded account for these user and conditions
     */
    

    res.send({
      status:'ok',
      data:{
          status: stripeAcc.status,
          account_link: account_link? account_link : null,
          details_submitted : stripeAcc.account.details_submitted,
          charges_enabled : stripeAcc.account.charges_enabled

      },
      message
    });
    next();
  };

  /**
   * 
   * Create onboarding link from new express accounts
   * @param accountId 
   * @param stripe 
   */
  public generateAccountLink = async (accountId, stripe)=>{

    /**
     * TODO: return_url must be developed to get from frontend
     * TODO: refresh_url is where the onboarding process is started 
     */
    const refresh_url = process.env.STRIPE_REFRESH_URL;
    const return_url = process.env.STRIPE_RETURN_URL;
    let accountLinks:any;

    try {
      accountLinks = await stripe.accountLinks.create({
        type: "account_onboarding",
        account: accountId,
        refresh_url: refresh_url,
        return_url: return_url,
      }).then((link) => link.url);
      
    } catch (error) {
      console.log(error)
      return new HttpException(500, 'Sorry! we can not generate oboarding link for your account. Please try again.');

      
    }
    console.log('accountLink', accountLinks);

  return accountLinks

  }
}

export default StripeController;
