import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    username: string;
    userid?: string;
    messageCount: number;
    bots?: Array<Number>;
    files: Array<string>;
    doctor: boolean;
  };
  
  export const UserSchema = new mongoose.Schema({
    username: {type:String, required: true},
    userid: String,
    messageCount: Number,
    bots: {type: Array, required: false},
    files: {type: Array, required: false},
    doctor: {type: Boolean, required: true},
  });
  
  const DUser = mongoose.model<IUser>('User', UserSchema);
  export default DUser;