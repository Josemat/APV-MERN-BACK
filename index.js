import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import routerVeterinario from "./routes/veterinarioRoutes.js";
import routerPacientes from "./routes/pacienteRoutes.js";


const app = express();
app.use(express.json())
dotenv.config()

connectDB();

const dominiosPermitidos = [process.env.URL_FRONTEND]

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){//Si el origen es DIFERENTE a dominiospermit
        //Si el origen del request es permitido ->
        callback(null, true) //callback(mensajeDeError, permitirAcceso)
    }else{
        callback(new Error('No permitido por CORS policy '))
    }
}
}
app.use(cors(corsOptions))

app.use('/api/veterinarios',routerVeterinario)
app.use('/api/pacientes',routerPacientes)
const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{ //Usamos el puerto 4000 ya que el 3000 se suele usar en el front
    console.log(`Servidor funcionando en el puerto ${PORT}`); 
})