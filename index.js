const express = require('express')
const app = express()
const{ engine } = require('express-handlebars')
const expressFileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const secretKey = 'shhhh'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/bootstrap-css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')))

app.use(expressFileUpload({
    limits: 5_000_000,
    abortOnLimit: true,
    responseOnLimit: 'El peso de la imagen que intentas subir supera el limite permitido'
})
)

app.engine(
    'handlebars', engine({
       defaultLayout: 'main',
       layoutsDir: `${__dirname}/views/componentes`
    })
)
app.set('view engine', 'handlebars')

//RUTAS
app.get('/', async(req, res) => {
    res.render('index')
})

app.get('/login', async(req, res) => {
    res.render('login')
})

app.get('/registro', async(req, res) => {
    res.render('registro')
})

app.get('/administrador', async(req, res) => {
    res.render('admin')
})

app.post('/registrar', async(req,res) => {
    const {email, nombre, password, repPass, aniosExp, especialidad, foto, estado} = req.body
    try {
        const participante = await nuevoParticipante(email, nombre, password, repPass, aniosExp, especialidad, foto, estado)
        res.render(JSON.stringify(participante))
        res.statusCode = 201
    } catch (error){
        return error
    } 

    
})

app.listen(8080, () => {
    console.log('Servidor Encendido en puerto 8080 http://localhost:8080')
})

