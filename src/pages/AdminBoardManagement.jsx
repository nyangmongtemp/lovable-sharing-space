import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../configs/axios-config";
import { ADMIN, API_BASE_URL } from "../../configs/host-config";
import { API_ENDPOINTS } from "../../configs/api-endpoints";

const AdminBoardManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const forceEmailChange = sessionStorage.getItem("forceEmailChange");
    if (forceEmailChange) {
      alert("이메일 변경을 완료해야 다른 기능을 이용할 수 있습니다.");
      navigate("/admin/mypage", { replace: true });
      return;
    }
  }, [navigate]);

  // 모든 게시판 목록 조회 함수
  const fetchAllBoardList = async () => {
    setLoading(true);
    try {
      const allPosts = [];

      // 1. 분양게시판 데이터 조회
      try {
        const animalResponse = await axiosInstance.get(
          `${API_BASE_URL}${ADMIN}/board/list`,
          {
            params: {
              page: 0,
              size: 100, // 충분히 큰 수로 설정
              sort: "postId,desc", // postId로 정렬
            },
          }
        );

        const animalData = animalResponse.data.result.content.map((item) => ({
          postId: item.postId,
          category: "분양게시판",
          title: item.title || "제목 없음",
          author: item.nickname || "작성자 없음", // nickname 필드 사용
          createdAt: formatDate(item.createAt || item.createdAt),
          type: "animal",
        }));

        allPosts.push(...animalData);
      } catch (error) {
        console.error("분양게시판 조회 실패:", error);
      }

      // 2. 정보게시판들 데이터 조회 (질문, 후기, 자유, 소개)
      const infoCategories = ["QUESTION", "REVIEW", "FREE", "INTRODUCTION"];

      for (const category of infoCategories) {
        try {
          const boardResponse = await axiosInstance.get(
            `${API_BASE_URL}${ADMIN}/board/list/${category}`,
            {
              params: {
                page: 0,
                size: 100,
                sort: "postId,desc", // postId로 정렬
              },
            }
          );

          const boardData = boardResponse.data.content.map((item) => ({
            postId: item.postId,
            category: getCategoryLabel(item.category || category),
            title: item.title || "제목 없음",
            author: item.nickname || "작성자 없음",
            createdAt: formatDate(item.createAt),
            type: "board",
          }));

          allPosts.push(...boardData);
        } catch (error) {
          console.error(`${category} 게시판 조회 실패:`, error);
        }
      }

      // 3. postId 기준으로 내림차순 정렬 (최신순)
      allPosts.sort((a, b) => b.postId - a.postId);

      console.log("로드된 게시물들:", allPosts);
      setPosts(allPosts);
    } catch (error) {
      console.error("게시판 목록 조회 실패:", error);
      alert("게시판 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 라벨 변환 함수
  const getCategoryLabel = (category) => {
    const categoryMap = {
      QUESTION: "질문게시판",
      REVIEW: "후기게시판",
      FREE: "자유게시판",
      INTRODUCTION: "소개게시판",
      ANIMAL: "분양게시판",
    };
    return categoryMap[category] || category;
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}.${MM}.${dd} ${HH}:${mm}`;
  };

  // 검색 실행
  const handleSearch = () => {
    fetchAllBoardList();
  };

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchAllBoardList();
  }, []);

  // 검색 필터링
  const filteredPosts = searchTerm
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="ml-80 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">게시판 관리</h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 검색 영역 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4">
                <Input
                  placeholder="검색어 입력"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 max-w-md"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? "검색 중..." : "검색"}
                </Button>
              </div>
            </div>

            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                <div>번호</div>
                <div>카테고리 종류</div>
                <div>게시물 제목</div>
                <div>작성자</div>
                <div>생성일자</div>
              </div>
            </div>

            {/* 게시물 목록 */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  게시물을 불러오는 중...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  게시물이 없습니다.
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={`${post.type}-${post.postId}`}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      console.log("게시물 클릭됨:", post);
                      const url = `/admin/board-detail/${
                        post.type === "animal"
                          ? "animal"
                          : post.category === "질문게시판"
                          ? "QUESTION"
                          : post.category === "후기게시판"
                          ? "REVIEW"
                          : post.category === "자유게시판"
                          ? "FREE"
                          : post.category === "소개게시판"
                          ? "INTRODUCTION"
                          : "QUESTION"
                      }/${post.postId}`;
                      console.log("이동할 URL:", url);
                      navigate(url);
                    }}
                  >
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div className="text-sm text-gray-900">{post.postId}</div>
                      <div className="text-sm text-gray-900">
                        {post.category}
                      </div>
                      <div className="text-sm text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-900">{post.author}</div>
                      <div className="text-sm text-gray-500">
                        {post.createdAt}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBoardManagement;
