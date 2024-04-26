const jwt = require ('jsonwebtoken');  
const checkToken = (req, res, next) => {

    if (!req.headers['authorization']){
        return res.json({error: 'Debes incluir la cabecera con el token '})
    }

    const token = req.headers['authorization']
    let payload; 
   try{
    const payload= jwt.verify(token, 'en lugar de la mancha')
   }catch (error){
    return res.json({error: 'El token no es corrcto'});
   }

    next(); 
} 

module.exports = { checkToken };
