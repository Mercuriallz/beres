import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';

export class MinumanController {


    public async getMinuman(req: Request, res: Response) {
        const prisma = new PrismaClient();
        const minumanRepo = await prisma.minuman.findMany({
            take: 7
        });
        try {
            return res.status(200).send({
                status: 200,
                data: minumanRepo,
                message: "Berhasil get minuman"
            })
        } catch (err) {
            return res.status(400).send({
                status: 400,
                message: "Gagal mendapatkan minuman"
            })
        }
    }

    public async addMinuman(req: Request, res: Response) {
        const prisma = new PrismaClient();
        const files = req.files as {[fieldName: string]: Express.Multer.File[]}

        for (const filesArray in files) {
            const fileString = files[filesArray]
            for(const fileNew of fileString) {
                const minumanData = await prisma.minuman.create({
                    data: {
                        deskripsi_minuman: req.body.deskripsi_minuman,
                        gambar_minuman: fileNew.originalname,
                        harga: Number(req.body.harga),
                        nama_minuman: req.body.nama_minuman
                    }
                })
                try {
                    return res.status(201).send({
                        status: 201,
                        data: minumanData,
                        message: "berhasil menambah data minuman"
                    })
                } catch (err) {
                    return res.status(201).send({
                        status: 400,
                        message: "Ga bisa nambah minuman cek lagi koneksi lu breee"
                    })
                }
            }
        }
    }
}