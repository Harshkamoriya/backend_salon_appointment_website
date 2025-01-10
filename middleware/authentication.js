import blacklistedTokens from '../models/blacklistedTokens';
import jwt from 'jsonwebtoken';

module.exports  = (req ,res ,next)=>{
    console.log("inside authentication function");
    const token =req.header('Authorization').replace('Bearer ','');

    if(!token){
        console.log("token is not present");
        // console.error("the error inside authentication is", )
        return res.status(401).json({error: 'Access denied'});
    } 
    // if(token &&)
    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ error: 'Token has been invalidated' });
    }
    try{
        const verified = jwt.verify(token , process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (err){
        console.error("invalid token error", err.message)
        res.status(400).json({error : 'Invalid token'});
    }
};