import { t, TranslationKey } from './i18n';

/** Backend messages (English, from the API) mapped to translation keys. Unknown messages are shown as-is. */
const EXACT: Record<string, TranslationKey> = {
  'A user with this email already exists.': 'srv.userEmailExists',
  'At least one active administrator is required.': 'srv.lastAdmin',
  'Authentication is required.': 'srv.authRequired',
  'Authenticated user not found.': 'srv.authUserNotFound',
  'Check the submitted fields.': 'srv.checkFields',
  'Enter a password': 'srv.enterPassword',
  'Enter a valid email address': 'srv.enterEmail',
  'Enter the additional hour rate': 'srv.enterAdditionalRate',
  'Enter the daily rate': 'srv.enterDailyRate',
  'Enter the email address': 'srv.enterEmailAddress',
  'Enter the first hour rate': 'srv.enterFirstRate',
  'Enter the new password': 'srv.enterNewPassword',
  'Enter the spot number': 'srv.enterSpotNumber',
  'Enter the user name': 'srv.enterUserName',
  'Enter the vehicle color': 'srv.enterColor',
  'Enter the vehicle license plate': 'srv.enterPlate',
  'Enter the vehicle model': 'srv.enterModel',
  'Enter your current password': 'srv.enterCurrentPassword',
  'Enter your email address': 'srv.enterYourEmail',
  'Enter your password': 'srv.enterYourPassword',
  'Exit time cannot be before entry time.': 'srv.exitBeforeEntry',
  'Grace period cannot be negative': 'srv.graceNegative',
  'Grace period cannot exceed 120 minutes': 'srv.graceMax',
  'Invalid email or password.': 'srv.invalidCredentials',
  'Invalid license plate. Use the format ABC1234 or ABC1D23.': 'srv.invalidPlate',
  'Invalid spot': 'srv.invalidSpot',
  'Parking spot not found.': 'srv.parkingSpotNotFound',
  'Pricing configuration not found.': 'srv.pricingNotFound',
  'Rounding cannot exceed 60 minutes': 'srv.roundingMax',
  'Rounding must be at least 5 minutes': 'srv.roundingMin',
  'Select a role': 'srv.selectRole',
  'The additional hour rate must be greater than zero': 'srv.additionalRatePositive',
  'The color must have at most 30 characters': 'srv.colorMax',
  'The current password is incorrect.': 'srv.currentPasswordWrong',
  'The daily rate must be greater than zero': 'srv.dailyRatePositive',
  'The email must have at most 160 characters': 'srv.emailMax',
  'The first hour rate must be greater than zero': 'srv.firstRatePositive',
  'The license plate must have at most 10 characters': 'srv.plateMax',
  'The model must have at most 80 characters': 'srv.modelMax',
  'The name must have at most 100 characters': 'srv.nameMax',
  'The operation could not be completed. Please try again.': 'srv.operationFailed',
  'The password must have 8 to 72 characters': 'srv.passwordRange',
  'The password must have at most 72 characters': 'srv.passwordMax',
  'The password must include at least one letter and one number': 'srv.passwordRule',
  'The request body is missing or malformed.': 'srv.bodyMalformed',
  'The start date cannot be after the end date.': 'srv.startAfterEnd',
  'There are no available spots for a new check-in.': 'srv.noSpots',
  'This account is not active.': 'srv.accountInactive',
  'This operation conflicts with existing data.': 'srv.conflict',
  'This vehicle already has an open parking session.': 'srv.openSession',
  'This vehicle is not parked.': 'srv.notParked',
  'Too many failed sign-in attempts. Try again in 15 minutes.': 'srv.tooMany',
  'Use at most 2 decimal places': 'srv.decimals',
  'Use up to 10 letters, numbers, or hyphens': 'srv.spotFormat',
  'User not found.': 'srv.userNotFound',
  'You cannot remove your own administrator access.': 'srv.ownAdmin',
  'You do not have permission to perform this action.': 'srv.noPermission',
  'Unexpected error while handling request': 'srv.unexpected'
};

/** Messages with a variable part, matched by pattern. */
const PATTERNS: { pattern: RegExp; key: TranslationKey; param?: string }[] = [
  { pattern: /^Spot (.+) is not available\.$/, key: 'srv.spotNotAvailable', param: 'number' },
  { pattern: /^A spot with number (.+) already exists\.$/, key: 'srv.spotExists', param: 'number' },
  { pattern: /^Data integrity violation/, key: 'srv.conflict' }
];

/** Translates a message from the API. Falls back to the original text when there is no match. */
export function translateServerMessage(message: string): string {
  const exact = EXACT[message];
  if (exact) {
    return t(exact);
  }
  for (const { pattern, key, param } of PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      return t(key, param ? { [param]: match[1] } : undefined);
    }
  }
  return message;
}
