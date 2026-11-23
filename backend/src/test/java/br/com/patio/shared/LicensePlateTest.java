package br.com.patio.shared;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LicensePlateTest {

    @Test
    @DisplayName("accepts legacy and Mercosul license plate formats")
    void acceptsValidFormats() {
        assertThat(LicensePlate.isValid("ABC1234")).isTrue();
        assertThat(LicensePlate.isValid("ABC1D23")).isTrue();
    }

    @Test
    @DisplayName("accepts Mercosul 5th character only from A to J")
    void mercosulFifthCharacterIsAToJ() {
        assertThat(LicensePlate.isValid("ABC1J23")).isTrue();
        assertThat(LicensePlate.isValid("ABC1A23")).isTrue();
        assertThat(LicensePlate.isValid("ABC1K23")).isFalse();
        assertThat(LicensePlate.isValid("ABC1Z23")).isFalse();
        assertThatThrownBy(() -> LicensePlate.requireValid("ABC1M23"))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    @DisplayName("normalizes lowercase input and separators")
    void normalizesInput() {
        assertThat(LicensePlate.normalize("abc-1d23")).isEqualTo("ABC1D23");
        assertThat(LicensePlate.requireValid("abc-1234")).isEqualTo("ABC1234");
    }

    @Test
    @DisplayName("rejects license plates outside the supported formats")
    void rejectsInvalidFormats() {
        assertThat(LicensePlate.isValid("ABC123")).isFalse();
        assertThat(LicensePlate.isValid("AB12345")).isFalse();
        assertThatThrownBy(() -> LicensePlate.requireValid("ABC123"))
                .isInstanceOf(BusinessRuleException.class);
    }
}
