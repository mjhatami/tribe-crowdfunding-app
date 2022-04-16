import { model, Schema, Document } from 'mongoose';
import { StripeFeeConfig } from '@interfaces/stripeFeeConfig.interface';

const stripeFeeConfigSchema: Schema = new Schema({
  currency: {type: String, required: true},
  publishKey: {type: String, required: true},
  stripe: {
    static:{type: String, required: true, default: 0},
    percentage: {type: Number, required: true, default: 0}
  },
  status: {type: String, required: true, default:'active'},
  default: {type: Boolean, required: true, default:false},

});

stripeFeeConfigSchema.set('toJSON', { getters: true });
stripeFeeConfigSchema.set('toObject', { getters: true });

const stripeConfigModel = model<StripeFeeConfig & Document>('StripeFeeConfig', stripeFeeConfigSchema);

export default stripeConfigModel;
