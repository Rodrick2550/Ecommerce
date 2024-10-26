import { prismaClient } from ".."
import { NextFunction, Request, Response } from "express"
import { compareSync, hashSync } from "bcrypt"
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad.requests";
import { ErrorCode } from "../exceptions/root";
import { signUpSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not.found";

export const signup = async (req:Request, res:Response, next: NextFunction) => {
        signUpSchema.parse(req.body);
        const {email,name,password} = req.body

        let user = await prismaClient.user.findFirst({where:{email}});

        if(user){
            throw new BadRequestException('User already exists', ErrorCode.BadRequest);
        }

        user = await prismaClient.user.create({
            data:{
            email,
            name,
            password:hashSync(password,10)
            }
         })
         res.json(user);

}

export const login = async (req:Request, res:Response) => {

    const {email,password} = req.body;

    let user = await prismaClient.user.findFirst({where:{email}});
    if(!user){
        throw new NotFoundException('User not found', ErrorCode.NotFound);

    }
    if(!compareSync(password,user.password)){
        throw new BadRequestException('Invalid password', ErrorCode.BadRequest);
    }

    const token = jwt.sign({id:user.id},JWT_SECRET);

    res.json({ user, token });
}

export const me = async (req:Request, res:Response) => {

    res.json(req.user);
}




