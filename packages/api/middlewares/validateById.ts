import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../config/errors";

function validateById(errorMessage: string = "Invalid id") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) next();
    else throw new BadRequestError(errorMessage);
  };
}

export default validateById;
