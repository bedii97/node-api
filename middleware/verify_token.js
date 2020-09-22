const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    //Token'ın elde edilebileceği yollar
    const token = 
    req.headers['x-access-token'] //Headers altından alınabilir || 
    req.body.token //Body altından alınabilir || 
    req.query.token; //Query olarak alınabilir; localhost:3000/api/movies?token=asdasfsfdsf

    if(token){
        jwt.verify(token, req.app.get('api_secret_key') /*Global değikenden secret key çekiyoruz*/, (err, decoded) =>{
            if(err){
                res.json({
                    status: false,
                    message: 'Failed to authenticate token.'
                })
            }else{
                req.decode = decoded;
                console.log(decoded);
                next();
            }
        });
    }else{
        res.json({
            status: false,
            message: 'No token provided.'
        });
    }
};