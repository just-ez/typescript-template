class GenericResponseError  {
  message: string;
  code: number;
  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

function throwError(message: string | any, code = 400): NativeError {
  throw new GenericResponseError(code, message);
}
const handleCastErrorExceptionForInvalidObjectId = () => throwError('Invalid Parameter. Resource Not Found');

const isCastError = (error = '') => error.toString().indexOf('CastError') !== -1;

export {
  throwError,
  isCastError,
  handleCastErrorExceptionForInvalidObjectId
};
