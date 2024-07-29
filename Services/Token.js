const jwt = require('jsonwebtoken');

function SetUser(user){
    // creating a jtw token
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY);

    return token;
}

const authenticateToken = (req, res, next) => {
    const token = req.body.Header.token;
  
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
    //   console.log(user);
      next();
    });
};
  


// function GetUser(token){
//     const Vtoken = jwt.sign({user}, process.env.JWT_SECRET_KEY);
//     return Vtoken;
// }

module.exports = {SetUser,authenticateToken};  //exporting the function

