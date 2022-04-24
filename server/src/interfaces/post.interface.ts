import {Schema} from "mongoose";
import { User } from "@interfaces/users.interface";
import { DonationBox } from "@interfaces/donationBox.interface";

export interface Post {
  postId: string;
  donationBoxes: Schema.Types.ObjectId[] | DonationBox[];
  user: Schema.Types.ObjectId | User[];
}
