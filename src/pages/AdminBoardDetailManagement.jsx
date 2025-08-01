import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Edit, Trash2 } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { ADMIN, API_BASE_URL } from "../../configs/host-config";

const AdminBoardDetailManagement = () => {
  const navigate = useNavigate();
  const { postId, type } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  const fetchBoardDetail = async () => {
    console.log("fetchBoardDetail 호출됨:", { postId, type });
    setLoading(true);

    try {
      let response;

      if (type === "animal") {
        response = await axiosInstance.get(
          `${API_BASE_URL}${ADMIN}/board/detail/${postId}`
        );
        console.log("분양게시판 전체 응답:", response);
        console.log("분양게시판 응답 데이터:", response.data);
        const animalData = response.data.result;
        console.log("분양게시판 result 데이터:", animalData);
        console.log("분양게시판 thumbnailImage:", animalData.thumbnailImage);
        console.log("분양게시판 모든 필드:", Object.keys(animalData));
        setPost({
          postId: animalData.postId,
          title: animalData.title || "제목 없음",
          author: animalData.nickname || animalData.author || "작성자 없음",
          createdAt: formatDate(animalData.createAt || animalData.createdAt),
          viewCount: animalData.viewCount || 0,
          category: "분양게시판",
          type: "animal",
          petInfo: {
            breed: animalData.petKind || animalData.breed || "정보 없음",
            age: animalData.age || "정보 없음",
            gender:
              animalData.sexCode === "MALE"
                ? "수컷"
                : animalData.sexCode === "FEMALE"
                ? "암컷"
                : "정보 없음",
            region: animalData.address || "정보 없음",
            vaccination: animalData.vaccine || "정보 없음",
            neutered:
              animalData.neuterYn === "Y"
                ? "완료"
                : animalData.neuterYn === "N"
                ? "미완료"
                : "정보 없음",
            fee: animalData.fee ? `${animalData.fee}원` : "무료",
          },
          content: animalData.content || "내용 없음",
          image: (() => {
            console.log("설정할 이미지 값:", animalData.thumbnailImage);
            return animalData.thumbnailImage || null;
          })(),
          reservationStatus:
            animalData.reservationStatus === "AVAILABLE"
              ? "예약가능"
              : animalData.reservationStatus === "RESERVED"
              ? "예약완료"
              : animalData.reservationStatus === "COMPLETED"
              ? "분양완료"
              : "예약가능",
        });
      } else {
        response = await axiosInstance.get(
          `${API_BASE_URL}${ADMIN}/board/detail/${type}/${postId}`
        );
        console.log("전체 응답:", response);
        console.log("응답 데이터:", response.data);
        console.log("응답 데이터 타입:", typeof response.data);
        console.log("response.data.result 존재 여부:", !!response.data.result);

        let boardData;
        if (response.data.result) {
          boardData = response.data.result;
          console.log("정보게시판 응답 데이터:", boardData);
          console.log("정보게시판 thumbnailimage:", boardData.thumbnailimage);
          console.log("정보게시판 모든 필드:", Object.keys(boardData));
        } else if (response.data) {
          // result가 없으면 response.data 자체가 데이터일 수 있음
          boardData = response.data;
          console.log("정보게시판 응답 데이터 (result 없음):", boardData);
          console.log("정보게시판 thumbnailimage:", boardData.thumbnailimage);
          console.log("정보게시판 모든 필드:", Object.keys(boardData));
        } else {
          console.log(
            "response.data.result가 없습니다. 전체 response.data:",
            response.data
          );
          return;
        }

        setPost({
          postId: boardData.postId || boardData.postId,
          title: boardData.title || "제목 없음",
          author: boardData.nickname || "작성자 없음",
          createdAt: formatDate(boardData.createdat || boardData.createAt),
          viewCount: boardData.viewcount || boardData.viewCount || 0,
          category: getCategoryLabel(type),
          type: "board",
          content: boardData.content || "내용 없음",
          image: (() => {
            console.log("설정할 이미지 값:", boardData.thumbnailimage);
            return boardData.thumbnailimage || null;
          })(),
        });
      }
    } catch (error) {
      console.error("게시물 상세 조회 실패:", error);
      alert("게시물을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}. ${MM}. ${dd}.`;
  };

  const handleBackToList = () => {
    navigate("/admin/boards");
  };

  const handleEdit = () => {
    console.log("게시물 수정");
  };

  const handleDelete = async () => {
    if (confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        console.log("게시물 삭제 시작:", { postId, type });

        let deleteUrl;
        if (type === "animal") {
          // 분양게시판 삭제: /{category}/delete/{postId}
          deleteUrl = `${API_BASE_URL}${ADMIN}/board/ANIMAL/delete/${postId}`;
        } else {
          // 일반게시판 삭제: /{category}/delete/{postId}
          deleteUrl = `${API_BASE_URL}${ADMIN}/board/${type}/delete/${postId}`;
        }

        console.log("삭제 요청 URL:", deleteUrl);
        console.log("삭제 요청 파라미터:", { postId, type });

        const response = await axiosInstance.delete(deleteUrl);
        console.log("삭제 응답:", response);

        if (response.status === 200) {
          alert("게시물이 성공적으로 삭제되었습니다.");
          navigate("/admin/boards");
        } else {
          alert("게시물 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("게시물 삭제 실패:", error);
        console.error("에러 응답:", error.response);

        if (error.response?.status === 404) {
          alert("게시물을 찾을 수 없습니다.");
        } else if (error.response?.status === 403) {
          alert("삭제 권한이 없습니다.");
        } else {
          alert("게시물 삭제 중 오류가 발생했습니다.");
        }
      }
    }
  };

  useEffect(() => {
    console.log("useEffect 호출됨:", { postId, type });
    fetchBoardDetail();
  }, [postId, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">게시물을 불러오는 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">게시물을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>목록으로</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{post.category}</span>
              <span>•</span>
              <span>{post.title}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>작성자: {post.author}</span>
                <span>작성일: {post.createdAt}</span>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{post.viewCount}</span>
                </div>
              </div>
            </div>
            {type === "animal" && (
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                  {post.petInfo?.fee}
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  {post.reservationStatus}
                </div>
              </div>
            )}
          </div>
        </div>

        {(() => {
          console.log("렌더링 시 이미지 값:", post.image);
          return post.image;
        })() && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {type === "animal" && post.petInfo && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              펫 정보
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">품종</span>
                <span className="font-medium">{post.petInfo.breed}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">나이</span>
                <span className="font-medium">{post.petInfo.age}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">성별</span>
                <span className="font-medium">{post.petInfo.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">지역</span>
                <span className="font-medium">{post.petInfo.region}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">예방접종</span>
                <span className="font-medium">{post.petInfo.vaccination}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">중성화</span>
                <span className="font-medium">{post.petInfo.neutered}</span>
              </div>
              <div className="flex justify-between py-2 col-span-2">
                <span className="text-gray-600">책임비</span>
                <span className="font-medium text-orange-600">
                  {post.petInfo.fee}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            상세 설명
          </h2>
          <div className="text-gray-700 leading-relaxed">{post.content}</div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBoardDetailManagement;
