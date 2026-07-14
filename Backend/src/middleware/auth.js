import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretlawaijwtkey123!@#');
    req.user = decoded; // Attach user payload (usually id and email) to request object
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
