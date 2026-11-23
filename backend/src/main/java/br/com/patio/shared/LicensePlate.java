package br.com.patio.shared;

import java.util.Locale;
import java.util.regex.Pattern;

public final class LicensePlate {

    private static final Pattern MERCOSUL = Pattern.compile("[A-Z]{3}\\d[A-J]\\d{2}");
    private static final Pattern LEGACY = Pattern.compile("[A-Z]{3}\\d{4}");

    private LicensePlate() {
    }

    public static String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]", "");
    }

    public static boolean isValid(String value) {
        return MERCOSUL.matcher(value).matches() || LEGACY.matcher(value).matches();
    }

    public static String requireValid(String value) {
        String normalized = normalize(value);
        if (!isValid(normalized)) {
            throw new BusinessRuleException("Invalid license plate. Use the format ABC1234 or ABC1D23.");
        }
        return normalized;
    }
}
