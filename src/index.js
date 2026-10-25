import express from 'express'
import formsRouter from './routes/form.route.js'
import appRoutes from './routes/app.route.js'

const app = express()

app.use(express.json())

app.use(formsRouter)
app.use(appRoutes)

app.listen(3100)

console.log('Servidor escuchando en el puerto http://localhost:3100')
