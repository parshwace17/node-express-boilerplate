import { StatusCodes } from 'http-status-codes';

export const USER_NOT_FOUND = {
    status: StatusCodes.NOT_FOUND,
    message: 'User not found'
}

export const EMAIL_CONFLICTS = {
    status: StatusCodes.CONFLICT,
    message: 'Email address is already in use'
}

export const USER_UPDATED = {
    status: StatusCodes.OK,
    message: 'Your profile has been updated successfully'
}

export const INCORRECT_OLD_PASSWORD = {
    status: StatusCodes.CONFLICT,
    message: 'Current password is incorrect'
}

export const PWD_UPDATED = {
    status: StatusCodes.OK,
    message: 'Your password has been updated successfully'
}