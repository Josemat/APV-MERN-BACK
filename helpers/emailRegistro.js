import nodemailer from 'nodemailer'

const emailRegistro = async (datos)=>{
    // Credenciales
    /*
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.PORT_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS 
        }
      });
      */
      const client = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

      const {nombre, correo, token} = datos

//Enviar El MAIL
      const info = await client.sendMail({
          from: "APV - Administrador de Pacientes de Veterinaria ",
          to: correo ,
          subject: "Confirma tu cuenta en APV",
          text:"Confirma tu cuenta en APV",
          html: `
          <p>Hola ${nombre}!, finaliza el registro de tu cuenta en APV </p>
          <p>Para terminar con el registro haz click en el siguiente enlace: <a href="${process.env.URL_FRONTEND}/confirmar/${token}">Comprobar cuenta </a></p>

          <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
          `
      });
      console.log("Mensaje enviado : %s", info.messageId)
    

}

export default emailRegistro;