import { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/auth/AuthContext";
import PUBLIC_API from "@/services/publicApi";

const ResourceViewer = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState(null);

  const startTimeRef = useRef(null);

  const fetchResource = async () => {
    try {
      const res = await PUBLIC_API.get(`/resources/view/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setResource(res.data.data);
    } catch (err) {
      console.error("RESOURCE VIEW ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          "Access denied or resource unavailable"
      );

      setResource(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.token || !id) return;

    startTimeRef.current = Date.now();

    fetchResource();
  }, [id, user]);

  useEffect(() => {
    return () => {
      if (!user?.token || !resource) return;

      const duration = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      PUBLIC_API.post(
        "/resources/analytics/view",
        {
          resourceId: id,
          duration,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      ).catch(() => {});
    };
  }, [resource, id, user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle size={60} className="text-red-500 mb-4" />

        <h1 className="text-2xl font-semibold mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 max-w-md">
          You do not have permission to access this resource.
          Please ensure you have completed payment.
        </p>
      </div>
    );
  }

  const markCompleted = async () => {
    try {
      await PUBLIC_API.post(
        "/resources/analytics/complete",
        { resourceId: id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Marked as completed");
    } catch (err) {
      console.error("COMPLETION ERROR:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold mb-2">
          {resource.title}
        </h1>

        <p className="text-gray-600">
          {resource.description}
        </p>

        {/* OPTIONAL ACTION */}
        <button
          onClick={markCompleted}
          className="mt-4 text-sm bg-green-600 text-white px-4 py-2 rounded"
        >
          Mark as Completed
        </button>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* PDF */}
        {resource.type === "PDF" && (
          <iframe
            src={resource.fileUrl}
            title={resource.title}
            className="w-full h-[85vh]"
          />
        )}

        {/* VIDEO */}
        {resource.type === "Video" && (
          <video
            src={resource.fileUrl}
            controls
            controlsList="nodownload"
            className="w-full"
          />
        )}

        {/* FALLBACK */}
        {!["PDF", "Video"].includes(resource.type) && (
          <div className="p-6 text-center text-gray-500">
            Unsupported resource type
          </div>
        )}

      </div>
    </main>
  );
};

export default ResourceViewer;