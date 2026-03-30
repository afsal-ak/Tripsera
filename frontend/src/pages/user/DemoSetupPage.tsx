import { Users, Shield, PlaneTakeoff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DemoSetupPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-orange-50 min-h-screen">

      {/* HERO */}
      <section className="bg-orange text-white py-20 text-center rounded-b-[3rem] shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <PlaneTakeoff className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tripsera Demo Access
          </h1>
          <p className="text-lg text-orange-50/90">
            Explore both user and admin panels instantly using demo credentials
          </p>
        </div>
      </section>

      {/* LOGIN OPTIONS */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">

        {/* USER */}
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border">
          <div className="flex items-center gap-3 mb-5">
            <Users className="w-6 h-6 text-orange" />
            <h2 className="text-xl font-semibold text-gray-800">User Panel</h2>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl text-sm mb-6">
            <p><strong>Email:</strong> user@tripsera.com</p>
            <p><strong>Password:</strong> User@123</p>
          </div>

          <button
            onClick={() =>
              navigate("/login", {
                state: {
                  email: "user@tripsera.com",
                  password: "User@123",
                },
              })
            }
            className="w-full bg-orange text-white py-3 rounded-xl font-medium hover:bg-orange-dark transition"
          >
            Login as User
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Browse packages, bookings, and chat features
          </p>
        </div>

        {/* ADMIN */}
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-6 h-6 text-orange" />
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl text-sm mb-6">
            <p><strong>Email:</strong> admin@tripsera.com</p>
            <p><strong>Password:</strong> Admin@123</p>
          </div>

          <button
            onClick={() =>
              navigate("/admin/login", {
                state: {
                  email: "admin@tripsera.com",
                  password: "Admin@123",
                },
              })
            }
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition"
          >
            Login as Admin
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Manage users, bookings, and analytics
          </p>
        </div>
      </section>

      {/* EXTRA CTA */}
      <section className="text-center pb-16">
        <p className="text-gray-600 mb-4">
          Want to test full experience?
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="text-orange font-medium hover:underline"
        >
          Create a new account →
        </button>
      </section>

    </div>
  );
}