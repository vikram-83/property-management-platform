import React, { useState, useEffect } from 'react';
import TenantNavigation from '../../common/TenantNavigation';
import { getProfile, updateProfile, updateProfilePreferences, changePassword } from '../../../services/profileService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      if (res.success) {
        setProfile(res.data);
        setFormData(res.data);
      }
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        personal: formData.personal,
        emergencyContact: formData.emergencyContact
      });
      if (res.success) {
        setMessage('Profile updated successfully!');
        setProfile(res.data);
        setIsEditing(false);
      } else {
        setError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error saving profile');
      console.error(err);
    }
  };

  const handlePreferenceToggle = async (key) => {
    const updatedNotif = {
      ...profile.preferences.notification,
      [key]: !profile.preferences.notification[key]
    };

    try {
      const res = await updateProfilePreferences({
        language: profile.preferences.language,
        notification: updatedNotif
      });
      if (res.success) {
        setProfile(res.data);
      } else {
        setError(res.message || 'Failed to update preferences');
      }
    } catch (err) {
      setError('Error updating preferences');
      console.error(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword(passwords);
      if (res.success) {
        setMessage(res.message);
        setShowPasswordModal(false);
        setPasswords({ currentPassword: '', newPassword: '' });
      } else {
        setError(res.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Error changing password');
      console.error(err);
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <>
      <TenantNavigation />
      <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>👤 Tenant Profile</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <img
          src={profile.personal.profileImage}
          alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h3>{profile.personal.name}</h3>
          <p>{profile.personal.email}</p>
          <p>{profile.personal.phone}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
        <button onClick={() => setShowPasswordModal(true)}>Change Password</button>
      </div>

      {isEditing ? (
        <form onSubmit={handleProfileSave} style={{ marginBottom: '30px' }}>
          <h4>Personal Information</h4>
          <input
            type="text"
            value={formData.personal.name}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, name: e.target.value } })}
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={formData.personal.phone}
            onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })}
            placeholder="Phone"
            required
          />

          <h4>Emergency Contact</h4>
          <input
            type="text"
            value={formData.emergencyContact.name}
            onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
            placeholder="Contact Name"
          />
          <input
            type="text"
            value={formData.emergencyContact.relationship}
            onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
            placeholder="Relationship"
          />
          <input
            type="text"
            value={formData.emergencyContact.phone}
            onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
            placeholder="Phone"
          />
          <br /><br />
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div style={{ marginBottom: '30px' }}>
          <h4>Emergency Contact</h4>
          <p><strong>Name:</strong> {profile.emergencyContact.name || 'N/A'}</p>
          <p><strong>Relationship:</strong> {profile.emergencyContact.relationship || 'N/A'}</p>
          <p><strong>Phone:</strong> {profile.emergencyContact.phone || 'N/A'}</p>
        </div>
      )}

      <div>
        <h4>Notification Preferences</h4>
        {Object.keys(profile.preferences.notification).map((key) => (
          <label key={key} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={profile.preferences.notification[key]}
              onChange={() => handlePreferenceToggle(key)}
            />
            {' '}{key.charAt(0).toUpperCase() + key.slice(1)} Notifications
          </label>
        ))}
      </div>

      {showPasswordModal && (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
          <h4>Change Password</h4>
          <form onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
            />
            <button type="submit">Update Password</button>
            <button type="button" onClick={() => setShowPasswordModal(false)} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </form>
        </div>
      )}
      </div>
    
    </>
  );
};

export default Profile;