import express, { Request, Response } from "express";
import validateById from "@/middlewares/validateById";
import { NotFoundError } from "@/config/errors";
import cityModel from "@/models/cities";
import { successResponse } from "@/utils/response";

const router = express.Router();

router.get(
  "/cities/:id",
  validateById("Invalid city id"),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const city = await cityModel.findById(id);
    if (!city) throw new NotFoundError("City not found");

    res.send(successResponse("City was fetched successfully", city));
  }
);

// The routes below have been made to enable me do some E2E testing

router.post("/cities", async (req: Request, res: Response) => {
  const city = await cityModel.create(req.body);
  res.send(successResponse("City was created successfully", city));
});

router.delete(
  "/cities/:id",
  validateById("Invalid city id"),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const city = await cityModel.findByIdAndDelete(id);
    if (!city) throw new NotFoundError("City not found");

    res.send(successResponse("City was deleted successfully"));
  }
);

const citiesRouter = router;

export default citiesRouter;
