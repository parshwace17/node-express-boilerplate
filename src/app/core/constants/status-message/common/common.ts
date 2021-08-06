import { StatusCodes } from 'http-status-codes';

export const DATA_NOT_FOUND = {
    status: StatusCodes.NOT_FOUND,
    message: 'Data not found',
};

export const ENCRYPTION_ERROR = {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Error in encryption (decryptor middleware)',
};
export const BROWSER_FINGERPRINT_REQUIRED = {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Browser fingerprint required',
};