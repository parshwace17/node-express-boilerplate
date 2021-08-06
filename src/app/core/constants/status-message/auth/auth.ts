import { StatusCodes } from 'http-status-codes';

export const UNAUTHORIZED = {
    status: StatusCodes.UNAUTHORIZED,
    message: 'Please login to continue'
}

export const EMAIL_ALREADY_EXISTS = {
    status: StatusCodes.CONFLICT,
    message: 'Email already exists, Please login to continue'
}

export const USER_NOT_EXIST = {
    status: StatusCodes.CONFLICT,
    message: 'Please enter valid email or password'
}

export const USER_INACTIVE = {
    status: StatusCodes.CONFLICT,
    message: 'Your account is in inactive mode, please contact Techuz admin to activate your account'
}

export const EMAIL_NOT_FOUND = {
    status: StatusCodes.NOT_FOUND,
    message: 'Email ID is not registerd with us'
}