const jwt = require('jsonwebtoken');

// Minimal cookie parser (cookie-parser is not an allowed library for this lab)
function parseCookies(header = '') {
  return header.split(';').reduce((acc, part) => {
    const idx = part.indexOf('=');
    if (idx > -1) acc[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    return acc;
  }, {});
}

// Token may come from the "token" cookie or an "Authorization: Bearer <token>" header
function extractToken(req) {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.token) return cookies.token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

// Authentication: is the caller logged in?
function authenticate(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(403).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ message });
  }
}

// Authorization (RBAC): is the caller allowed to do this?
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, authorize, parseCookies, extractToken };
