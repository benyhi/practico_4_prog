const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const userRouter = require('./routes/usuario_routes')
const userRouterProduct = require('./routes/producto_routes')
const authRouter = require('./routes/auth_routes')

app.use(cors());            
app.use(express.json());

app.use('/usuarios', userRouter)

app.use('/productos', userRouterProduct)

app.use('/auth', authRouter)

app.listen(port, () =>{
    console.log(`servidor corriendo en el localhost:${port}`)
})