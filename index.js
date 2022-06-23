const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const expressFileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const secretKey = 'shhhh'
const { nuevoParticipante } = require('./consultas')

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
app.get('/', async (req, res) => {
    res.render('index')
})

app.get('/login', async (req, res) => {
    res.render('login')
})

app.get('/registro', async (req, res) => {
    res.render('registro')
})

app.get('/administrador', async (req, res) => {
    res.render('admin')
})

app.post('/registrar', async (req, res) => {
    try {
        //obtener info de la imagen cargada
        const { foto } = req.files
        // obtener info de form
        const body = req.body
        //asigna ruta y nombre a la imagen
        const rutaImg = path.join(__dirname, 'assets', 'img', foto.name)
        //guarda imagen en local dir
        foto.mv(rutaImg, async(error) => {
            if (error) {
                res.statusCode = 500
                res.render('registrar', {
                    message: 'Registro Incorrecto'
                })

            } else {
                // si guarda la img en local dir se almacena en bd
                const respuesta = await nuevoParticipante(body, foto.name)
                if (respuesta.lenght > 0) {
                    res.statusCode = 201
                    res.render('registrar', {
                        message: `Registro correcto ${respuesta[0].email}`
                    })
                }
            }

        })

    } catch {
        res.statusCode = 500
        res.render('registrar', {
            massage: 'registro Incorrecto'
        })
    }
})

app.listen(8080, () => {
    console.log('Servidor Encendido en puerto 8080 http://localhost:8080')
})

