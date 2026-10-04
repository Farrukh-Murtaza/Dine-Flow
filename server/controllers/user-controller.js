const { ASSIGNABLE_ROLES, PASSWORD_RESET_ROLES, ROLES } = require("../constants/roles");
const User = require("../models/user-model");



async function getAllUsers(req, res) {
  try {
    let users;

    if (req.user.role === ROLES.OWNER) {
      // Owner can see everyone
      users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });
    } else if (req.user.role === ROLES.MANAGER) {
      // Manager can only see cashiers and storekeepers
      users = await User.find({
        role: {
          $in: [ROLES.CASHIER, ROLES.STOREKEEPER],
        },
      })
        .select("-password")
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({
        message: "You are not authorized to view users.",
      });
    }

    return res.status(200).json({
      message: "Users retrieved successfully.",
      users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
}

async function createStaffUser(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    // Role assignment check
    const allowed = ASSIGNABLE_ROLES[req.user.role] || [];

    if (!allowed.includes(role)) {
      return res.status(403).json({
        message: `A ${req.user.role} cannot create a ${role}.`,
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "This user already exists.",
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    return res.status(201).json({
      message: `${role} account created successfully.`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { newPassword, userId } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }



    //   CASHIER AND STOREKEEPER
    //   They can ONLY reset their own password.
    //   Ignore/reject any userId they send.

    if (
      req.user.role === ROLES.CASHIER||
      req.user.role === ROLES.STOREKEEPER
    ) {
      if (userId && userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You can only reset your own password.",
        });
      }
    }

    // If no userId is provided, user is resetting their own password
    const targetUserId = userId || req.user._id;

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Get roles this logged-in user is allowed to reset
    const allowedRoles = PASSWORD_RESET_ROLES[req.user.role] || [];
    

    // Check whether target user's role can be reset
    if (!allowedRoles.includes(targetUser.role)) {
      return res.status(403).json({
        message: `A ${req.user.role} cannot reset the password of a ${targetUser.role}.`,
      });
    }

    // Check if new password is the same as the old password
    const samePassword = await targetUser.isCorrectPassword(newPassword);

    if (samePassword) {
      return res.status(400).json({
        message: "New password can't be the same as the current password.",
      });
    }

    targetUser.password = newPassword;

    await targetUser.save();

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
}

module.exports = {
    getAllUsers,
    createStaffUser,
    resetPassword
}