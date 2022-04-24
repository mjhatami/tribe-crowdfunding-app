import {Schema} from "mongoose";
import { User } from "@interfaces/users.interface";
import { StripeConfig } from "@interfaces/stripeConfig.interface";
import { DonationBox } from "@interfaces/donationBox.interface";
import { Post } from "@interfaces/post.interface";
import stripe from 'stripe';

/**
 * TODO: the account attr account must be developed.
 */
export interface StripeAccount {
  tag: string;
  description: string;
  account: stripe.Account;
  user: Schema.Types.ObjectId |User;
  stripeConfig:Schema.Types.ObjectId | StripeConfig;
  donationBox:Schema.Types.ObjectId[] | DonationBox[];
  status: string;
  isDefault: boolean;
}

