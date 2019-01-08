import * as mongoose from 'mongoose';

export interface IDoctor extends mongoose.Document {
    username: string;
    userid: string;
    vericode: string;
  };
  
  export const DoctorSchema = new mongoose.Schema({
    username: {type: String, required: true},
    userid: {type: String, required: true},
    vericode: {type: String, required: true}
  });
  
  const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);
  export default Doctor;