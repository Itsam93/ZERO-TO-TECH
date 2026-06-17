import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/auth/AuthContext";
import { User, Mail, Lock, Save } from "lucide-react";
import { getUserProfile, updateUserProfile, changePassword } from "@/services/userApi";

const Settings = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        const data = res.data.data;

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
        });

      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profile.fullName.trim() || !profile.email.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await updateUserProfile(profile);

      if (res.data.success) {
        toast.success("Profile updated successfully");
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const res = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (res.data.success) {
        toast.success("Password updated successfully");

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Password update failed"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your account settings and security
        </p>
      </div>

      {/* ================= PROFILE SECTION ================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <h2 className="text-lg font-semibold mb-4">
          Profile Information
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-4">

          {/* FULL NAME */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleProfileChange}
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <h2 className="text-lg font-semibold mb-4">
          Change Password
        </h2>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">

          {/* CURRENT PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* NEW PASSWORD */}
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default Settings;