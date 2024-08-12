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
    const city = await countryModel.findById(id);
    if (!city) throw new NotFoundError("Country not found");

    res.send(successResponse("Country was fetched successfully", city));
  }
);

const countriesRouter = router;

export default countriesRouter;
