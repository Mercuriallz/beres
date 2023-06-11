import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export class UserController {

    public async signUp(req: Request, res: Response) {
        const prisma = new PrismaClient();
        const saltRound = 10;
        const salt = bcrypt.genSaltSync(saltRound);
        const files = req.files as {[fieldName: string]: Express.Multer.File[]}
        const hash = bcrypt.hashSync(req.body.password, salt);
        console.log(files);
        console.log(req.body.name)
        console.log(req.body.username)
        console.log(req.body.password)
        console.log(req.body.image_user)

        for (const filesArray in files) {
            const fileString = files[filesArray] 
            for(const fileNew of fileString) {
                console.log("ga ada --> " + req.body.name)
                console.log("ga ada --> " + req.body.username);
                console.log( "ga ada --> " + req.body.password);
                console.log("ga ada --> " + req.body.image_user)
                const user = await prisma.users.create({
                    data: {
                        name: req.body.name,
                        username: req.body.username,
                        password: hash,
                        image_user: fileNew.originalname
                    }
                });
                if (user == null) {
                    return res.status(400).send({
                        status: 400,
                        error: "Harap isi form dengan lengkap"
                    },);
                } else {
                    console.log(req.body.name)
                    console.log(req.body.username)
                    console.log(req.body.password)  
                    return res.status(201).send({
                        status: 201,
                        data: user,
                        message: "Berhasil membuat akun anda"
                    })
                }
            }
        }
    }

    public async signIn(req: Request, res: Response) {
        const prisma = new PrismaClient();
        console.log(req.body.username);
        const findUser = await prisma.users.findMany({
            where : {
                username: req.body.username
            }
        });

        try {
            let data = bcrypt.compareSync(req.body.password, findUser[0].password);

            if (data) {
                let token = jwt.sign({
                    data: {
                        id: findUser[0].id,
                        username: findUser[0].username
                    }
                },
                'secret',
                {expiresIn: '3h'}
                );
                return res.status(200).send({
                    data: {
                        id: findUser[0].id,
                        username: findUser[0].username,
                        name: findUser[0].name,
                        image_user: findUser[0].image_user
                    },
                    token: token
                }
                );
            } else {
                return res.status(400).send({
                    status: 400,
                    message: "Cek username dan password kamu"
                })
            }
            console.log(data);
        } catch (err) { 
            return res.status(400).send({
                status: 400,
                error: err,
                message: "Ada yang salah nihhh"
            })
        }
    }
    
    public async checkToken(req: Request, res: Response){
        const {token} = req.body

        jwt.verify(token, "secret", function(err: any, decoded: any) {
            if(err){
                if(err.name == "Token Expired Error"){
                    return res.status(401).json({
                        status: 401,
                        message: "Token Expired"
                    })
                }
            }else{
                return res.status(200).json({
                    status: 200,
                    data: decoded.data,
                    message: "Token is Authorized"
                })
            }
        })
    }
}