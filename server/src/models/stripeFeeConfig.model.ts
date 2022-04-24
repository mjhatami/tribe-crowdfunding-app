import { model, Schema, Document } from 'mongoose';
import { StripeFeeConfig } from '@interfaces/stripeFeeConfig.interface';

/**
 * TODO: Its id must used in stripe config
 */
const stripeFeeConfigSchema: Schema = new Schema({
  feeName:{type: String, require: true},
  currency: {type: String, required: true},
  stripe: {
    fixed:{type: Number, required: true, default: 0},
    percentage: {type: Number, required: true, default: 0}
  },
  status: {type: String, required: true, default:'active'},
  isDefault: {type: Boolean, required: true, default:false},

},{
  collection:'StripeFeeConfig',
  timestamps: true,
});

stripeFeeConfigSchema.set('toJSON', { getters: true });
stripeFeeConfigSchema.set('toObject', { getters: true });

const stripeFeeConfigModel = model<StripeFeeConfig & Document>('StripeFeeConfig', stripeFeeConfigSchema);

export default stripeFeeConfigModel;
