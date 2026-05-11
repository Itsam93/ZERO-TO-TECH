import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";

/* ================= TOAST ================= */
import { Toaster } from "react-hot-toast";

/* ================= PUBLIC LAYOUT ================= */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= PUBLIC PAGES ================= */
import Home from "@/pages/Home";
import About from "@/pages/About";
import CoursesPage from "@/pages/CoursesPage";
import Contact from "@/pages/Contact";
import Resources from "@/pages/Resources";
import PaymentSuccess from "@/components/PaymentSuccess";
import Checkout from "@/pages/Checkout";

/* ================= AUTH PAGES ================= */
import Login from "@/auth/pages/Login";
import Register from "@/auth/pages/Register";
import VerifyEmail from "@/auth/pages/VerifyEmail";

/* ================= USER SYSTEM ================= */
import UserLayout from "@/layout/UserLayout";
import UserDashboard from "@/user/pages/UserDashboard";
import MyCourses from "@/user/pages/MyCourses";
import MyPurchases from "@/user/pages/MyPurchases"; 
import Profile from "@/user/pages/Profile";
import Settings from "@/user/components/Settings";

/* ================= ADMIN SYSTEM ================= */
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

/* ================= GUARDS ================= */
import ProtectedRoute from "@/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "@/auth/AuthContext";

/* ================= ADMIN WRAPPER ================= */
const AdminRoute = ({ children }) => (
  <ProtectedRoute role="admin">
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

/* ================= USER WRAPPER ================= */
const UserRoute = ({ children }) => (
  <ProtectedRoute role="user">
    <UserLayout>{children}</UserLayout>
  </ProtectedRoute>
);

/* ================= CHECKOUT GUARD ================= */
const CheckoutGuard = () => {
  const { user } = useAuth();

  // ❌ NOT LOGGED IN → FORCE REGISTER
  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return <Checkout />;
};

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserRoute = location.pathname.startsWith("/user");

  return (
    <div className="min-h-screen bg-white">

      {/* ================= TOAST SYSTEM ================= */}
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

      {/* ================= NAVBAR (PUBLIC ONLY) ================= */}
      {!isAdminRoute && !isUserRoute && <Navbar />}

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* ================= PROTECTED CHECKOUT ================= */}
        <Route path="/checkout" element={<CheckoutGuard />} />

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* ================= USER ROUTES ================= */}
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

          {/* ================= NEW ROUTE ================= */}
          <Route path="purchases" element={<MyPurchases />} />

          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
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

      </Routes>

      {/* ================= FOOTER (PUBLIC ONLY) ================= */}
      {!isAdminRoute && !isUserRoute && <Footer />}

    </div>
  );
}

/* ================= APP WRAPPER ================= */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;