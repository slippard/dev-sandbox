import * as mongoose from 'mongoose';
import { Bool } from 'aws-sdk/clients/clouddirectory';

export interface IUser extends mongoose.Document {
    username: string;
    userid?: string;
    messageCount: number;
    bots?: Array<Number>;
    sandbox?: Boolean;
    fs?: Boolean;
    files?: Array<object>;
    doctor: boolean;
    dev: boolean;
    repositories?: Array<String>;
    vericode?: number;
  };
  
  export const UserSchema = new mongoose.Schema({
    username: {type:String, required: true},
    userid: {type:String, required: true},
    messageCount: {type: Number, required: true},
    bots: {type: Array, required: false},
    sandbox: {type: Boolean, required: false},
    fs: {type: Boolean, required: false},
    files: {type: Array, required: false},
    doctor: {type: Boolean, required: true},
    dev: {type: Boolean, required: true},
    repositories: {type: Array, required: false},
    vericode: {type: Number, required: false}
  });
   
  const DUser = mongoose.model<IUser>('User', UserSchema);
  export default DUser;

