/**
 * likeStore — lưu trạng thái like và số lượng like vào localStorage
 * Structure: { [postId]: { liked: boolean, count: number } }
 */

const STORAGE_KEY = "likeStore";

const getStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStore = (store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
};

export const likeStore = {
  // Lấy record của 1 post, fallback về giá trị từ API nếu chưa có
  get(postId, fallbackLiked = false, fallbackCount = 0) {
    const store = getStore();
    const record = store[String(postId)];
    if (!record) return { liked: fallbackLiked, count: fallbackCount };
    return record;
  },

  // Ghi lại sau mỗi lần like/unlike
  set(postId, liked, count) {
    const store = getStore();
    store[String(postId)] = { liked, count };
    saveStore(store);
  },

  // Xoá khi logout
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};