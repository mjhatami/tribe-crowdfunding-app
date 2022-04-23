import { NextFunction, Request, response, Response } from 'express';
import donationBoxModel from '@models/donationBox.model';
import userModel from '@/models/users.model';
import postModel from '@models/post.model';
import stripeAccModel from '@models/stripeAccount.model';
import { DefaultDeserializer } from 'v8';
import {HttpException} from '@exceptions/HttpException';
import { isDataURI } from 'class-validator';
import { TribeClient, Types } from '@tribeplatform/gql-client'
import { isEmpty } from '@utils/util';


const shortid = require("shortid");

class DonationBoxController {

  /**
   * Just available for members whom have at least one stripe onboarded account.
   * Route: Post /donation-box 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  public createDonationBox = async (req: Request, res: Response, next: NextFunction)=>{
    
    const {
      title,
      description,
      amount
    }:{title:String,description:String,amount:Number, postId:String} = req.body;
    const userId = req.user.id

    if (isEmpty(amount))return next(new HttpException(400, 'The amount is required.'));
    if (amount < 200 )return next(new HttpException(400, 'The amount is not valid.'));
    if (isEmpty(title))return next(new HttpException(400, 'The title is required.'));
    let existingUser;
    try {
      existingUser = await userModel.findOne({tribeId:userId}).populate('stripeAccount');
    } catch (error) {
      console.log(error);
      return next(new HttpException(500, 'Internal server error.'));
    }

    if(isEmpty(existingUser.stripeAccount))return next(new HttpException(500, 'Internal server error.'));
    
    const stripeAcc = existingUser.stripeAccount[0];
    // let stripeAccount;
    // try {
    //   stripeAccount = await stripeAccModel.find({userId, })
    // } catch (error) {
    //   return new HttpException(500, 'Internal server error.');
    // }

    // if(!stripeAccount){
    // 
    // }
    const donationCode = shortid.generate();

    const createdDonationBox = new donationBoxModel({
      title,
      description,
      amount,
      donationCode,
      user: existingUser.id,
      stripeAccount: stripeAcc.id,
    });

    // existingPost.donationBox.push(createdDonationBox);


    try {
      await createdDonationBox.save()
    } catch (error) {
      return next(new HttpException(500, 'Internal server error.'));
    }

    res.send({
      status: 'ok',
      data: {
        donationBox: createdDonationBox
      },
      message: 'Your donation box created'
    })

  }

  /**
   * Route : public Get /donation-box/:donationCode
   * @param req 
   * @param res 
   * @param next 
   */
  public getDonationBoxByCode = async (req: Request, res: Response, next: NextFunction)=>{
    
    const {donationCode} = req.params
    console.log(req.params, req.query)
    console.log('cccc', req.user)

    // const tribeClient = new TribeClient({
    //   graphqlUrl: process.env.GRAPHQL_URL,
    //   clientId: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    //   onError:err =>{
    //     console.log(err)
    //   }

    // })

    const t = new TribeClient({
      graphqlUrl: process.env.GRAPHQL_URL,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFudDh5dHZxSVEiLCJuZXR3b3JrSWQiOiJCWU4yQkJvQTZ4IiwibmV0d29ya0RvbWFpbiI6Im1qaGF0YW1pLnRyaWJlcGxhdGZvcm0uY29tIiwidG9rZW5UeXBlIjoiVVNFUiIsImVudGl0eUlkIjpudWxsLCJwZXJtaXNzaW9uQ29udGV4dCI6bnVsbCwicGVybWlzc2lvbnMiOm51bGwsInNlc3Npb25JZCI6InZTRzJQQlpnNnRLSERBeFVBaXMyZFZ5T1Y1UEk4Y3JvRk50NnYyVjBXSmFEd1Zmc1Y3IiwiaWF0IjoxNjUwNzAwNTYwLCJleHAiOjE2NTMyOTI1NjB9.7romYFh1t2H1yL_7f2c_4NTZMoZ9LP6xoF9VwWsCKCM',
      onError:err=>{
        console.log(err)
      }
    })
    // tribeClient.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFudDh5dHZxSVEiLCJuZXR3b3JrSWQiOiJCWU4yQkJvQTZ4IiwibmV0d29ya0RvbWFpbiI6Im1qaGF0YW1pLnRyaWJlcGxhdGZvcm0uY29tIiwidG9rZW5UeXBlIjoiVVNFUiIsImVudGl0eUlkIjpudWxsLCJwZXJtaXNzaW9uQ29udGV4dCI6bnVsbCwicGVybWlzc2lvbnMiOm51bGwsInNlc3Npb25JZCI6IlYyY3BsM1AzR2M5ak1HSWRXb2RxdlFETU5qZktaY2VvazdHT01zaXk1Yk1ySURvZDl5IiwiaWF0IjoxNjUwNjM0MzE0LCJleHAiOjE2NTMyMjYzMTR9.qXxKhzS92MwukKZv9BfZ-Nm-un5UQpl4wHL9AQLHzR0');

    // console.log(await t)
    let member =await t.members.get({id:req.user.id})
    console.log('mem',member)

    const postType = await t.posts.listPostTypes({ limit: 20 })
    console.log('TTTTTT',postType);

    const post = await t.posts.create({
      spaceId: "HRS6CvcfoufD",
      input: {
        postTypeId: "DYWFm0jBJ17OKLQ",
        mappingFields: [
          {
            key: "title",
            type: Types.PostMappingTypeEnum.text,
            value: "\"<p>Introduce yourself, spark connections and conversation, and welcome other Tribe Campfire Community members as we continue to grow.</p>\""
          },
          // {
          //   key: "content",
          //   type: Types.PostMappingTypeEnum.html,
          //   value: "\"<button><a href='http://mjhatami.com'>This is the button</a></button>\""
          // }
        ],
        publish: true,
      }
    })

    console.log('posted',post)


  //   let existingDonationBox:any;
  //   try {
  //     existingDonationBox = await donationBoxModel.find({donationCode});
  //   } catch (error) {
  //     res.send({
  //       status: 'failed',
  //       data: {
          
  //       },
  //       message: 'The donation box not found.'
  //     })
  //   }
  //   if(!existingDonationBox)res.send({
  //     status: 'failed',
  //     data: {
        
  //     },
  //     message: 'The donation box not found.'
  //   })


  //   res.send({
  //     status: 'ok',
  //     data: {
  //       donationBox: existingDonationBox
  //     },
  //     message: 'Your donation box created'
  //   }) 
  res.send({
      status: 'ok',
      data: {
        
      },
      message: 'Your donation box created'
    })
  } 

}

export default DonationBoxController;
