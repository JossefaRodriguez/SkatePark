# SkatePark

## Indicaciones

- El sistema debe permitir registrar nuevos participantes.
- Se debe crear una vista para que los participantes puedan iniciar sesión con su correo y contraseña.
- Luego de iniciar la sesión, los participantes deberán poder modificar sus datos, exceptuando el correo electrónico y su foto.
- Esta vista debe estar protegida con JWT y los datos que se utilicen en la plantilla deben ser extraídos del token.
- La vista correspondiente a la ruta raíz debe mostrar todos los participantes registrados y su estado de revisión.
- La vista del administrador debe mostrar los participantes registrados y permitir aprobarlos para cambiar su estado.

## Requerimientos

1. Crear una API REST con el Framework Express (3 Puntos)
2. Servir contenido dinámico con express-handlebars (3 Puntos)
3. Ofrecer la funcionalidad Upload File con express-fileupload (2 Puntos)
4. Implementar seguridad y restricción de recursos o contenido con JWT (2 Puntos)
