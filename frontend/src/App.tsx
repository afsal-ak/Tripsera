import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./router/admin/AdminRoutes";
import UserRoutes from "./router/user/UserRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
