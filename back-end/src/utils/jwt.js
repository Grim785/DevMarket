import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // nên để trong .env
const JWT_EXPIRES = '7d'; // token sống 7 ngày

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
