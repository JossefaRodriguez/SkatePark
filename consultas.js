const { Pool } = require('pg')
// Configuracion para la conexion postgreSql
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '120313',
    database: 'skatepark_db',
    port: 5432
})
//Funcion para agregar un participante
async function nuevoParticipante(participante, foto) {
    try {
        const sqlQuery = {
            text: 'INSERT INTO skaters ( email, nombre, password, anios_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [participante.email, participante.nombre, participante.password, participante.anios_experiencia, participante.especialidad, foto, 0]
        }
        const resultados = await pool.query(sqlQuery)
        return resultados.rows
    } catch (error) {
        return error
    }
}
// Funcion para valiodar el acceso al participante (Login)
async function accesoParticipante(participante) {
    try {
        const sqlQuery = {
            text: 'SELECT id, email, nombre,password,anios_experiencia, especialidad FROM skaters WHERE email = $1 and password = $2',
            values: [participante.email, participante.password]
        }
        const resultados = await pool.query(sqlQuery)
        return resultados.rows[0]
    } catch (error) {
        return error
    }
}
//Funcion para seleccionar un participante por id
async function obtieneParticipante(id) {
    try {
        const sqlQuery = {
            text: 'SELECT id, email, nombre,password,anios_experiencia, especialidad FROM skaters WHERE id = $1',
            values: [id]
        }
        const resultados = await pool.query(sqlQuery)
        return resultados.rows[0]
    } catch (error) {
        return error
    }
}
// Funcion para eliminar un participante por id
async function eliminarParticipante(id) {
    try {
        const sqlQuery = {
            text: 'DELETE FROM skaters WHERE id = $1',
            values: [id]
        }
        const resultados = await pool.query(sqlQuery)
        return resultados.rowCount
    } catch (error) {
        return error
    }
}
//Funcion para actualizar un participante por id
async function actualizarParticipante(participante, id) {
    try {
        const sqlQuery = {
            text: 'UPDATE skaters SET nombre = $1, password =$2, anios_experiencia = $3, especialidad = $4 WHERE id = $5 RETURNING *',
            values: [participante.nombre, participante.password, participante.anios_experiencia, participante.especialidad, id]
        }
        const resultados = await pool.query(sqlQuery)
        return resultados.rows[0]
    } catch (error) {
        return error
    }
}
//Funcion para obtener todos los participantes
async function obtieneTodosParticipantes() {
    try {
        const sqlQuery = {
            text: 'SELECT id, nombre,anios_experiencia, especialidad, foto, estado FROM skaters'
        }
        const resultados = await pool.query(sqlQuery)
        return resultados.rows
    } catch (error) {
        return error
    }
}
//Funcion para actualizar el estado de un particpante por id
async function actualizaEstadoParticipante(participante) {
    try {
        const sqlQuery = {
            text: 'UPDATE skaters SET estado = $1  WHERE id = $2 RETURNING *',
            values: [participante.estado, participante.id]
        }
        const resultados = await pool.query(sqlQuery)
        return resultados.rowCount
    } catch (error) {
        return error
    }
}
//** Exportacion de modulos */
module.exports = { nuevoParticipante, accesoParticipante, obtieneParticipante, eliminarParticipante, actualizarParticipante, obtieneTodosParticipantes, actualizaEstadoParticipante }