import { Toaster } from "sonner";

import Home from "./features/pages/user/home/Home"
import Login from "./features/pages/user/auth/Login"
import Signup from "./features/pages/user/auth/Signup"
import Navbar from "./features/components/Navbar"
// import Packages from "./features/pages/user/packages/pages/Packages"
import PackageDetails from "./features/pages/user/packages/pages/PackageDetail"
import UserRoutes from "./router/UserRoutes"
import AdminRoutes from "./router/AdminRoutes"
function App() {

  return (
    <>
    <UserRoutes/>
    <AdminRoutes/>
          <Toaster position="top-right" richColors /> 
        {/* <Packages/> */}
{/* <PackageDetails/> */}
    {/* <Home/> */}
    {/* <Navbar/>

<Login/>
<Signup/> */}
{/* <h1 className="text-4xl font-bold font-poppins text-primary">
  Welcome to Picnigo
</h1>

<p className="text-base font-light font-poppins">
  Your travel partner.
</p>

<button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">
  Book Now
</button>

<h1 className="text-4xl font-bold font-poppins bg-primary-light p-4 rounded text-white">
  Welcome to Picnigo (Light Background)
</h1> */}

    </>
  )
}

export default App
