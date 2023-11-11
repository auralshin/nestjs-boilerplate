import { Error as MongooseError } from 'mongoose';

export function isDivergentArray(
  exception: unknown,
): exception is MongooseError.DivergentArrayError {
  return exception instanceof MongooseError.DivergentArrayError;
}

export function isMissingSchema(
  exception: unknown,
): exception is MongooseError.MissingSchemaError {
  return exception instanceof MongooseError.MissingSchemaError;
}

export function isDocumentNotFound(
  exception: unknown,
): exception is MongooseError.DocumentNotFoundError {
  return exception instanceof MongooseError.DocumentNotFoundError;
}

export function isObjectExpected(
  exception: unknown,
): exception is MongooseError.ObjectExpectedError {
  return exception instanceof MongooseError.ObjectExpectedError;
}

export function isObjectParameter(
  exception: unknown,
): exception is MongooseError.ObjectParameterError {
  return exception instanceof MongooseError.ObjectParameterError;
}

export function isStrictMode(
  exception: unknown,
): exception is MongooseError.StrictModeError {
  return exception instanceof MongooseError.StrictModeError;
}

export function isVersion(
  exception: unknown,
): exception is MongooseError.VersionError {
  return exception instanceof MongooseError.VersionError;
}

export function isValidator(
  exception: unknown,
): exception is MongooseError.ValidatorError {
  return exception instanceof MongooseError.ValidatorError;
}

export function isCastError(
  exception: unknown,
): exception is MongooseError.CastError {
  return exception instanceof MongooseError.CastError;
}

export function isOverwriteModel(
  exception: unknown,
): exception is MongooseError.OverwriteModelError {
  return exception instanceof MongooseError.OverwriteModelError;
}

export function isParallelSave(
  exception: unknown,
): exception is MongooseError.ParallelSaveError {
  return exception instanceof MongooseError.ParallelSaveError;
}

export function isParallelValidate(
  exception: unknown,
): exception is MongooseError.ParallelValidateError {
  return exception instanceof MongooseError.ParallelValidateError;
}

export function isValidation(
  exception: unknown,
): exception is MongooseError.ValidationError {
  return exception instanceof MongooseError.ValidationError;
}

export function isMongoose(exception: unknown): exception is MongooseError {
  return exception instanceof MongooseError;
}
