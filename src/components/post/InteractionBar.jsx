import { useState } from "react"
import { Heart, MessageCircle, Repeat, Send } from "lucide-react"
import ReplyModal from "./ReplyModal"
import { httpRequest } from "@/utils/httpRequest"
import { likeStore } from "@/utils/likeStore"

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default function InteractionBar({ stats = {}, isLiked = false, postId, onLike }) {
  const [localIsLiked, setLocalIsLiked] = useState(() => {
    // Đọc từ localStorage, fallback về giá trị API
    return likeStore.get(postId, isLiked, stats.likes ?? 0).liked;
  });

  const [localLikes, setLocalLikes] = useState(() => {
    // Đọc count từ localStorage, fallback về giá trị API
    return likeStore.get(postId, isLiked, stats.likes ?? 0).count;
  });

  const [isAnimating, setIsAnimating] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)

  const handleLikeClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const newIsLiked = !localIsLiked
    const newCount = newIsLiked ? localLikes + 1 : Math.max(0, localLikes - 1)

    // Optimistic update UI + localStorage (cả liked và count)
    setLocalIsLiked(newIsLiked)
    setLocalLikes(newCount)
    likeStore.set(postId, newIsLiked, newCount)

    if (newIsLiked) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }

    try {
      if (newIsLiked) {
        await httpRequest.post(`/api/posts/${postId}/like`)
      } else {
        await httpRequest.delete(`/api/posts/${postId}/like`)
      }
      if (onLike) onLike(postId, newIsLiked)
    } catch (error) {
      // Rollback cả UI lẫn localStorage
      setLocalIsLiked(!newIsLiked)
      setLocalLikes(localLikes)
      likeStore.set(postId, !newIsLiked, localLikes)
      console.error("Lỗi like bài viết:", error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-2 transition-colors ${
              localIsLiked ? "text-pink-600 hover:text-pink-700" : "hover:text-pink-600"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${localIsLiked ? "fill-current" : ""} ${
                isAnimating ? "scale-125" : "scale-100"
              }`}
            />
            <span className={localIsLiked ? "font-medium" : ""}>{localLikes}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsReplyModalOpen(true)
            }}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{stats.comments ?? 0}</span>
          </button>

          {/* Repost */}
          <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
            <Repeat className="w-5 h-5" />
            <span>{stats.reposts ?? 0}</span>
          </button>

          {/* Share */}
          <button className="flex items-center gap-2 hover:text-gray-700 transition-colors">
            <Send className="w-5 h-5" />
            <span>{stats.shares ?? 0}</span>
          </button>
        </div>
      </div>

      <Modal isOpen={isReplyModalOpen} onClose={() => setIsReplyModalOpen(false)}>
        <ReplyModal postId={postId} onClose={() => setIsReplyModalOpen(false)} />
      </Modal>
    </>
  )
}