package cssd2101.yueats.validation;


import jakarta.validation.GroupSequence;

@GroupSequence({NotBlankCheck.class, SizeCheck.class})
public interface ValidationOrder {
}

