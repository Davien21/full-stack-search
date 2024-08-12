import express, { Request, Response } from "express";
import validateById from "@/middlewares/validateById";
import { NotFoundError } from "@/config/errors";
import countryModel from "@/models/countries";
import { successResponse } from "@/utils/response";

const router = express.Router();

router.get(
  "/countries/:id",
  validateById("Invalid country id"),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const country = await countryModel.findById(id);
    if (!country) throw new NotFoundError("Country not found");

    res.send(successResponse("Country was fetched successfully", country));
  }
);
 
const countriesRouter = router;

export default countriesRouter;
