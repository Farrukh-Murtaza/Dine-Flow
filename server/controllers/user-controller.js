const { ASSIGNABLE_ROLES, PASSWORD_RESET_ROLES, ROLES } = require("../constants/roles");
const User = require("../models/user-model");
const jwt  = require("jsonwebtoken");


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

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, password, role, isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (username) {
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "This email is already being used by another user.",
        });
      }

      user.email = email;
    }

    if (password) {
      user.password = password;
    }

    if (role) {
      user.role = role;
    }

    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
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

    const { newPassword, currentPassword } = req.body;


     const user = await User.findById(req.user._id);


    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }

    if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required.",
        });
      }



    const passwordMatches =
        await user.isCorrectPassword(currentPassword);


    if (!passwordMatches) {
        return res.status(400).json({
          message: "Current password is incorrect.",
        });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          message:
            "New password can't be the same as the current password.",
        });
      }
      
    user.password = newPassword;

    await user.save();

    // Password changed, so issue a fresh token
    const payload = {
      _id: user._id,
      role: user.role,
    };

    const newToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Password updated successfully.",
      token: newToken,
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
    updateUser,
    resetPassword,
}