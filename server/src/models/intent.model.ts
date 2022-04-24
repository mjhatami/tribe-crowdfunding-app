import { model, Schema, Document } from 'mongoose';
import { Intent } from '@interfaces/intent.interface';

const intentSchema: Schema = new Schema({
  intent: {type: Object, required: true},
  status: {type: String, required: true, default:'created'},
  donationBox:{type: Schema.Types.ObjectId, ref:'DonationBox'}
},{
  collection:'Intent',
  timestamps: true,
});

intentSchema.set('toJSON', { getters: true });
intentSchema.set('toObject', { getters: true });

const intentModel = model<Intent & Document>('Intent', intentSchema);

export default intentModel;
