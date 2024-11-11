import { Response } from "express";
class BaseController {
  success(res: Response, data: any = [], message = 'success', httpStatus = 200){
  res.status(httpStatus).send({
      message,
      data,
    });
  
  }
  error(res: Response, error: {code: any, message: string}) {
    res.status(error.code || 400).json({
      status: 'error',
      message: error.message,
    });
  }
}

export default BaseController;
