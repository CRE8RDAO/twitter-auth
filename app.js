import express from 'express'
import AuthRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import morgan from 'morgan'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  })
)
app.use('/api/auth', AuthRouter)
app.use(morgan('combined'))
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
  console.log('test heroku deploy')
}) //test heroku deploy1
