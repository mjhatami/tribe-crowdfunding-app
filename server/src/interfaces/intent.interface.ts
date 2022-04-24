import {Schema} from "mongoose";
import { User } from "@interfaces/users.interface";
import { DonationBox } from "@interfaces/donationBox.interface";
import stripe from 'stripe'

export interface Intent {
  intent: stripe.PaymentIntent;
  status: string;
  donationBox: Schema.Types.ObjectId | DonationBox;

}
