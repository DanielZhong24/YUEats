package cssd2101.yueats.dto;


public record CustomerSignupRequest(
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String password
){}
