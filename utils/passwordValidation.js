const passwordValidator = {
  // Regular expression for password validation
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>/?])(?!.*\s).{16,}$/,

  // Function to validate password
  validatePassword: (password) => {
    if (!password) return { isValid: false, message: "Password is required" };

    const checks = {
      length: password.length >= 16,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};:'",.<>/?]/.test(password),
      noSpaces: !/\s/.test(password),
    };

    const failedChecks = [];

    if (!checks.length) failedChecks.push("be at least 16 characters long");
    if (!checks.lowercase)
      failedChecks.push("include at least one lowercase letter");
    if (!checks.uppercase)
      failedChecks.push("include at least one uppercase letter");
    if (!checks.number) failedChecks.push("include at least one number");
    if (!checks.special)
      failedChecks.push("include at least one special character");
    if (!checks.noSpaces) failedChecks.push("not contain any spaces");

    return {
      isValid: failedChecks.length === 0,
      message:
        failedChecks.length > 0
          ? `Password must ${failedChecks.join(", ")}`
          : "Password is valid",
    };
  },
};
