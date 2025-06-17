
// import { useState } from "react";
// import AdminLayout from "../components/AdminLayout";
// import CategoryTable from "./Category.tsx/CategoryTable";
// import CategoryForm from "./Category.tsx/CategoryForm";
// import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";

// interface Category {
//   id: number;
//   name: string;
//   status: "active" | "blocked";
//   createdAt: string;
// }

// const AdminDashboard = () => {
//   const [currentPage, setCurrentPage] = useState("dashboard");
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);

//   const handlePageChange = (page: string) => {
//     setCurrentPage(page);
//     setEditingCategory(null);
//   };

//   const handleEditCategory = (category: Category) => {
//     setEditingCategory(category);
//     setCurrentPage("add-category");
//   };

//   const handleSaveCategory = () => {
//     setEditingCategory(null);
//     setCurrentPage("categories");
//   };

//   const handleCancelEdit = () => {
//     setEditingCategory(null);
//     setCurrentPage("categories");
//   };

//   const getPageTitle = () => {
//     switch (currentPage) {
//       case "categories":
//         return "Categories Management";
//       case "add-category":
//         return editingCategory ? "Edit Category" : "Add New Category";
//       default:
//         return "Dashboard";
//     }
//   };

//   const renderContent = () => {
//     switch (currentPage) {
//       case "categories":
//         return <CategoryTable onEdit={handleEditCategory} />;
//       case "add-category":
//         return (
//           <CategoryForm
//             category={editingCategory}
//             onSave={handleSaveCategory}
//             onCancel={handleCancelEdit}
//           />
//         );
//       default:
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Total Categories</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-orange">12</div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Active Categories</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-green-500">10</div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Blocked Categories</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-red-500">2</div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">New This Month</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-blue-500">3</div>
//               </CardContent>
//             </Card>
//           </div>
//         );
//     }
//   };

//   return (
//     <AdminLayout
//       title={getPageTitle()}
//       currentPage={currentPage}
//       onPageChange={handlePageChange}
//     >
//       {renderContent()}
//     </AdminLayout>
//   );
// };

// export default AdminDashboard;
// src/features/admin/pages/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader><CardTitle>Total Categories</CardTitle></CardHeader>
        <CardContent><div className="text-3xl font-bold text-orange">12</div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Active</CardTitle></CardHeader>
        <CardContent><div className="text-3xl font-bold text-green-500">10</div></CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
