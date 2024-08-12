import express, { Request, Response } from "express";
import validateById from "@/middlewares/validateById";
import { NotFoundError } from "@/config/errors";
import hotelsModel from "@/models/hotels";
import { successResponse } from "@/utils/response";

const router = express.Router();

router.get(
  "/hotels/:id",
  validateById("Invalid hotel id"),
  async (req: Request, res: Response) => {

    const id = req.params.id;
    const hotel = await hotelsModel.findById(id);
    if (!hotel) throw new NotFoundError("Hotel not found");
    res.send(successResponse("Hotel was fetched successfully", hotel));
  }
);

const hotelsRouter = router;

export default hotelsRouter;
