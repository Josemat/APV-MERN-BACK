import mongoose from 'mongoose';

const PacientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    propietario:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas:{
        type: String,
        required: true
    },
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    }
},
{
    timestamps: true
}
);
const Pacientes = mongoose.model('Pacientes',PacientesSchema)
export default Pacientes