import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  id:{type: String,required: true},
  name: {type: String,required: true},

});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
