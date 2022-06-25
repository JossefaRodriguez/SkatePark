# Skate Park

## Instalación
```bash
npm install
```
## Crear Base de Datos PostgreSQL
```sql
CREATE DATABASE skatepark_db;

CREATE TABLE skaters (id SERIAL, email VARCHAR(50) NOT NULL, nombre VARCHAR(25) NOT NULL, password VARCHAR(25) NOT NULL, anos_experiencia SMALLINT NOT NULL, especialidad VARCHAR(50) NOT NULL, foto VARCHAR(255) NOT
NULL, estado BOOLEAN NOT NULL);
```

## Ejecutar
```bash
node index.js
```
## Iniciado
```bash
Servidor Encendido en puerto 8080 http://localhost:8080
```

## Indicaciones

- El sistema debe permitir registrar nuevos participantes.
- Se debe crear una vista para que los participantes puedan iniciar sesión con su correo y contraseña.
- Luego de iniciar la sesión, los participantes deberán poder modificar sus datos, exceptuando el correo electrónico y su foto. Esta vista debe estar protegida con JWT y los datos que se utilicen en la plantilla deben ser extraídos del token.
- La vista correspondiente a la ruta raíz debe mostrar todos los participantes registrados y su estado de revisión.
- La vista del administrador debe mostrar los participantes registrados y permitir aprobarlos para cambiar su estado.

## Requreimientos

1. Crear una API REST con el Framework Express (3 Puntos)
2. Servir contenido dinámico con express-handlebars (3 Puntos)
3. Ofrecer la funcionalidad Upload File con express-fileupload (2 Puntos)
4. Implementar seguridad y restricción de recursos o contenido con JWT (2 Puntos)