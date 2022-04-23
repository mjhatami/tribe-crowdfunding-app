import {Schema} from "mongoose";
import { StripeAccount } from "./stripeAccount.interface";
import { DonationBox } from "./donationBox.interface";
import { Post } from "./post.interface";

export interface User {
  tribeId: string;
  networkId: string;
  networkDomain: string;
  stripeAccount?: Schema.Types.ObjectId[] | StripeAccount[];
  donationBox?: Schema.Types.ObjectId[] | DonationBox[];
  posts?: Schema.Types.ObjectId[] | Post[];
}
