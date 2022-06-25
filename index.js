const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const expressFileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const secretKey = 'shhhh'
const consultas = require('./consultas')
const url = require('url')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/bootstrap-css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')))

// Configuracion de tamaño permitido de la imagen
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

//Get INDEX
app.get('/', async (req, res) => {
    const datos = await consultas.obtieneTodosParticipantes()

    res.render('index', {
        data: datos
    })
})
//Get Favicon.ico
app.get('/favicon.ico', async (req, res) => {
    res.send('')
})
// Get LOGIN
app.get('/login', async (req, res) => {
    res.render('login')
})
// Post LOGIN
app.post('/login', async (req, res) => {
    try {
        const body = req.body
        const respuesta = await consultas.accesoParticipante(body)
        if (respuesta) {
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + 120,
                data: respuesta
            }, secretKey)
            var id = respuesta.id
            res.statusCode = 200
            res.redirect(`/datos?token=${token}`)
        } else {
            res.statusCode = 401
            res.render('login', {
                message: 'Acceso Incorrecto, Verifique las Credenciales'
            })
        }
    } catch {
        res.statusCode = 500
        res.render('login', {
            message: 'Acceso Incorrecto'
        })
    }
})
// Get REGISTRO
app.get('/registro', async (_req, res) => {
    res.render('registro')
})
// Post REGISTRO
app.post('/registro', async (req, res) => {
    try {
        //Obtiene informacion de la imagen
        const { foto } = req.files
        // Obtiene informacion del formulario
        const body = req.body
        // Asigna ruta y nombre para la imagen
        const rutaImg = path.join(__dirname, 'assets', 'img', foto.name)

        // guarda la imagen en local
        foto.mv(rutaImg, async (err) => {
            // En caso de error lo retorna
            if (err) {
                res.statusCode = 500
                res.render('registro', {
                    message: 'Registro Incorrecto / Problema al guardar la imagen'
                })
            } else {
                //Si guarda la imagen en directorio, guarda informacion del fomulario en base de datos
                const respuesta = await consultas.nuevoParticipante(body, foto.name)
                //Si regresa el registro insertado en la base de datos, retorna un codigo y mensaje
                if (respuesta.length > 0) {
                    res.statusCode = 201
                    res.render('registro', {
                        message: `Registro Correcto Email:  ${respuesta[0].email}`
                    })
                }
            }
        })
    } catch {
        res.statusCode = 500
        res.render('registro', {
            message: 'Registro Incorrecto'
        })
    }
})
// Get DATOS
app.get('/datos', async (req, res) => {
    const { token } = url.parse(req.url, true).query

    jwt.verify(token || '', secretKey, async (err, decoded) => {
        if (err) {
            res.status(401).send({
                error: '401 acceso no autorizado',
                message: err.message
            })
        } else {
            res.render('datos', {
                data: decoded.data,
                token: token
            })
        }
    })
})
// Get ADMINISTRADOR
app.get('/administrador', async (_req, res) => {
    const datos = await consultas.obtieneTodosParticipantes()

    res.render('admin', {
        data: datos
    })
})
// Eliminar PARTICIPANTE/:id
app.delete('/participante/:id', async (req, res) => {
    const { id } = req.params
    const token = req.header('authorization')

    jwt.verify(token || '', secretKey, async (err, decoded) => {
        if (err) {
            res.status(401).send({
                error: '401 acceso no autorizado',
                message: err.message
            })
        } else {
            const respuesta = await consultas.eliminarParticipante(id)
            if (respuesta > 0) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        }
    })
})
// Put PARTICIPANTE/:id */
app.put('/participante/:id', async (req, res) => {
    try {
        const { id } = req.params
        const token = req.header('authorization')
        const body = req.body

        if (body.password === '') {
            res.json({ status: false, message: 'Ingrese una contraseña' })
        } else if (body.password != body.password2) {
            res.json({ status: false, message: 'Las contraseñas no coinciden' })
        } else {

            jwt.verify(token || '', secretKey, async (err, decoded) => {
                if (err) {
                    res.status(401).send({
                        error: '401 acceso no autorizado',
                        message: err.message
                    })
                } else {
                    const respuesta = await consultas.actualizarParticipante(body, id)
                    if (respuesta) {
                        const token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + 120,
                            data: respuesta
                        }, secretKey)

                        res.json({ status: true, message: 'Datos Actualizados', token: token })
                    } else {
                        res.json({ status: false, message: 'Error al Actualizar' })
                    }
                }
            })
        }
    } catch {
        res.statusCode = 500
        res.render('datos', {
            messageError: 'Actualización Incorrecta'
        })
    }
})
// actualizar participante
app.put('/participante', async (req, res) => {
    try {
        const token = req.header('authorization')
        const body = req.body

        jwt.verify(token || '', secretKey, async (err, decoded) => {
            if (err) {
                res.status(401).send({
                    error: '401 acceso no autorizado',
                    message: err.message
                })
            } else {
                const respuesta = await consultas.actualizaEstadoParticipante(body)

                if (respuesta > 0) {
                    res.json({ status: true, message: 'Estado Actualizado' })
                } else {
                    res.json({ status: false, message: 'Error al Actualizar Estado' })
                }
            }
        })
    } catch {
        res.statusCode = 500
        res.render('registro', {
            message: 'Actualización de Estadi Incorrecta'
        })
    }
})

//Servidor
app.listen(8080, () => {
    console.log('Servidor Encendido en puerto 8080 http://localhost:8080')
})