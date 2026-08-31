const Profile = require('../models/Profile');
const User = require('../models/User');

// Get Logged-In User Profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    
    // Agar profile exist nahi karta toh create initialize kardega
    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        personal: {
          name: req.user.name || '',
          email: req.user.email || '',
          phone: req.user.phone || ''
        }
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

// Update Personal & Emergency Details
exports.updateProfile = async (req, res) => {
  try {
    const { personal, emergencyContact } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { personal, emergencyContact },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};

// Update Notification Preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { language, notification } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { 'preferences.language': language, 'preferences.notification': notification },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Preferences updated successfully', data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating preferences', error: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Assuming User model has a method matchPassword
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error changing password', error: error.message });
  }
};