import { UserCollection } from "../models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';
import { SessionCollection } from "../models/session.js";

export const registerUser = async (payload) => {
    const user = await UserCollection.findOne({ email: payload.email });
    if (user) {
        throw new createHttpError(409, 'Email in use');
    }
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return await UserCollection.create({
        ...payload,
        password: encryptedPassword
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
      accessTokenValidUntil: Date.now() + 15 * 60 * 1000, // 15 min
      refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};
