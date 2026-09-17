import express from 'express'
// CASO eu fizesse importdo tipo comons.js , faria assim abaixo
// const express = require("express") 

import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from './middlewares/auth.js'

// gurdando o express numa. variavel 
const app = express()
app.use(express.json())
// preciso avisar pra minha aplicacao. q irei usar json


app.use('/', publicRoutes)
app.use('/', auth, privateRoutes)


//escutando na porta 3000
app.listen(3000, () => console.log("ROdando com arroy function puto, vem de lado os guri"))


//leoferrarezi /// BrasilArgentin
// mongodb+srv://leoferrarezi:BrasilArgentin@users.rd8onts.mongodb.net/?appName=Users