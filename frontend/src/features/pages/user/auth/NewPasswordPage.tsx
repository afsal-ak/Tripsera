import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handelChangePassword } from '@/features/services/auth/authService'
import { toast } from 'sonner'

const NewPasswordPage = () => {
    const navigate=useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState<{ password?: string; confirm?: string }>({});

    const [token,setToken]=useState<string>('')
   
      useEffect(()=>{
        const storedToken=localStorage.getItem("forgotToken")
        
         if (storedToken) {
        setToken(storedToken)
         }else{
          navigate('/login')
         }
      },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
     const trimmedPassword = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

     const errors: { password?: string; confirm?: string } = {};

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    if (!passwordRegex.test(trimmedPassword)) {
      errors.password =
        "Password must be at least 6 characters, include one letter, one number, and one special character.";
    }
    // if(trimmedPassword.length!=7){
    //  // errors.password='password must be atleast 7 cahracter'
    //  toast.error('7 length')
    // }

    if (trimmedPassword !== trimmedConfirm) {
      errors.confirm = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
      setFormErrors({});
    try {
        const response=await handelChangePassword(token,newPassword)
       toast.success('password changed successfully')
       localStorage.removeItem('forgotToken')
       navigate('/login')

    } catch (error:any) {
      toast.error( error.response.data||"Failed to reset password");
    }

   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-darkText text-center">Reset Password</h2>
        <p className="text-sm text-muted-foreground text-center">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm text-darkText mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md bg-bg focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
             {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-darkText mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md bg-bg focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
             {formErrors.confirm && (
              <p className="text-red-500 text-xs mt-1">{formErrors.confirm}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange text-white font-medium py-2 rounded-md hover:bg-orange-dark transition"
          >
            Set New Password
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Remembered your password?{" "}
          <a href="/login" className="text-orange hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}

export default NewPasswordPage
