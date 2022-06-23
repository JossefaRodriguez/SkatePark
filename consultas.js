const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '120313',
    database: 'skatepark_db',
    port: 5430
})

async function nuevoParticipante(participante, foto) {
    
    try {
        const sqlQuery = {
            text: 'INSERT INTO skaters ( email, nombre, password, anios_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [participante.email, participante.nombre, participante.password, participante.anios_experiencia, participante.especialidad, foto, 0]
        }
        const resultados = await pool.query(sqlQuery)
        
        return resultados.rows
    } catch(error) {
        return error
    }
}

module.exports = {nuevoParticipante}