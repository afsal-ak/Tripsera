import { Menu } from "lucide-react";
import { Button } from "@/features/components/Button";
interface AdminNavbarProps {
  onSidebarToggle: () => void;
  title: string;
}

const Header = ({ onSidebarToggle, title }: AdminNavbarProps) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome, Admin
            </div>
            <Button variant="outline" className="border-orange text-orange hover:bg-orange hover:text-white">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;