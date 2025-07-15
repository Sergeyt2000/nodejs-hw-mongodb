import createHttpError from 'http-errors';

export const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            const errors = error.details.map((err) => err.message);
            next(new createHttpError.BadRequest(errors));
        }
    };
};
