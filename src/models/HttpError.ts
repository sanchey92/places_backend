export default class HttpError extends Error {
  code: number;
  constructor(message: any, errorCode: number) {
    super(message);
    this.code = errorCode
  }
}