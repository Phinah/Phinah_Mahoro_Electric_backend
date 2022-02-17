import * as Sentry from '@sentry/node';
import { Response, NextFunction } from 'express';
import { SERVER_ERROR } from '../utils/constants/statusCode';
import logger from '../helpers/logger';

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

const asyncHandler = (cb: any) => async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    await cb(req, res, next);
  } catch (error:any) {
    console.log('INTERNAL ERROR', error);
    logger.error(error);
    if (isProduction || isStaging) {
      Sentry.captureException(error);
    }

    const status = error.status || SERVER_ERROR;
    console.log(error)
    return res.status(status).json({
      status,
      success:false,
      message: error.message || error.data.errorMessage,
      error: !isProduction ? error : undefined,
    });
  }
};

export default asyncHandler;
