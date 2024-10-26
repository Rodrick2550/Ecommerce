import { ErrorCode, HttpException } from "./root";

export class UnathorizedException extends HttpException{
    constructor(message: string, errorCode:ErrorCode){
        super(401,message, errorCode, ErrorCode.Unauthorized);
    }
}