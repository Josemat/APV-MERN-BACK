import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos)=>{
    // Credenciales
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.PORT_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {nombre, correo, token} = datos

//Enviar El MAIL
      const info = await transporter.sendMail({
          from: "APV - Administrador de Pacientes de Veterinaria ",
          to: correo ,
          subject: "Recupera tu cuenta de APV",
          text:"Recupera tu cuenta de APV",
          html: `
          <p>Hola ${nombre}! has solicitado reestablecer tu password.</p>

          <p>Recupera el acceso haciendo click en el siguiente enlace
             para generar un nuevo password: <a href="${process.env.URL_FRONTEND}/olvide-password/${token}">Restablecer password </a></p>

          <p>Si tu no solicitaste el cambio, puedes ignorar el mensaje</p>
          `
      });
      console.log("Mensaje enviado : %s", info.messageId)
    

}

export default emailOlvidePassword;