import {Schema, model, Document, Types} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  places: any[]
}

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, minlength: 6},
  image: {type: String, required: true},
  places: [{type: Types.ObjectId, required: true, ref: 'Place'}]
})

userSchema.plugin(uniqueValidator)

export default model<IUser>('User', userSchema);