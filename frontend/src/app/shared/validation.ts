/** Mirrors the backend password policy in CreateUserRequest / ChangePasswordRequest. */
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;
