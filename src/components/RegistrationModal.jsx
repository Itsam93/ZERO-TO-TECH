import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RegistrationModal = ({ isOpen, onClose, registerUrl = "/register" }) => {
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    e.preventDefault();

    onClose();

    navigate(registerUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Body */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white w-full max-w-md p-8 rounded-2xl border border-slate-100 shadow-2xl z-10 text-center"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Graphic/Icon */}
            <div className="mx-auto w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 border border-blue-100">
              <UserPlus size={24} />
            </div>

            {/* Text Layout */}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Account Required
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 px-2">
              To enroll in this specialized learning module and track your progress, please take a moment to set up an account.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleNavigation}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/10"
              >
                Create Account
              </button>
              
              <button 
                onClick={onClose}
                className="block w-full text-center text-slate-500 hover:text-slate-800 font-medium py-2.5 text-sm transition-colors"
              >
                Maybe Later
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};