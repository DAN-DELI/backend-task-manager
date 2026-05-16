import nodemailer from 'nodemailer';
import 'dotenv/config';

/**
 * @module mailer
 * @description Configura y exporta el transporter de Nodemailer conectado a Mailtrap.
 *
 * En entorno de desarrollo, Mailtrap actúa como una "trampa" de correos:
 * los emails se envían correctamente pero nunca llegan a usuarios reales,
 * sino que quedan capturados en el inbox de Mailtrap para ser revisados.
 *
 * Para producción, reemplaza host/port/user/pass por las credenciales
 * de tu proveedor real (SendGrid, Amazon SES, Resend, etc.).
 */

/**
 * Instancia del transporter de Nodemailer.
 * Lee las credenciales desde las variables de entorno definidas en el .env:
 *  - MAILTRAP_USER: usuario SMTP del inbox de Mailtrap
 *  - MAILTRAP_PASS: contraseña SMTP del inbox de Mailtrap
 *
 * @type {nodemailer.Transporter}
 */
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io', // Servidor SMTP de Mailtrap (solo desarrollo)
    port: 2525,                        // Puerto recomendado por Mailtrap para Nodemailer
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

/**
 * Verificación automática de la conexión al iniciar el servidor.
 * Imprime en consola si la conexión fue exitosa o si hubo un error,
 * ayudando a detectar credenciales incorrectas desde el arranque.
 */
transporter.verify((error) => {
    if (error) {
        console.error('Error al conectar con Mailtrap:', error.message);
    } else {
        console.log('Mailtrap conectado correctamente');
    }
});

export default transporter;