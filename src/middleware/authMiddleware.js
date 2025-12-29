const jwt = require("jsonwebtoken"); 


async function isValidToken(req, res, next) {
    try {
        const token = req.headers['authorization']
        if(!token) {
            const error = new Error("Token is not present");
            error.statusCode = 401;
            throw error; 
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET); 
        req.userData = decoded; 
        next();
    } catch(error) {
        next(error);
    }
}


module.exports = isValidToken; 