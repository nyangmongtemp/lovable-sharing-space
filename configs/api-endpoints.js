// API 엔드포인트 관리
export const API_ENDPOINTS = {
  // 사용자 관련
  USER: {
    LOGIN: "/user-service/user/login",
    SIGNUP: "/user-service/user/signup",
    REFRESH: "/user-service/user/refresh",
    PROFILE: "/user-service/user/profile",
    UPDATE_PROFILE: "/user-service/user/update",
    CHANGE_PASSWORD: "/user-service/user/change-password",
    RESET_PASSWORD: "/user-service/user/reset-password",
  },

  // 게시판 관련
  BOARD: {
    // 커뮤니티 게시판
    COMMUNITY: {
      LIST: "/board-service/community",
      DETAIL: (id) => `/board-service/community/${id}`,
      CREATE: "/board-service/community/create",
      UPDATE: (id) => `/board-service/community/${id}`,
      DELETE: (id) => `/board-service/community/${id}`,
      LIKE: (id) => `/board-service/community/${id}/like`,
      COMMENT: (id) => `/board-service/community/${id}/comments`,
    },

    // 입양 게시판
    ADOPTION: {
      LIST: "/animalboard-service/animal-board/list",
      DETAIL: (id) => `/animalboard-service/animal-board/${id}`,
      CREATE: "/animalboard-service/animal-board/create",
      UPDATE: (id) => `/animalboard-service/animal-board/${id}`,
      DELETE: (id) => `/animalboard-service/animal-board/${id}`,
      LIKE: (id) => `/animalboard-service/animal-board/${id}/like`,
    },

    // 구조 게시판
    RESCUE: {
      LIST: "/board-service/rescue",
      DETAIL: (id) => `/board-service/rescue/${id}`,
      CREATE: "/board-service/rescue/create",
      UPDATE: (id) => `/board-service/rescue/${id}`,
      DELETE: (id) => `/board-service/rescue/${id}`,
    },
  },

  // 유기동물 관련
  STRAY_ANIMAL: {
    LIST: "/animalboard-service/stray-animal-board/list",
    MAIN: "/animalboard-service/stray-animal-board/main",
    DETAIL: (id) => `/animalboard-service/stray-animal-board/${id}`,
    CREATE: "/animalboard-service/stray-animal-board/create",
    UPDATE: (id) => `/animalboard-service/stray-animal-board/${id}`,
    DELETE: (id) => `/animalboard-service/stray-animal-board/${id}`,
  },

  // 채팅 관련
  CHAT: {
    ROOMS: "/chat-service/rooms",
    MESSAGES: (roomId) => `/chat-service/rooms/${roomId}/messages`,
    SEND_MESSAGE: (roomId) => `/chat-service/rooms/${roomId}/messages`,
    CREATE_ROOM: "/chat-service/rooms/create",
  },

  // 관리자 관련
  ADMIN: {
    USERS: "/admin-service/users",
    USER_DETAIL: (id) => `/admin-service/admin/user/detail/${id}`,
    USER_LIST: "/admin-service/admin/user/list",
    BOARDS: "/admin-service/boards",
    INQUIRIES: "/admin-service/inquiries",
    BANNERS: "/admin-service/banners",
    POLICIES: "/admin-service/policies",
    TERMS_DETAIL: "/admin-service/admin/terms/lastPost",
    TERMS_COMMON: (category) => `/admin-service/admin/${category}`,
    TERMS_LIST: (category) => `/admin-service/admin/${category}/list`,
    LOGS: "/admin-service/logs",
    LOG_LIST: "/admin-service/admin/log/list",
    INFORM_LIST: "/admin-service/admin/inform/list",
    // 관리자 게시판 관련
    BOARD_LIST: (category) => `/admin-service/admin/board/list/${category}`,
    ANIMAL_LIST: "/admin-service/admin/board/list",
    BOARD_DETAIL: (category, postId) =>
      `/admin-service/admin/board/detail/${category}/${postId}`,
    ANIMAL_DETAIL: (postId) => `/admin-service/admin/board/detail/${postId}`,
  },

  // 고객 지원
  SUPPORT: {
    INQUIRY: "/support-service/inquiry",
    FAQ: "/support-service/faq",
    TERMS: "/support-service/terms",
    PRIVACY: "/support-service/privacy",
  },

  // 파일 업로드
  UPLOAD: {
    IMAGE: "/upload-service/image",
    FILE: "/upload-service/file",
  },
};

// API 호출 헬퍼 함수
export const createApiCall = (endpoint, method = "GET", data = null) => {
  return {
    url: endpoint,
    method,
    data,
  };
};

// 동적 엔드포인트 생성 헬퍼
export const createDynamicEndpoint = (baseEndpoint, ...params) => {
  return params.reduce(
    (endpoint, param) => endpoint.replace(/\{[^}]+\}/, param),
    baseEndpoint
  );
};
