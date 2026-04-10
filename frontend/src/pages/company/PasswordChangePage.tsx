import { Input } from '@/components/ui/Input';
import { Label } from '@/components/Label';
import { Button } from '@/components/Button';
import { passwordChange } from '@/services/company/companyAuthService';
import { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({ open, onClose }: Props) {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formErrors, setFormErrors] = useState<{
    current?: string;
    password?: string;
    confirm?: string;
  }>({});

  const [loadingPassword, setLoadingPassword] = useState(false);

  if (!open) return null; //  important

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: any = {};

    if (!currentPassword.trim()) {
      errors.current = "Current password is required";
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

    if (!passwordRegex.test(newPassword.trim())) {
      errors.password =
        "Min 6 chars, include letter, number & special character";
    }

    if (newPassword !== confirmPassword) {
      errors.confirm = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      setLoadingPassword(true);

      await passwordChange(currentPassword, newPassword);

      toast.success("Password changed successfully");

      // reset + close
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();

    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>
        </div>

        {/* FORM */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">

          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={formErrors.current ? "border-red-500" : ""}
            />
            {formErrors.current && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.current}
              </p>
            )}
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={formErrors.password ? "border-red-500" : ""}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </p>
            )}
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={formErrors.confirm ? "border-red-500" : ""}
            />
            {formErrors.confirm && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.confirm}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="w-full border"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loadingPassword}
              className="w-full bg-green-600 text-white"
            >
              {loadingPassword ? "Updating..." : "Update"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
// import { Input } from '@/components/ui/Input';
// import { Label } from '@/components/Label';
// import { Button } from '@/components/Button';
// import { passwordChange } from '@/services/company/companyAuthService';
// import { useState } from 'react';
// import { toast } from 'sonner';

// export default function PasswordChangePage() {

//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [formErrors, setFormErrors] = useState<{
//     current?: string;
//     password?: string;
//     confirm?: string;
//   }>({});

//   const [loadingPassword, setLoadingPassword] = useState(false);

//   const handlePasswordSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const errors: any = {};

//     if (!currentPassword.trim()) {
//       errors.current = "Current password is required";
//     }

//     const passwordRegex =
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

//     if (!passwordRegex.test(newPassword.trim())) {
//       errors.password =
//         "Min 6 chars, include letter, number & special character";
//     }

//     if (newPassword !== confirmPassword) {
//       errors.confirm = "Passwords do not match";
//     }

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setFormErrors({});

//     try {
//       setLoadingPassword(true);

//       await passwordChange(currentPassword, newPassword);

//       toast.success("Password changed successfully");

//       // reset fields
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");

//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Failed to change password"
//       );
//     } finally {
//       setLoadingPassword(false);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4">

//       <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border">

//         {/* HEADER */}
//         <div className="mb-6 text-center">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Change Password
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Update your account password securely
//           </p>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handlePasswordSubmit} className="space-y-5">

//           {/* CURRENT PASSWORD */}
//           <div>
//             <Label>Current Password</Label>
//             <Input
//               type="password"
//               placeholder="Enter current password"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               className={`mt-1 ${
//                 formErrors.current ? "border-red-500" : ""
//               }`}
//             />
//             {formErrors.current && (
//               <p className="text-red-500 text-xs mt-1">
//                 {formErrors.current}
//               </p>
//             )}
//           </div>

//           {/* NEW PASSWORD */}
//           <div>
//             <Label>New Password</Label>
//             <Input
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className={`mt-1 ${
//                 formErrors.password ? "border-red-500" : ""
//               }`}
//             />
//             {formErrors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {formErrors.password}
//               </p>
//             )}
//           </div>

//           {/* CONFIRM PASSWORD */}
//           <div>
//             <Label>Confirm Password</Label>
//             <Input
//               type="password"
//               placeholder="Confirm new password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className={`mt-1 ${
//                 formErrors.confirm ? "border-red-500" : ""
//               }`}
//             />
//             {formErrors.confirm && (
//               <p className="text-red-500 text-xs mt-1">
//                 {formErrors.confirm}
//               </p>
//             )}
//           </div>

//           {/* BUTTON */}
//           <Button
//             type="submit"
//             disabled={loadingPassword}
//             className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
//           >
//             {loadingPassword ? "Updating..." : "Change Password"}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }