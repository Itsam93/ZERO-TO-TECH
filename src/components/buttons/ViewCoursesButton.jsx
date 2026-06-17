import { Link } from "react-router-dom";

export const ViewCoursesButton = ({ className = "" }) => {
  return (
    <Link to="/courses">
      <button
        className={`border border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-3 rounded-full 
        hover:bg-[var(--color-primary)] hover:text-white transition ${className}`}
      >
        View Courses
      </button>
    </Link>
  );
};