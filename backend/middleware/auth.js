import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    // Use 401 Unauthorized status code
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
     console.log("Decoded token:", token_decode);
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    // Use 401 Unauthorized status code for invalid token
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
