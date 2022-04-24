import { model, Schema, Document } from 'mongoose';
import { StripeConfig } from '@interfaces/stripeConfig.interface';

const stripeConfigSchema: Schema = new Schema({
  tag: {type: String, required: true},
  secretKey: {type: String, required: true},
  publishKey: {type: String, required: true},
  webhookKey: {type: String, required: true},
  stripeFeeConfig:{type: Schema.Types.ObjectId, ref:'StripeFeeConfig'},
  status: {type: String, required: true, default:'active'},
  isDefault: {type: Boolean, required: true, default:false},

},{
  collection:'StripeConfig',
  timestamps: true,
});

stripeConfigSchema.set('toJSON', { getters: true });
stripeConfigSchema.set('toObject', { getters: true });

const stripeConfigModel = model<StripeConfig & Document>('StripeConfig', stripeConfigSchema);

export default stripeConfigModel;
