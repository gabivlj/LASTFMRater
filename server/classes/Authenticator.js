module.exports = class Authenticator {
  static isEmpty(input) {
    return (
      (typeof input === 'string' && input.trim() === '') ||
      (Array.isArray(input) && input.length === 0) ||
      input === null ||
      input === undefined ||
      Object.keys(input).length === 0
    );
  }

  static AuthenticateUserInputLogin({ email, password }) {
    const errors = {};
    if (this.isEmpty(email)) {
      errors.email = 'Invalid credentials.';
    }
    if (this.isEmpty(password) || password.length < 4) {
      errors.password = 'Invalid credentials';
    }
    return {
      isValid: this.isEmpty(errors),
      errors,
    };
  }

  static AuthenticateUserInputRegister({
    email,
    username,
    password,
    password2,
  }) {
    const errors = {};
    if (this.isEmpty(email)) {
      errors.email = 'Invalid email.';
    } else if (!email.includes('@')) {
      errors.email = 'Invalid email, it should have atleast an @';
    }

    if (this.isEmpty(password) || password.length < 4) {
      errors.password = 'Password needs to be atleast 4 characters long.';
    }

    if (password !== password2) {
      errors.password2 = 'Passwords need to match';
    }

    if (this.isEmpty(username) || username.length < 4) {
      errors.username = 'Username should be atleast 4 characters long.';
    }

    return {
      isValid: this.isEmpty(errors),
      errors,
    };
  }
};
