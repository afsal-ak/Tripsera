import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
interface ProtectedRouteProps {

   children: ReactNode;
}

const UserProtectedRoutes=({children}:ProtectedRouteProps)=>{
    const {isAuthenticated,user}=useSelector((state:RootState)=>state.userAuth)
     console.log(isAuthenticated,user,'isAuth')
     if(!isAuthenticated ||user?.isBlocked){
        
        <Navigate to='/login' replace/>
     }
     return<>{children}</>
  //  return isAuthenticated?children:<Navigate to='/login' replace/>
}

export default  UserProtectedRoutes