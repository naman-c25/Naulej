import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
   
  
  const jwToken = req.header("Authorization")?.replace("Bearer ", "");
  if (!jwToken) return res.status(401).json({ message: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(jwToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (roles !== req.user.role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

