export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!re.test(email)) {
    return "Invalid email address";
  }
  return null;
}

export function validatePassword(password: string) {
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
  const numberRegex = /\d/;
  const upperCaseRegex = /[A-Z]/;

  if (password.length < 6) {
    return "Password must include at least 6 characters";
  }

  if (!specialCharRegex.test(password)) {
    return "Password must include at least one special character";
  }
  if (!numberRegex.test(password)) {
    return "Password must include at least one number";
  }
  if (!upperCaseRegex.test(password)) {
    return "Password must include at least one uppercase letter";
  }

  return null;
}

export function validateName(name: string) {
  return name.length > 0 ? null : "Name is required";
}
