
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export class MakananController {

    public async getMakanan(req: Request, res: Response) {
        const prisma = new PrismaClient();
        const makananRepo = await prisma.makanan.findMany({
            take: 7
        });
        try {
            return res.status(201).send({
                status: 200,
                data: makananRepo,
                message: "Berhasil get makanan"
            })
        } catch (err) {
            return res.status(400).send({
                status: 400,
                message: "Ga bisa get makanan coba cek koneksi internet kamu"
            })
        }
    }

    public async addMakanan(req: Request, res: Response) {
        const prisma = new PrismaClient();
        const files = req.files as {[fieldName: string]: Express.Multer.File[]}

        
        for (const filesArray in files) {
            const fileString = files[filesArray]
            for(const fileNew of fileString) {
                const makanan = await prisma.makanan.create({
                    data: {
                        deskripsi_makanan: req.body.deskripsi_makanan,
                        gambar_makanan: fileNew.originalname,
                        harga: parseInt(req.body.harga_makanan), 
                        nama_makanan: req.body.nama_makanan
                    }
                })
                try {
                    return res.status(201).send({
                        status: 201,
                        data: makanan,
                        message: "Berhasil menambahkan makanan"
                    })
                } catch (err) {
                    return res.status(400).send({
                        status: 400,
                        message: "Ga bisa nambah makanan nih"
                    })
                } 
            }
        }
    }
}