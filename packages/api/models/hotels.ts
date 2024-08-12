import { model, Schema } from "mongoose";

interface IHotel {
  chain_name: string;
  hotel_name: string;
  addressline1: string;
  addressline2: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  countryisocode: string;
  star_rating: number;
}

const hotelSchema = new Schema<IHotel>(
  {
    chain_name: { type: String, default: "" },
    hotel_name: { type: String, required: true, index: true },
    addressline1: { type: String, required: true },
    addressline2: { type: String },
    zipcode: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    country: { type: String, required: true, index: true },
    countryisocode: { type: String, required: true },
    star_rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const hotelModel = model("hotel", hotelSchema);

export default hotelModel;
