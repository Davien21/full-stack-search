import { model, Schema } from "mongoose";

interface ICity {
  name: string;
}

const citySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  }
);

const cityModel = model("city", citySchema);

export default cityModel;
