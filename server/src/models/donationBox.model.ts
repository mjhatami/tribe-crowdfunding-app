import { model, Schema, Document } from 'mongoose';
import { DonationBox } from '@interfaces/donationBox.interface';

const donationBoxSchema: Schema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  amount: {type: Number, required: true},
  numberOfPayment: {type: String, required: true, default:0},
  donationCode: {type:String, required:true},
  earn: {type: Number, required: true, default: 0},
  stripeAccount:{type: Schema.Types.ObjectId, ref:'StipeAccount'},
  user:{type: Schema.Types.ObjectId, ref:'User'}

},{
  collection:'DonationBox',
  timestamps: true,
});

donationBoxSchema.set('toJSON', { getters: true });
donationBoxSchema.set('toObject', { getters: true });

const donationBoxModel = model<DonationBox & Document>('DonationBox', donationBoxSchema);

export default donationBoxModel;
