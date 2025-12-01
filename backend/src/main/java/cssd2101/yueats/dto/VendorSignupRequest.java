package cssd2101.yueats.dto;

public record VendorSignupRequest(
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String password,
        String businessName
) {
}
