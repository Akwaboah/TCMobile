import { AxiosError } from 'axios';
import { ErrorResponse } from './types';

export class Exception extends Error { }

export class RemoteException<T = any> extends Exception {

  constructor(private readonly raw: T) {
    super();
  }
  getCause(): T {
    return this.raw;
  }
  isInternalError(): boolean {
    if (this.raw instanceof AxiosError) {
      const { response, message } = this.raw;
      return response?.status === 500 || message === 'Network Error';
    }
    return false;
  }
  getErrors(): T | ErrorResponse {
    if (this.raw instanceof AxiosError) {
      const { response, message } = this.raw;
      const internal = this.isInternalError();
      if (internal) {
        return {
          errors: { message: 'Something went wrong, try again' },
          internal,
        };
      }
      return {
        errors: { message: response?.data.errors || response?.data.detail || message },
        internal
      };
    }
    return this.raw;
  }
}
