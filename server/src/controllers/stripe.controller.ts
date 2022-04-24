import { NextFunction, Request, response, Response } from 'express';
import stripeConfigModel from '@models/stripeConfig.model';
import stripeAccountModel from '@models/stripeAccount.model';
import userModel from '@/models/users.model';
import intentModel from '@/models/intent.model';
import { DefaultDeserializer } from 'v8';
import {HttpException} from '@exceptions/HttpException';
import { isEmpty } from '@/utils/util';
/**
 * Interfaces
 */
import { StripeAccount } from '@interfaces/stripeAccount.interface';
import { StripeConfig } from '@interfaces/stripeConfig.interface';
import donationBoxModel from '@/models/donationBox.model';

 
class StripeController {

  /**
   * ! Must be removed in production.
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  
  public stripeConfigFixture = async (req: Request, res: Response, next: NextFunction)=>{
    let existingStripeConfig;
    
    try {
      existingStripeConfig = await stripeConfigModel.findOne({isDefault:true});
    } catch (error) {
      return next(error);
    }
    if(!isEmpty(existingStripeConfig)) return res.send({
      status: 'ok',
      data: {
        stripeConfigs: existingStripeConfig
      },
      message: 'Existing stripe config is loaded.'
    })

    
    const createdConfig = new stripeConfigModel({
      tag: 'default',
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
        stripeConfigs: createdConfig
      },
      message: 'Stripe config created.'
    })

  }
  
  /**
   * Available for all members of a community in account setting.
   * @param req 
   * @param res 
   * @param next 
   */
  public onboarding = async (req: Request, res: Response, next: NextFunction) => {

    const {
      tag,
      description
  
    } = req.body;
    const userId = req.user.id;

    // if(!userId) next(new HttpException(400,'User id is required.'));
    if(isEmpty(tag))return next(new HttpException(400,'Tag is required.'));
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
      return next(new HttpException(500, 'Sorry! An internal server error occurred please try again.'));
    }
    if(isEmpty(existingStripeConfig))return next(new HttpException(503, 'Admin installation is not completed for this app.'));
    /**
     * TODO: set the type from stripe sdk.
     */
    let stripe:any;
    try {
      stripe = await require("stripe")(existingStripeConfig.secretKey);
    } catch (error) {
      /**
       * TODO: check if this error is for invalid secret key
       * TODO: its status must changed to deactivated and set some message to the community admin
       */
      return next(new HttpException(503, 'Sorry we can not able to onboard any account.'));
    }

    console.log(userId)
    /**
     * Check if onboarded account exist for this user or not;
     */
    let user:any;
    try {
      user = await userModel.findOne({tribeId:userId}).populate('stripeAccount');
    } catch (error) {
      return next(new HttpException(500, 'Internal server error.'));
    }
    console.log(user)
    
    // let existingAcc:any;
    // try {
    //   existingAcc = await stripeAccountModel.findOne({
    //     tag, 
    //     userId
    //   });
    // } catch (error) {
    //   next(new HttpException(500, 'Sorry! An internal server error occurred please try again.'));
    // }

    let existingAcc;
    if(isEmpty(user)){
      user = new userModel({
        tribeId: userId,
        networkId:req.user.networkId,
        networkDomain:req.user.networkDomain
      })
    }
    if(!isEmpty(user.stripeAccount)){
      existingAcc = user.stripeAccount[0]
    }
    console.log(!isEmpty(user.stripeAccount));
    console.log(user.stripeAccount);
    console.log('e',existingAcc);

    let account_link:string;
    let stripeAcc:any;
    let message: string = 'unknown message';
    if(!isEmpty(existingAcc)){
      try {
        existingAcc.account = await stripe.accounts.retrieve(existingAcc.account.id);
      } catch (error) {
        return next(new HttpException(500, 'Sorry we can not able to retrieve your account.'));
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
        return next(new HttpException(500, 'Sorry! An internal server error occurred please try again.'));
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
        console.log('sdf',error)
        return next(new HttpException(500, 'Sorry! we can not create any other account. Please try again later.'));
      }

      const createdStripeAccount = new stripeAccountModel({
        tag,
        description,
        user: user.id,
        account: newStripeAccount,
        stripeConfig: existingStripeConfig.id ,
        isDefault:true
      });
      user.stripeAccount.push(createdStripeAccount)

      try {
        account_link = await this.generateAccountLink(newStripeAccount.id,stripe);
        createdStripeAccount.status = 'onboarding-created'
        await createdStripeAccount.save();
        await user.save()

      } catch (error) {
        console.log('error',error)
        return next(new HttpException(500, 'Sorry! we can not generate oboarding link for your account. Please try again.'));
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
  };

  public createIntent = async (req: Request, res: Response, next: NextFunction) => {
    
    const {amount} = req.body;
    const {donationCode} = req.params

    if(isEmpty(amount))return next(new HttpException(400,'amount is required.'));

    let existingDonationBox;
    try {
      existingDonationBox = await donationBoxModel.findOne({donationCode}).populate({
        path:'stripeAccount',
        populate:{
          path:'stripeConfig',
          populate:{
            path:'stripeFeeConfig'
          }
        }
      });
    } catch (error) {
      console.log(error);
      return next(new HttpException(404,'The donation box not found..'));
    }
    if(isEmpty(existingDonationBox)) return next(new HttpException(404,'The donation box not found..'));


    let stripe:any;
    try {
      stripe = await require("stripe")(existingDonationBox.stripeAccount.stripeConfig.secretKey);
    } catch (error) {
      /**
       * TODO: check if this error is for invalid secret key
       * TODO: its status must changed to deactivated and set some message to the community admin
       */
      return next(new HttpException(503, 'Sorry we can not able to pay now, please try again later.'));
    }

    /**
     * TODO: Intent fee calculation must be in a private function 
     */

    const stripeFixedFee = existingDonationBox.stripeAccount.stripeConfig.stripeFeeConfig.stripe.fixed
    const stripPercentageFee = existingDonationBox.stripeAccount.stripeConfig.stripeFeeConfig.stripe.percentage

    const applicationFee = Math.ceil(((amount * stripPercentageFee) / 100 + stripeFixedFee) * 100)



    let stripeIntent;
    try {
      stripeIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'CAD',
        setup_future_usage: 'off_session',
        // payment_method_types: ['card'],
        automatic_payment_methods: {
          enabled: true,
        },
        payment_method_options: {
          card:{
            request_three_d_secure : 'any'
          }
        },
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: existingDonationBox.stripeAccount.account.id,
        },
        metadata:{
          from:'tribe-crowdfunding-app',
          donationBoxId: existingDonationBox.id
        }
      });
    } catch (error) {
      return next(new HttpException(503, 'Sorry we can not able to pay now, please try again later.'));
    }

    console.log(stripeIntent);

    const createdIntent = new intentModel({
      intent:stripeIntent,
      donationBox: existingDonationBox.id
    });

    try {
      await createdIntent.save()
    } catch (error) {
      return next(new HttpException(500, 'Internal server error.'));
    }
    

   
    res.send({
      status:'ok',
      data:{
         config: {
           publishKey: existingDonationBox.stripeAccount.stripeConfig.publishKey
         },
         clientSecret: createdIntent.intent.client_secret
      },
      message: 'Intent created.'
    });


  }

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
