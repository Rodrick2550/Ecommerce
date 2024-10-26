import { ErrorCode, HttpException } from "./root";

export class NotFoundException extends HttpException{
    constructor(message: string, errorCode:ErrorCode){
        super(404,message, errorCode, ErrorCode.NotFound);
    }
}