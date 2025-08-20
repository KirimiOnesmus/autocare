const jwt =require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.verify=(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer"))
        return res.status(401).json({
    message: "Not Authorized"
});
const token = authHeader.split(" ")[1];

try {
    req.user = jwt.verify(token,JWT_SECRET);
    next();
} catch (error) {

    res.status(401).json({
        message:"Token invalid"
    });
}
}