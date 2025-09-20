const jwt = require("jsonwebtoken");

// [Section] Environment Setup
const dotenv = require("dotenv");
dotenv.config();

// [SECTION] Token Creation
module.exports.createAccessToken = (user) =>{
		const data = {
			userId: user._id,
			email: user.email,
			isAdmin: user.isAdmin
		}

		return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
	}


	module.exports.verify = (req, res, next) => {

		let token = req.headers.authorization;
	
		if (typeof token === "undefined") {
			return res.status(401).json({ 
				success: false,
				message: "Access token required" 
			});
		} else {
			// Handle both "Bearer token" and just "token" formats
			if (token.startsWith('Bearer ')) {
				token = token.slice(7, token.length);
			}
	
			jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {
				if (err) {
					return res.status(403).json({ 
						success: false,
						message: "Invalid or expired token" 
					});
				} else {
					req.user = decodedToken;  
					next();  
				}
			});
		}
	};
	


module.exports.verifyAdmin = (req, res, next) => {
	console.log(req.user);

	if(req.user.isAdmin){
		next();
	}else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}


}


//[SECTION] Error Handler

module.exports.errorHandler = (err, req, res, next) =>{

	//log the error
	console.error(err);


	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';


	res.status(statusCode).json({
		error:{
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	});
}