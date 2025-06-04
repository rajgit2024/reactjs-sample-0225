const jwt= require("jsonwebtoken")

const jwtAuthMiddleware = (req, res, next) => {
    const authorization=req.headers.authorization;
    if(!authorization){
        console.log("Authorization header missing!");
        return res.status(401).json({message:"Token not found!"});
    }
    const token=authorization.split(" ")[1];
      if (!token) {
        console.log("Token missing in Authorization header");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_KEY);
       console.log("Decoded JWT Payload:", decoded);
        req.user=decoded;
        next();
    } catch (error) {
         if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
    }
};

const generateToken=(userData)=>{
    return jwt.sign(userData,process.env.JWT_KEY,{expiresIn:"1h"});
}

module.exports={
    jwtAuthMiddleware,generateToken
}