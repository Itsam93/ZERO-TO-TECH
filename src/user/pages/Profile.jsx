import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getUserProfile } from "@/services/userApi";
import toast from "react-hot-toast";

const Profile = () => {
  const { token, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getUserProfile(token);

      setProfile(res.data?.data);

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to load profile";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your account information
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-xl shadow-sm p-6">

        {/* AVATAR */}
        <div className="flex items-center gap-4 mb-6">

          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-lg font-bold">
            {profile?.fullName?.charAt(0) || "U"}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {profile?.fullName || user?.fullName}
            </h2>

            <p className="text-sm text-gray-500">
              {profile?.email || user?.email}
            </p>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* FULL NAME */}
          <div>
            <label className="text-sm text-gray-500">
              Full Name
            </label>
            <p className="text-gray-800 font-medium">
              {profile?.fullName}
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">
              Email Address
            </label>
            <p className="text-gray-800 font-medium">
              {profile?.email}
            </p>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-500">
              Account Type
            </label>
            <p className="text-gray-800 font-medium capitalize">
              {profile?.role}
            </p>
          </div>

          {/* EMAIL VERIFIED */}
          <div>
            <label className="text-sm text-gray-500">
              Email Status
            </label>

            <p
              className={`font-medium ${
                profile?.isEmailVerified
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {profile?.isEmailVerified
                ? "Verified"
                : "Not Verified"}
            </p>
          </div>

          {/* LAST LOGIN */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">
              Last Login
            </label>

            <p className="text-gray-800 font-medium">
              {profile?.lastLoginAt
                ? new Date(profile.lastLoginAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* FUTURE ACTION AREA */}
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row gap-3">

          <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white">
            Edit Profile (coming soon)
          </button>

          <button className="px-4 py-2 rounded-lg border text-gray-700">
            Change Password
          </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;