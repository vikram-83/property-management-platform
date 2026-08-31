const permissions = require('../config/permissions');

// Generic Role Check (Single or Multiple Roles)
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();
    if (!userRole || !allowedRoles.map((role) => role.toLowerCase()).includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to perform this action.'
      });
    }
    next();
  };
};

// Granular Resource & Action Permission Check
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();

    // 1. Admin Override (Admin can perform all actions everywhere)
    if (userRole === 'admin') {
      return next();
    }

    // 2. Role Specific Granular Check
    const rolePermissions = permissions[userRole];

    const resourcePermissions = rolePermissions?.[resource];
    const allowed = Array.isArray(resourcePermissions)
      ? resourcePermissions.includes(action)
      : resourcePermissions?.[action] === true;

    if (allowed) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access Denied: Missing permission for ${resource}:${action}`
    });
  };
};

module.exports = { checkRole, checkPermission, authorize: checkRole };