import generarJWT from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";
import generarId from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

/*
const registrar = (req,res)=>{
    res.send('Desde API/VETERINARIOS') //Reemplazando el res.send y transformando la respuesta en un objeto
*/
const registrar = async (req,res)=>{
    /*/ console.log(req.body) //Imprime lo que le mandemos a traves del verbo POST
    // Podemos hacer destructuring
    const {nombre, correo, password} = req.body
    console.log(nombre)
    console.log(correo)
    console.log(password)
    */
// Prevenir usuarios duplicados
const {correo, nombre} = req.body
const existeUsuario = await Veterinario.findOne({ correo })
if(existeUsuario){
    const error = new Error('Correo ya registrado!')
    return res.status(400).json({msg: error.message})
}



   try {
       const veterinario = new Veterinario(req.body)
       const veterinarioGuardado = await veterinario.save()

       //Enviar el mail
       emailRegistro({
           correo,
           nombre,
           token: veterinarioGuardado.token
       })
       res.json({ msg: 'Vete nuevo registrado!' })
   } catch (error) {
       console.log(error);
   }

    
}

const perfil = (req,res)=>{
    const {veterinario} = req
    res.json(veterinario) 
}

const confirmar = async (req, res)=>{
    // console.log(req.params.token) //Tiene que estar nombrado igual que el routing dinamico
    const {token} = req.params
    const existeUsuario = await Veterinario.findOne({token})
    if(!existeUsuario){

        const error = new Error('Token no válido')
        return res.status(400).json({msg: error.message})
    }
    try {
        existeUsuario.confirmado = true;
        existeUsuario.token = null;
        await existeUsuario.save()
        res.json({ msg : "Usuario autenticado correctamente!"})
    } catch (error) {
        console.log(error)
    }
    
}
const autenticar = async (req, res)=>{
    const {correo, confirmado, password} = req.body
    //Comprobar si el usuario existe
    const existeUsuario = await Veterinario.findOne({correo})
    if(!existeUsuario){
        const error = new Error('El usuario no existe!')
        return res.status(403).json({msg: error.message})
    }
    //Comrpobar si el usuario esta autenticado
    if(!existeUsuario.confirmado){
        const error = new Error('El usuario no esta autenticado')
        return res.status(403).json({msg: error.message})
    }
    //Revisar el password
    if(await existeUsuario.comprobarPassword(password)){
        // res.json({msg:'Usuario logueado correctamente!'}) 
        //Autenticar con JWT
        
        res.json({
            _id: existeUsuario._id,
            nombre: existeUsuario.nombre,
            correo: existeUsuario.correo,
            web: existeUsuario.web,
            telefono: existeUsuario.telefono,
            token: generarJWT(existeUsuario.id)});
    }else{
        const error = new Error('El password es incorrecto')
        return res.status(403).json({msg: error.message})
    }

    
}
const olvidePassword = async (req, res, next)=>{
    const {correo} = req.body
    const existeVeterinario = await Veterinario.findOne({correo})
    if(!existeVeterinario){
        const error = new Error('El usuario no existe')
        res.status(403).json({msg : error.message})
    }
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        emailOlvidePassword({
            correo,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg: 'Hemos enviado un mail con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
    res.status(200).json()

    next()

}
const comprobarToken = async (req, res)=>{
    const {token} = req.params
    const tokenValido = await Veterinario.findOne({token})
    if(tokenValido){
        //El token existe
        res.json({msg:'token valido'})
    }else{
        // El token no es valido
        const error =new Error('El token no es válido')
        return res.status(403).json({msg: error.message})
    }

}
const nuevoPassword = async (req, res)=>{
    const {token} = req.params
    const {password} = req.body
    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error')
        res.status(403).json({msg : error.message})
    }
    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({msg : 'Password modificado correctamente'})
    } catch (error) {
        console.log(error)
    }

}
const actualizarPerfil = async (req,res)=>{
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }
    const { correo } = req.body;
    if(veterinario.correo !== req.body.correo ){
        const existeMail = await Veterinario.findOne({correo})
        if(existeMail){
            const error = new Error("Ese correo ya existe!")
            return res.status(400).json({msg: error.message})
        }
    }
    try {
        veterinario.nombre = req.body.nombre 
        veterinario.correo = req.body.correo
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono
        const veterinarioActualizado = await veterinario.save();
        res.json({
            _id: veterinarioActualizado.id,
            nombre:veterinarioActualizado.nombre,
            correo: veterinarioActualizado.correo,
            web: veterinarioActualizado.web,
            telefono: veterinarioActualizado.telefono
        });
    } catch (error) {
        console.log(error)
        
    }

}

const actualizarPassword = async (req,res)=>{
    // Leer los datos
    const {id} = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body
    // Verificar que el vete existe
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error("El password actual es incorrecto!")
        return res.status(400).json({msg: error.message})
    }
    // comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo
        await veterinario.save()
        return res.json({msg: 'Password actualizado correctamente'})
    }else{
        const error = new Error("El password actual es incorrecto!")
        return res.status(400).json({msg: error.message})
    }
    // Almacenar el nuevo password
}



export { 
    registrar,
    perfil, 
    confirmar, 
    autenticar, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};