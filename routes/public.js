import express from "express";
// assim chaomo a lib prisma client
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // bcrypt para criptografar a senha no banco
import e from "express";
import jwt from 'jsonwebtoken'

//citando o prisma

const prisma = new PrismaClient();

// ao inves de importar tudo no express , eu so preciso do metodo ROUTER
const router = express.Router();

// pego o JWT lá da env

const JWT_SECRET = process.env.JWT_SECRET;

// CADASTRO leo

router.post("/cadastro", async (req, res) => {
    try {
        const user = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);

        const userDB = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashPassword,
            },
        });
        res.status(201).json(userDB);
    } catch (err) {
        res.status(500).json({ message: "error no servidor" });
    }
});

// ROTA LOGIN
router.post("/login", async (req, res) => {
    try {
        const userInfo = req.body;

        // batendo no banco de dados pelo prisma
        const user = await prisma.user.findUnique({
            where: { email: userInfo.email },
        });

        // checko se o usuario existe no banco
        if (!user) {
            return res.status(404).json({ message: "usuario n encontrado" });
        }

        // compara a senha da requisicao com o hash descriptografado do bcypto
        const isMatch = await bcrypt.compare(userInfo.password, user.password);
        if (!isMatch) {
            return res
                .status(404)
                .json({ message: "email existe , senha errada" });
        }

        // GERAR TOKEN JWT e dentro dele pego e guardo o ID , o secret 

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })


        // deixei um response c meu token e mensage apenas para me basear, como o metodo RES so aceito 1 resposta a sintaxe fica assim
        res.status(200).json({
            token: token,
            message: "Logou com sucesso"
        })





        //res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "deu erro" });
    }
});

export default router;
