export function isSyntaxError(exception: any): exception is SyntaxError {
  return exception instanceof SyntaxError;
}

export function isReferenceError(exception: any): exception is ReferenceError {
  return exception instanceof ReferenceError;
}

export function isTypeError(exception: any): exception is TypeError {
  return exception instanceof TypeError;
}

export function isRangeError(exception: any): exception is RangeError {
  return exception instanceof RangeError;
}
export function isURIError(exception: any): exception is URIError {
  return exception instanceof URIError;
}

export function isEvalError(exception: any): exception is EvalError {
  return exception instanceof EvalError;
}
