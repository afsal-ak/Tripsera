import Navbar from "@/features/components/Navbar";
import Footer from "@/features/components/Footer";
const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background font-poppins text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default UserLayout;
