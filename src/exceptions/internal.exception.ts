import { HttpException } from "./root";

export class InternalException extends HttpException{
    constructor(error: any, message: string, errorCode: number){
        super(500, message, errorCode, error);
    } 
}