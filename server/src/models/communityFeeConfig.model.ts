import { model, Schema, Document } from 'mongoose';
import { CommunityFeeConfig } from '@interfaces/communityFeeConfig.interface';

const communityConfigSchema: Schema = new Schema({
  feeName: {type: String, required: true},
  currency: {type: String, required: true},
  /**
   * TODO: community fees wih currency should be a separated 
   * TODO: Document with a cronjob fixture
   */
  community: {
    static: {type: String, required: true},
    percentage: {type: Number, required: true} 
  },
  status: {type: String, required: true},
  default: {type: Boolean, required: true},

});

const communityFeeConfigModel = model<CommunityFeeConfig & Document>('CommunityFeeConfig', communityConfigSchema);

export default communityFeeConfigModel;
