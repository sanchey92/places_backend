import {Schema, model, Document, Types} from "mongoose";

export type CoordinatesType =  {
  lat: number,
  lng: number
}

export interface IPlaceSchema extends Document {
  title: string,
  description: string,
  image: string,
  address: string,
  location: CoordinatesType,
  creator: Types.ObjectId
}

const placeSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  image: {type: String, required: true},
  address: {type: String, required: true},
  location: {
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
  },
  creator: {type: Types.ObjectId, required: true, ref: 'User'}
})

export default model<IPlaceSchema>('Place', placeSchema);