export function isFileSystemError(
  exception: any,
): exception is NodeJS.ErrnoException {
  return exception instanceof Error && 'errno' in exception;
}

export function isENOENTError(
  exception: any,
): exception is NodeJS.ErrnoException {
  return (
    exception instanceof Error &&
    'code' in exception &&
    (exception as NodeJS.ErrnoException).code === 'ENOENT'
  );
}

export function isEACCESError(
  exception: any,
): exception is NodeJS.ErrnoException {
  return (
    exception instanceof Error &&
    'code' in exception &&
    (exception as NodeJS.ErrnoException).code === 'EACCES'
  );
}

export function isEBUSYError(
  exception: any,
): exception is NodeJS.ErrnoException {
  return (
    exception instanceof Error &&
    'code' in exception &&
    (exception as NodeJS.ErrnoException).code === 'EBUSY'
  );
}

export function isEEXISTError(
  exception: any,
): exception is NodeJS.ErrnoException {
  return (
    exception instanceof Error &&
    'code' in exception &&
    (exception as NodeJS.ErrnoException).code === 'EEXIST'
  );
}

export function isEISDIRError(
  exception: any,
): exception is NodeJS.ErrnoException {
  return (
    exception instanceof Error &&
    'code' in exception &&
    (exception as NodeJS.ErrnoException).code === 'EISDIR'
  );
}

export function isENOENTOrEACCESError(
  exception: any,
): exception is NodeJS.ErrnoException {
  return (
    exception instanceof Error &&
    'code' in exception &&
    ((exception as NodeJS.ErrnoException).code === 'ENOENT' ||
      (exception as NodeJS.ErrnoException).code === 'EACCES')
  );
}
