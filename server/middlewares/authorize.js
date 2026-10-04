// middleware/authorize.js
const { ROLES } = require('../constants/roles');

/**
 * @param {...string} allowedRoles - roles allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user should be set by your auth middleware (JWT verification etc.)
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthenticated' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: 'Forbidden: insufficient permissions',
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

// Convenience presets
const ownerOrManager = authorize(ROLES.OWNER, ROLES.MANAGER);
const ownerOnly = authorize(ROLES.OWNER);

module.exports = {
  authorize,
  ownerOrManager,
  ownerOnly,
};