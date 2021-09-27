const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  let token = req.header("token");
  if (!token) {
    res.status(401).json({ msg: "No token found , Access denied" });
  }

 try{
    const decoded = jwt.verify(token,config.get("jwtSecret"))
    req.user=decoded.user
    next()
 }catch(err){
    res.status(401).json({msg:"Token is not valid"})
 }
};
