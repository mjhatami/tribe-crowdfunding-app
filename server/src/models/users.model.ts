import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  tribeId : {type: String,required: true},
  networkId: {type: String,required: true},
  networkDomain: {type: String,required: true},
  stripeAccount:[{type: Schema.Types.ObjectId, ref: 'StripeAccount'}],
  donationBox:[{type: Schema.Types.ObjectId, ref: 'DonationBox'}],
  posts:[{type: Schema.Types.ObjectId, ref: 'Post'}]
},{
  collection:'User',
  timestamps: true,
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
