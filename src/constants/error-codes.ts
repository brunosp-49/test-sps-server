export const ErrorCodes = {
  validationFailed: "error.validationFailed",
  invalidCredentials: "error.invalidCredentials",
  missingOrInvalidAuthorizationHeader: "error.missingOrInvalidAuthorizationHeader",
  invalidOrExpiredToken: "error.invalidOrExpiredToken",
  userNotFound: "error.userNotFound",
  emailAlreadyRegistered: "error.emailAlreadyRegistered",
  emailAlreadyInUse: "error.emailAlreadyInUse",
  internalError: "error.internalError",
  tooManyRequests: "error.tooManyRequests",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
