const APIError = require("../utils/errors/APIError");

function roleMW(role){
    return (req,res,next)=>{
        if(req.user.role == role){
            next();
        }else{
            next(new APIError(`Your Not Authorized`, 403));
        }
    }
}

module.exports = roleMW;