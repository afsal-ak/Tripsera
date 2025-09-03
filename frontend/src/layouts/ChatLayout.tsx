import { Outlet } from "react-router-dom";

export default function ChatLayout() {
  return (
    <div className="w-full h-screen bg-chatBg flex">
      {/* Chat List Sidebar */}
      <div className="hidden md:flex md:w-[30%] border-r bg-white">
        <Outlet context="chatList" />
      </div>

      {/* Message Section */}
      <div className="hidden md:flex md:flex-1 bg-gray-100">
        <Outlet context="messagePage" />
      </div>
    </div>
  );
}
