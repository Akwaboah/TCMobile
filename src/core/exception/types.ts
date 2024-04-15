export type ErrorResponse =
  | {errors: {message: string}; internal: true}
  | {errors: any; internal: false};
