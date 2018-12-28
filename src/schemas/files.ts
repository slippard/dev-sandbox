import * as mongoose from 'mongoose';

export interface IFile extends mongoose.Document {
    filename: string;
    filesize: string;
    fileowner: string;
    fileurl: String 
    date: string;
    public: boolean;
  };
  
  export const FileSchema = new mongoose.Schema({
    filename: {type:String, required: true},
    filesize: {type:String, required: true},
    fileowner: {type: String, required: true},
    fileurl: {type: String, required: true},
    date: {type: String, required: false},
    public: {type: Boolean, required: true},
  });
  
  const File = mongoose.model<IFile>('File', FileSchema);
  export default File;