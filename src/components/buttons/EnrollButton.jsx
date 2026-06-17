import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import toast from "react-hot-toast";

export const EnrollButton = ({
  course = null,
  resource = null,
  amount = null,
  className = "",
  onIntercept = null, 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (e) => {
    const payload = {
      course,
      resource,
      amount,
    };

    if (!user) {
      if (onIntercept) {
        onIntercept(e);
      } 
      return; 
    }

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