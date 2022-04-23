import { model, Schema, Document } from 'mongoose';
import { Post } from '@interfaces/post.interface';

const postSchema: Schema = new Schema({
  postId: {type: String, required: true},
  donationBox:[{type: Schema.Types.ObjectId, ref:'DonationBox'}],
  user:{type: Schema.Types.ObjectId, ref:'User'}

},{
  collection:'Post',
  timestamps: true,
});

postSchema.set('toJSON', { getters: true });
postSchema.set('toObject', { getters: true });

const postModel = model<Post & Document>('Post', postSchema);

export default postModel;
