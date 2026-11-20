import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './models';
import { t } from './i18n';

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
      return t('error.unreachable');
    }
    return t('error.generic');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return t('error.unknown');
}
