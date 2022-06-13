import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarID.js";


const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true //El trim nos va a permitir borrar cualquier espacio extra que haya agregado el usuario, tanto antes como despues
    },
    password:{
        type: String,
        required: true,
    },
    correo:{
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true
    },
    web:{
        type: String,
        default: null,
    },
    token:{
        type: String,
        default: generarId()
    },
    confirmado:{
        type: Boolean,
        default: false
    }
})

veterinarioSchema.pre('save',async function (next){
    if (!this.isModified('password')) { //Para no hashear un pass ya hasheado (fijarse que la function tenga el next)
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario){
    return await bcrypt.compare(passwordFormulario,this.password)

}

const Veterinario = mongoose.model("Veterinario",veterinarioSchema); //Esto lo registra como modelo //éste argumento le dice que datos va a tener
export default Veterinario;