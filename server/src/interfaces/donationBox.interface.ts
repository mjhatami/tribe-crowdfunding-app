import {Schema} from 'mongoose';
import { User } from '@interfaces/users.interface';
import { Post } from '@interfaces/post.interface';
import {StripeAccount} from '@interfaces/stripeAccount.interface';


export interface DonationBox {
  title: string;
  description?: string;
  amount: Number;
  numberOfPayment?: Number;
  donationCode: string;
  earn: Number;
  status: string;
  stripeAccount: Schema.Types.ObjectId | StripeAccount;
  user: Schema.Types.ObjectId | User;
}
