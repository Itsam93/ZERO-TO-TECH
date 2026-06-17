import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

import Logo from "@/assets/Logo1.png";

import { Toaster } from "react-hot-toast";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import About from "@/pages/About";
import CoursesPage from "@/pages/CoursesPage";
import Contact from "@/pages/Contact";
import Resources from "@/pages/Resources";
import PaymentSuccess from "@/components/PaymentSuccess";
import Checkout from "@/pages/Checkout";

import Login from "@/auth/pages/Login";
import Register from "@/auth/pages/Register";
import VerifyEmail from "@/auth/pages/VerifyEmail";
import CheckEmail from "@/auth/pages/CheckEmail"; 


import UserLayout from "@/layout/UserLayout";
import UserDashboard from "@/user/pages/UserDashboard";
import MyCourses from "@/user/pages/MyCourses";
import MyPurchases from "@/user/pages/MyPurchases";
import Profile from "@/user/pages/Profile";
import Settings from "@/user/components/Settings";

/* ADMIN SYSTEM */
import AdminLayout from "@/layout/AdminLayout";
import AdminLogin from "@/admin/pages/AdminLogin";
import Dashboard from "@/admin/pages/Dashboard";
import CoursesAdmin from "@/admin/pages/CoursesAdmin";
import MessagesAdmin from "@/admin/pages/MessagesAdmin";
import EnrollmentsAdmin from "@/admin/pages/EnrollmentsAdmin";
import PaymentsAdmin from "@/admin/pages/PaymentsAdmin";
import PurchasesAdmin from "@/admin/pages/PurchasesAdmin";
import CMSAdmin from "@/admin/pages/CMSAdmin";
import ResourcesAdmin from "@/admin/pages/ResourcesAdmin";
import UsersAdmin from "@/admin/pages/UsersAdmin";

/* AUTH SYSTEM */
import ProtectedRoute from "@/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "@/auth/AuthContext";

/* ADMIN WRAPPER */
const AdminRoute = ({ children }) => (
  <ProtectedRoute role="admin">
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

/* USER WRAPPER */
const UserRoute = ({ children }) => (
  <ProtectedRoute role="user">
    <UserLayout>{children}</UserLayout>
  </ProtectedRoute>
);

/* CHECKOUT GUARD */
const CheckoutGuard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return <Checkout />;
};

const PageTransitionLoader = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stableChildren, setStableChildren] = useState(children);

  useEffect(() => {
   
    const isAdminDashboard = location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";
    const isUserDashboard = location.pathname.startsWith("/user/");

    if (isAdminDashboard || isUserDashboard) {
      setStableChildren(children);
      return;
    }

   
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setStableChildren(children);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-gray-950 flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Branded Dark Canvas matching your layouts */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-secondary)]/10 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-5">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ 
                  scale: [0.96, 1.04, 0.96],
                  opacity: 1
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.3 }
                }}
                className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl shadow-[var(--color-primary)]/10"
              >
                <img
                  src={Logo}
                  alt="Zero-to-tech-africa logo"
                  className="w-14 h-14 object-contain"
                />
              </motion.div>
              
              {/* Sync Loader Dots */}
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isTransitioning ? "pointer-events-none opacity-0 select-none" : "transition-opacity duration-300"}>
        {stableChildren}
      </div>
    </>
  );
};

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserRoute = location.pathname.startsWith("/user");

  return (
    <div className="min-h-screen bg-white">

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#ECFDF5",
              color: "#065F46",
            },
          },
          error: {
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
            },
          },
        }}
      />

      {!isAdminRoute && !isUserRoute && <Navbar />}

      <PageTransitionLoader>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* PROTECTED CHECKOUT */}
          <Route path="/checkout" element={<CheckoutGuard />} />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* USER ROUTES */}
          <Route
            path="/user"
            element={
              <UserRoute>
                <UserLayout />
              </UserRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="purchases" element={<MyPurchases />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <AdminRoute>
                <CoursesAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/messages"
            element={
              <AdminRoute>
                <MessagesAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/enrollments"
            element={
              <AdminRoute>
                <EnrollmentsAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <PaymentsAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/purchases"
            element={
              <AdminRoute>
                <PurchasesAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/cms"
            element={
              <AdminRoute>
                <CMSAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/resources"
            element={
              <AdminRoute>
                <ResourcesAdmin />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersAdmin />
              </AdminRoute>
            }
          />

        </Routes>
      </PageTransitionLoader>

      {/* FOOTER */}
      {!isAdminRoute && !isUserRoute && <Footer />}

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;