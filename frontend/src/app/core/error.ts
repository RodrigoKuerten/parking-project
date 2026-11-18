import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './models';

export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ApiError | null;
    if (body?.fields) {
      const firstFieldError = Object.values(body.fields)[0];
      if (firstFieldError) {
        return firstFieldError;
      }
    }
    if (body?.message) {
      return body.message;
    }
    if (error.status === 0) {
      return 'The API is unreachable. Check that the backend is running.';
    }
    return 'The request could not be completed.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
