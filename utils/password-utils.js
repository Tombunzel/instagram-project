import bcrypt from "bcrypt";

function hashPassword(password) {
  return bcrypt.hash(password);
}

function verifyPassword(password, hashed_password) {
  return bcrypt.compare(password, hashed_password);
}

export { hashPassword, verifyPassword };
