const jwt=require('jsonwebtoken');
const secret=()=>process.env.JWT_SECRET||'eventiq-demo-secret';
function sign(user){return jwt.sign({id:user.id,email:user.email,name:user.name,role:user.role},secret(),{expiresIn:'7d'});}
function requireAuth(req,res,next){try{const h=req.headers.authorization||'';if(!h.startsWith('Bearer ')) return res.status(401).json({error:'Authentication required'});req.user=jwt.verify(h.slice(7),secret());next();}catch(e){return res.status(401).json({error:'Invalid or expired token'});}}
module.exports={sign,requireAuth};
