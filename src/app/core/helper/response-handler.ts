import { Container } from 'typedi';
import * as CryptoTS from 'crypto-ts';
import { StatusCodes } from 'http-status-codes';
import { Config } from '../config';
import HttpException from "../helper/http-exception";

const config = Container.get(Config);

export function throwAnError(error: any) {
    let message;
    let status;
    if (error && error.name && error.name === 'QueryFailedError') {
        if (error.code === 'ER_DUP_ENTRY') {
            const messageArr = error.message.split(' ');
            message = `${messageArr[messageArr.length - 1].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace('_IDX', '')} already exist.`;
            status = StatusCodes.CONFLICT;
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            message = 'Cannot add or update: a foreign key constraint fails';
            status = StatusCodes.CONFLICT;
        } else {
            message = error.sqlMessage;
            status = StatusCodes.INTERNAL_SERVER_ERROR;
        }
    } else {
        message = Object.prototype.hasOwnProperty.call(error, 'message') ? error.message : error;
        status = Object.prototype.hasOwnProperty.call(error, 'statusCode') ? error.statusCode : (error.status ? error.status : StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return returnHttpException(message, status);
}

export function sendSuccessResponse(status: number, success: boolean = true, data?: any, message?: string) {
    const returnObj: any = { status, success };
    data ? returnObj.result = data : null;
    message ? returnObj.message = message : null;
    return returnObj;
}

export function sendErrorResponse(message: string, status: number, isSuccess: boolean) {
    return new HttpException({
        status,
        success: isSuccess,
        result: message,
    }, status);
}

function returnHttpException(message: string, status: number) {
    return new HttpException(message, status);
}

/**
 * Name: Parshwa Shah
 * Purpose: Encrypt auth request data
 * Params: request, response
* */
export function encryptResonse(data: any, fingerPrint: string) {
    if (config.get('CRYPTO_STATUS') == 'true') {
        data = CryptoTS.AES.encrypt(JSON.stringify(data), fingerPrint).toString();
    }
    return data;
}