import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Edit, Trash2 } from "lucide-react";
import axiosInstance from "../../configs/axios-config";
import { useAuth } from "@/context/UserContext";
import { API_BASE_URL, BOARD, USER } from "../../configs/host-config";
import CommentSection from "@/components/CommentSection";
import ReportButton from "../components/ReportButton";

const ChildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { nickname: userNickname, isLoggedIn } = useAuth();
  const [nowLoggedUserId, setNowLoggedUserId] = useState(null);

  const IMAGE_BASE_URL = "http://localhost:8000/path/to/image/dir/"; // 실제 이미지 경로로 수정

  // 날짜 포맷 함수 추가
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  // 유저 ID 비동기 조회 함수 추가
  const getNowLoggedUserId = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}${USER}/findId`);
      console.log(response);

      setNowLoggedUserId(response.data);
      return response.data;
    } catch (err) {
      console.error("유저 ID 조회 실패:", err);
      setNowLoggedUserId(null);
      return null;
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`${API_BASE_URL}${BOARD}/detail/INTRODUCTION/${id}`)
      .then((res) => {
        console.log(res);

        let data = res.data.result || res.data.data || res.data;
        if (Array.isArray(data)) data = data[0];
        setPost({
          id: data.postid || data.postId,
          userId: data.userid || data.userId,
          title: data.title,
          content: data.content,
          nickname: data.nickname,
          createdAt: data.createdAt || data.createdat,
          updatedAt: data.updatedAt || data.updateAt,
          viewCount: data.viewcount,
          likes: data.likeCount,
          comments: data.commentCount,
          // 이미지 파일명만 내려올 경우 실제 URL로 변환
          thumbnailImage:
            data.thumbnailImage || data.thumbnailimage
              ? (data.thumbnailImage || data.thumbnailimage).startsWith("http")
                ? data.thumbnailImage || data.thumbnailimage
                : IMAGE_BASE_URL + (data.thumbnailImage || data.thumbnailimage)
              : null,
        });
        getNowLoggedUserId();
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("해당 게시글을 찾을 수 없습니다.");
        } else {
          setError("상세 정보를 불러오지 못했습니다.");
        }
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!post) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    window.alert("링크가 복사되었습니다!");
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(
        `${API_BASE_URL}${BOARD}/INTRODUCTION/delete/${post.id || post.postId}`
      );
      alert("게시글이 삭제되었습니다.");
      navigate("/child/list");
    } catch (err) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 썸네일 이미지 필드명 대응
  const thumbnail = post.thumbnailImage || post.thumbnailimage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 영역 */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-blue-200 shadow-sm">
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  ← 목록으로
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">
                  우리 아이 소개 상세
                </h1>
                {/* 공유, 수정, 삭제 버튼 */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  {post && userNickname && post.nickname === userNickname && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/child/edit/${post.id || post.postId}`)
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {/* 신고 버튼: 본인 댓글이 아니면 노출 */}
                  {nowLoggedUserId !== post.userId && (
                    <ReportButton
                      category="board"
                      accusedUserId={post.userId}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {thumbnail && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={thumbnail}
                      alt={post.title}
                      className="max-h-80 rounded-lg object-contain"
                    />
                  </div>
                )}

                <div
                  className="text-gray-700 mb-4 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>작성자: {post.nickname}</span>
                  <span>
                    작성일: {formatDateTime(post.createdAt || post.createAt)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>조회수: {post.viewCount}</span>
                </div>
              </CardContent>
            </Card>
            {/* 댓글 섹션 */}
            <CommentSection
              postId={post.id}
              userId={post.userId}
              category="introduction"
              showReplies={true}
              className="border-t pt-8"
            />
          </div>
          {/* 사이드바 영역 */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDetail;
