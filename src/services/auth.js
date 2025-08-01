import { UserCollection } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionCollection } from '../models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/constants.js';
import jwt from 'jsonwebtoken';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) {
    throw new createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user === null) {
    throw new createHttpError(401, 'Email or password is incorrect');
  }
  const isValidPassword = await bcrypt.compare(payload.password, user.password);
  if (!isValidPassword) {
    throw new createHttpError(401, 'Email or password is incorrect');
  }
  await SessionCollection.deleteOne({ user: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + THIRTY_DAYS,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw new createHttpError(401, 'Session not found');
  }
  const isRefreshTokenValid = session.refreshTokenValidUntil > new Date();
  if (!isRefreshTokenValid) {
    throw new createHttpError(401, 'Session token expired');
  }
  const newSession = createSession();
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  const session = await SessionCollection.findById(sessionId);
  if (!session) {
    throw new createHttpError(404, 'Session not found');
  }
  await SessionCollection.deleteOne({ _id: sessionId });
  return { message: 'Successfully logged out' };
};

export const sendResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw new createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVariable('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const domain = getEnvVariable('APP_DOMAIN');
  const resetLink = `${domain}/auth/reset-pwd/${resetToken}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html: `<p>To reset password please visit this <a href="${resetLink}">link</a></p>`,
    });
  } catch {
    throw new createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, getEnvVariable('JWT_SECRET'));
    const user = await UserCollection.findById(decoded.sub);

    if (!user) {
      throw new createHttpError(404, 'User not found');
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await UserCollection.findByIdAndUpdate(user._id, {
      password: encryptedPassword,
    });

    await SessionCollection.deleteMany({ userId: user._id });
  } catch {
    throw new createHttpError(401, 'Token is expired or invalid.');
  }
};
