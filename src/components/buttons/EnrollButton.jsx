import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export const EnrollButton = ({
  course = null,
  resource = null,
  amount = null,
  className = "",
  onIntercept = null, 
  onClick = null, 
  ...props
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }

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
      type="button"
      onClick={handleClick}
      className={`
        bg-[var(--color-secondary)]
        text-white px-6 py-3 rounded-full
        hover:opacity-90 transition
        shadow-md hover:shadow-lg
        ${className}
      `}
      {...props}
    >
      Enroll Now
    </button>
  );
};