
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: "사용자 관리", path: "/admin/users" },
    { title: "관리자 관리", path: "/admin/managers" },
    { title: "로그 관리", path: "/admin/logs" },
    { title: "게시판 관리", path: "/admin/boards" },
    { title: "배너 관리", path: "/admin/banner" },
    { title: "고객센터", path: "/admin/support" },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 pt-20">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-2 px-8 py-2"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">냥</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            냥몽 관리자페이지
          </h1>
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">관리자 메뉴</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 text-sm font-medium rounded-lg border transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      {/* 하단 버튼 영역 */}
      <div className="px-6 pb-6 space-y-3">
        <button
          onClick={() => navigate("/admin/mypage")}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
        >
          마이페이지
        </button>
        <button
          onClick={() => navigate("/admin/login")}
          className="w-full px-4 py-2 text-sm font-medium  border rounded-lg hover:bg-red-50 transition"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
