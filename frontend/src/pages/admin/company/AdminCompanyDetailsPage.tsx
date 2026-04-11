import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCompanyById,
  approveCompany,
  blockCompany,
  unblockCompany,
} from "@/services/admin/companyService";

const AdminCompanyDetailsPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState<any>(null);

  const fetchCompany = async () => {
    const res = await getCompanyById(companyId!);
    setCompany(res.company);
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleApprove = async () => {
    await approveCompany(companyId!);
    fetchCompany();
  };

  const handleBlock = async () => {
    await blockCompany(companyId!);
    fetchCompany();
  };

  const handleUnblock = async () => {
    await unblockCompany(companyId!);
    fetchCompany();
  };

  if (!company) return <div className="p-6 text-gray-700">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-900">
      
      {/* Header */}
      <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-xl shadow-sm border">
        <img
          src={company.logo?.url}
          alt="logo"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-blue-600">{company.email}</p>

          <div className="mt-2 font-medium">
            {company.isBlocked ? (
              <span className="text-red-600">Blocked</span>
            ) : company.isApproved ? (
              <span className="text-green-600">Approved</span>
            ) : (
              <span className="text-yellow-600">Pending</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        {!company.isApproved && (
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Approve
          </button>
        )}

        {!company.isBlocked ? (
          <button
            onClick={handleBlock}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Block
          </button>
        ) : (
          <button
            onClick={handleUnblock}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Unblock
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Company Info */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">Company Info</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Phone:</span> {company.phone}</p>
            <p><span className="font-medium">Description:</span> {company.description || "-"}</p>
            <p><span className="font-medium">GST:</span> {company.gstNumber || "-"}</p>
            <p><span className="font-medium">License:</span> {company.licenseNumber || "-"}</p>
          </div>
        </div>

        {/* Owner */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">Owner</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {company.ownerId?.username}</p>
            <p><span className="font-medium">Email:</span> {company.ownerId?.email}</p>
            <p><span className="font-medium">Phone:</span> {company.ownerId?.phone || "-"}</p>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">Address</h2>
          <div className="text-sm space-y-1">
            <p>{company.address?.street}</p>
            <p>{company.address?.city}</p>
            <p>{company.address?.state}</p>
            <p>{company.address?.country}</p>
            <p>{company.address?.postalCode}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">Documents</h2>

          <div className="flex flex-col gap-2 text-sm">
            {company.documents?.gstCertificate?.url ? (
              <a
                href={company.documents.gstCertificate.url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View GST Certificate
              </a>
            ) : (
              <span className="text-gray-400">No GST Certificate</span>
            )}

            {company.documents?.businessLicense?.url ? (
              <a
                href={company.documents.businessLicense.url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View License
              </a>
            ) : (
              <span className="text-gray-400">No License</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCompanyDetailsPage;


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getCompanyById,
//   approveCompany,
//   blockCompany,
//   unblockCompany,
// } from "@/services/admin/companyService";

// const AdminCompanyDetailsPage = () => {
//   const { companyId } = useParams();
//   const [company, setCompany] = useState<any>(null);

//   const fetchCompany = async () => {
//     const res = await getCompanyById(companyId!);
//     setCompany(res.company);
//   };

//   useEffect(() => {
//     fetchCompany();
//   }, []);

//   const handleApprove = async () => {
//     await approveCompany(companyId!);
//     fetchCompany();
//   };

//   const handleBlock = async () => {
//     await blockCompany(companyId!);
//     fetchCompany();
//   };

//   const handleUnblock = async () => {
//     await unblockCompany(companyId!);
//     fetchCompany();
//   };

//   if (!company) return <div className="text-white p-6">Loading...</div>;

//   return (
//     <div className="p-6 bg-white min-h-screen text-white">
//       {/* Header */}
//       <div className="flex items-center gap-6 mb-6">
//         <img
//           src={company.logo?.url}
//           alt="logo"
//           className="w-24 h-24 rounded-full object-cover border"
//         />

//         <div>
//           <h1 className="text-3xl font-bold">{company.name}</h1>
//           <p className="text-blue-600">{company.email}</p>

//           <div className="mt-2">
//             {company.isBlocked ? (
//               <span className="text-red-400">Blocked</span>
//             ) : company.isApproved ? (
//               <span className="text-green-400">Approved</span>
//             ) : (
//               <span className="text-yellow-400">Pending</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-3 mb-6">
//         {!company.isApproved && (
//           <button
//             onClick={handleApprove}
//             className="px-4 py-2 bg-green-600 rounded"
//           >
//             Approve
//           </button>
//         )}

//         {!company.isBlocked ? (
//           <button
//             onClick={handleBlock}
//             className="px-4 py-2 bg-red-600 rounded"
//           >
//             Block
//           </button>
//         ) : (
//           <button
//             onClick={handleUnblock}
//             className="px-4 py-2 bg-blue-600 rounded"
//           >
//             Unblock
//           </button>
//         )}
//       </div>

//       {/* Info Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Basic Info */}
//         <div className="bg-white p-4 rounded">
//           <h2 className="text-xl font-semibold mb-3">Company Info</h2>
//           <p><strong>Phone:</strong> {company.phone}</p>
//           <p><strong>Description:</strong> {company.description}</p>
//           <p><strong>GST:</strong> {company.gstNumber}</p>
//           <p><strong>License:</strong> {company.licenseNumber}</p>
//         </div>

//         {/* Owner */}
//         <div className="bg-white p-4 rounded">
//           <h2 className="text-xl font-semibold mb-3">Owner</h2>
//           <p><strong>Name:</strong> {company.ownerId?.username}</p>
//           <p><strong>Email:</strong> {company.ownerId?.email}</p>
//           <p><strong>Phone:</strong> {company.ownerId?.phone}</p>
//         </div>

//         {/* Address */}
//         <div className="bg-white p-4 rounded">
//           <h2 className="text-xl font-semibold mb-3">Address</h2>
//           <p>{company.address?.street}</p>
//           <p>{company.address?.city}</p>
//           <p>{company.address?.state}</p>
//           <p>{company.address?.country}</p>
//           <p>{company.address?.postalCode}</p>
//         </div>

//         {/* Documents */}
//         <div className="bg-white p-4 rounded">
//           <h2 className="text-xl font-semibold mb-3">Documents</h2>

//           <div className="flex gap-4">
//             {company.documents?.gstCertificate?.url && (
//               <a
//                 href={company.documents.gstCertificate.url}
//                 target="_blank"
//                 className="text-blue-400 underline"
//               >
//                 GST Certificate
//               </a>
//             )}

//             {company.documents?.businessLicense?.url && (
//               <a
//                 href={company.documents.businessLicense.url}
//                 target="_blank"
//                 className="text-blue-400 underline"
//               >
//                 License
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminCompanyDetailsPage;