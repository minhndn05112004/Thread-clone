import { useState, useEffect } from "react";
import { useParams } from "react-router";
import FeedHeader from "@/components/FeedHeader";
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal, Plus, ChevronDown } from 'lucide-react';
import { httpRequest } from "@/utils/httpRequest";
import { likeStore } from "@/utils/likeStore";

// ─────────────────────────────────────────────
// OriginalPost
// ─────────────────────────────────────────────
const OriginalPost = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(() => {
    return likeStore.get(post?.id, post?.isLiked || false, post?.stats?.likes || 0).liked;
  });
  const [likeCount, setLikeCount] = useState(() => {
    return likeStore.get(post?.id, post?.isLiked || false, post?.stats?.likes || 0).count;
  });

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newIsLiked);
    setLikeCount(newCount);
    likeStore.set(post.id, newIsLiked, newCount);

    try {
      if (newIsLiked) {
        await httpRequest.post(`/api/posts/${post.id}/like`);
      } else {
        await httpRequest.delete(`/api/posts/${post.id}/like`);
      }
      if (onLike) onLike(post.id, newIsLiked);
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikeCount(likeCount);
      likeStore.set(post.id, !newIsLiked, likeCount);
      console.error("Lỗi like bài viết:", error);
    }
  };

  if (!post) return null;

  return (
    <div className="p-4 bg-[#181818] rounded-t-[24px] text-white">
      <div className="flex items-start">
        <div className="relative mr-3 flex-shrink-0">
          <img
            src={post.user?.avatar || `https://i.pravatar.cc/40?u=${post.user?.id}`}
            className="w-10 h-10 rounded-full bg-gray-700 object-cover"
            alt="avatar"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-black border-2">
            <Plus size={10} className="text-black stroke-[4]" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-semibold text-[14px] truncate">{post.user?.name}</span>
              <span className="text-gray-500 text-[14px] flex-shrink-0">{post.time || "vừa xong"}</span>
            </div>
            <MoreHorizontal size={18} className="text-gray-500 flex-shrink-0" />
          </div>

          <p className="text-[15px] mt-1 mb-3 font-light leading-relaxed break-words whitespace-pre-wrap">
            {post.content}
          </p>

          {post.images && post.images.length > 0 && (
            <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Post image ${idx + 1}`}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          )}

          <div className="flex gap-5 text-gray-300">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                isLiked ? "text-pink-500 hover:text-pink-400" : "hover:text-pink-400"
              }`}
            >
              <Heart size={18} className={isLiked ? "fill-pink-500" : ""} />
              <span className="text-xs">{likeCount}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18} />
              <span className="text-xs">{post.stats?.comments ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Repeat2 size={18} />
              <span className="text-xs">{post.stats?.reposts ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Send size={18} />
              <span className="text-xs">{post.stats?.shares ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CommentItem
// ─────────────────────────────────────────────
const CommentItem = ({ reply }) => {
  const [isLiked, setIsLiked] = useState(() => {
    return likeStore.get(reply?.id, reply?.isLiked || false, reply?.stats?.likes || 0).liked;
  });
  const [likeCount, setLikeCount] = useState(() => {
    return likeStore.get(reply?.id, reply?.isLiked || false, reply?.stats?.likes || 0).count;
  });

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newIsLiked);
    setLikeCount(newCount);
    likeStore.set(reply.id, newIsLiked, newCount);

    try {
      if (newIsLiked) {
        await httpRequest.post(`/api/posts/${reply.id}/reply/like`);
      } else {
        await httpRequest.delete(`/api/posts/${reply.id}/reply/like`);
      }
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikeCount(likeCount);
      likeStore.set(reply.id, !newIsLiked, likeCount);
      console.error("Lỗi like comment:", error);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-[#2a2a2a] text-white">
      <div className="flex items-start">
        <div className="relative mr-3 flex-shrink-0 min-w-[40px]">
          <img
            src={reply.user?.avatar || `https://i.pravatar.cc/40?u=${reply.user?.id}`}
            className="w-10 h-10 rounded-full bg-gray-800 object-cover"
            alt="avatar"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-semibold text-[14px] truncate">{reply.user?.name}</span>
              <span className="text-gray-500 text-[14px] flex-shrink-0">{reply.time || "vừa xong"}</span>
            </div>
            <MoreHorizontal size={16} className="text-gray-600 flex-shrink-0" />
          </div>
          <p className="text-[14px] mt-0.5 mb-2 break-words whitespace-pre-wrap">{reply.content}</p>
          <div className="flex gap-5 text-gray-400 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                isLiked ? "text-pink-500 hover:text-pink-400" : "hover:text-pink-400"
              }`}
            >
              <Heart size={18} className={isLiked ? "fill-pink-500" : ""} />
              <span className="text-xs">{likeCount}</span>
            </button>
            <MessageCircle size={18} className="cursor-pointer" />
            <Repeat2 size={18} className="cursor-pointer" />
            <Send size={18} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CommentInput
// ─────────────────────────────────────────────
const CommentInput = ({ postId, onCommentAdded, currentUser, setCurrentUser }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newComment = await httpRequest.post(`/api/posts/${postId}/reply`, { content: content.trim() });
      if (newComment?.user && !currentUser) setCurrentUser(newComment.user);
      setContent("");
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (error) {
      alert("Không thể đăng bình luận.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-[#2a2a2a] bg-[#181818]">
      <div className="flex gap-3">
        <img
          src={currentUser?.avatar || `https://i.pravatar.cc/40?u=${currentUser?.id || 'default'}`}
          className="w-10 h-10 rounded-full bg-gray-800 object-cover"
          alt="avatar"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full bg-[#242526] text-white rounded-lg px-3 py-2 text-[14px] resize-none focus:outline-none"
            rows="2"
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang đăng..." : "Đăng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PostDetail (main)
// ─────────────────────────────────────────────
export default function PostDetail() {
  const params = useParams();
  const postId = params.id || params.postId || params['*'];

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!postId) { setError("ID không hợp lệ"); setLoading(false); return; }

    const fetchData = async () => {
      try {
        const [postRes, repliesRes] = await Promise.all([
          httpRequest.get(`/api/posts/${postId}`),
          httpRequest.get(`/api/posts/${postId}/replies`),
        ]);

        const postData = postRes?.data ?? postRes;
        setPost(postData);

        const repliesData = Array.isArray(repliesRes)
          ? repliesRes
          : (repliesRes?.data ?? repliesRes?.items ?? []);
        setReplies(repliesData);

        const myReply = repliesData.find(r => r.isOwner || r.isMine);
        if (myReply?.user) setCurrentUser(myReply.user);
      } catch (err) {
        console.error('❌ fetchData error:', err);
        setError("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    if (newComment?.user && !currentUser) setCurrentUser(newComment.user);
    setReplies(prev => [newComment, ...prev]);
    setPost(prev => ({
      ...prev,
      stats: { ...prev.stats, comments: (prev.stats?.comments || 0) + 1 },
    }));
  };

  if (loading) return <div className="text-white p-4 text-center">Đang tải...</div>;
  if (error || !post) return <div className="text-red-500 p-4 text-center">{error || "Không tìm thấy"}</div>;

  return (
    <div>
      <FeedHeader title="Thread" showBack />
      <div className="flex flex-col bg-[#181818] border border-[#3a3a3a] rounded-[24px] overflow-hidden">
        <OriginalPost post={post} />

        <div className="px-4 py-2 flex justify-between items-center border-y border-[#1a1a1a]">
          <div className="flex items-center text-gray-300 text-[14px] font-bold">
            Hàng đầu <ChevronDown size={16} className="ml-1" />
          </div>
        </div>

        <CommentInput
          postId={postId}
          onCommentAdded={handleCommentAdded}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />

        <div className="flex flex-col">
          {replies.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">Chưa có bình luận nào</div>
          ) : (
            replies.map((reply) => <CommentItem key={reply.id} reply={reply} />)
          )}
        </div>
      </div>
    </div>
  );
}