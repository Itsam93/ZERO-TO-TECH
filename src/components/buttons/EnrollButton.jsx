import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import toast from "react-hot-toast";

export const EnrollButton = ({
  course = null,
  resource = null,
  amount = null,
  className = "",
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    const payload = {
      course,
      resource,
      amount,
    };

    /* ================= NOT LOGGED IN ================= */
    if (!user) {
      toast.error("Kindly register to proceed");
      return; // 🚫 HARD BLOCK (no navigation)
    }

    /* ================= LOGGED IN ================= */
    navigate("/checkout", {
      state: payload,
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        bg-[var(--color-secondary)]
        text-white px-6 py-3 rounded-full
        hover:opacity-90 transition
        shadow-md hover:shadow-lg
        ${className}
      `}
    >
      Enroll Now
    </button>
  );
};