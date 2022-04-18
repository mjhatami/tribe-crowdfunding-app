import { model, Schema, Document } from 'mongoose';
import { StripeAccount } from '@interfaces/stripeAccount.interface';

const stripeAccountSchema: Schema = new Schema({
  tag: {type: String, required: true},
  description: {type: String},
  account: {type: Object, required: true},
  userId: {type: String, required: true},  
  status: {type: String, required: true, default:'onboarding-created'},
  isDefault: {type: Boolean, required: true, default:false},

},{
  collection:'StripeAccount',
  timestamps: true,
});

stripeAccountSchema.set('toJSON', { getters: true });
stripeAccountSchema.set('toObject', { getters: true });

const stripeConfigModel = model<StripeAccount & Document>('StripeAccount', stripeAccountSchema);

export default stripeConfigModel;
