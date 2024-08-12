interface IResponse<T = null> {
  message: string;
  data: T;
  success: boolean;
}

export interface ISuccessResponse<T> extends IResponse<T> {}

export interface IErrorResponse extends IResponse {}
