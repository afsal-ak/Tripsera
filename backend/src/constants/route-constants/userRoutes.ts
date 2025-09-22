export const AUTH_ROUTES = {
  REFRESH_TOKEN: '/refresh-token',
  PRE_REGISTER: '/pre-register',
  REGISTER: '/register',
  RESEND_OTP: '/resend-otp',
  LOGIN: '/login',
  GOOGLE_LOGIN: '/google-login',
  FORGOT_PASSWORD: '/forgotPassword',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD_CHANGE: '/forgotPasswordChange',
  LOGOUT: '/logout',
  EMAIL_REQUEST_CHANGE: '/email/request-change',
  EMAIL_VERIFY_CHANGE: '/email/verify-change',
  PASSWORD_CHANGE: '/password/change',
};

export const HOME_ROUTES = {
  HOME: '/home',
  PACKAGES: '/packages',
  PACKAGE_BY_ID: '/packages/:id',
};
//router.get('/packages/:id', homeController.getPackagesById);

export const PROFILE_ROUTES = {
  GET_PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/update',
  UPLOAD_PROFILE_IMAGE: '/profile/uploadProfileImage',
  CREATE_COVER_IMAGE: '/profile/uploadCoverImage',
  UPDATE_ADDRESS: '/profile/updateAddress',
  GET_PUBLIC_PROFILE: '/profile/:username',
  FOLLOW: '/follow/:userId',
  UNFOLLOW: '/unfollow/:userId',
  SET_PROFILE_PRIVACY: '/profile/privacy',
};
export const USER_ROUTES = {
  SEARCH_USERS_FOR_CHAT: '/users/search'
};

export const WISHLIST_ROUTES = {
  GET_ALL: '/wishlist',
  CHECK: '/wishlist/check',
  ADD: '/wishlist/add',
  DELETE: '/wishlist/delete',
};

export const COUPON_ROUTES = {
  GET_COUPONS: '/coupons',
  APPLY: '/coupon/apply',
};

export const WALLET_ROUTES = {
  GET_WALLET: '/wallet',
  BALANCE: '/wallet-balance',
  CREDIT: '/wallet/credit',
  DEBIT: '/wallet/debit',
};

export const BOOKING_ROUTES = {
  GET_BOOKINGS: '/booking',
  GET_BY_ID: '/booking/:id',
  CANCEL: '/booking/cancel/:id',
  ONLINE_BOOKING: '/booking/online',
  VERIFY_PAYMENT: '/booking/verify',
  CANCEL_UNPAID: '/payment-cancel/:id',
  RETRY_PAYMENT: '/retry-payment/:id',
  WALLET_BOOKING: '/booking/wallet',
  INVOICE_DOWNLOAD: '/booking/invoice/:bookingId/download',
};

export const BLOG_ROUTES = {
  CREATE: '/blog/create',
  EDIT: '/blog/edit/:blogId',
  GET_ALL: '/blogs',
  GET_USER_BLOGS: '/blogs/user',
  GET_PUBLIC_USER_BLOGS: '/blogs/public/:userId',
  GET_BY_ID: '/blog/:blogId',
  GET_BY_SLUG: '/blog/slug/:slug',
  DELETE: '/blog/delete/:blogId',
  LIKE: '/blog/like/:blogId',
  UNLIKE: '/blog/unlike/:blogId',
  BLOG_LIKE_LIST: '/blog/likeList/:blogId',
};

export const REVIEW_ROUTE = {
  GET_USER_REVIEWS: '/users/me/reviews',
  GET_BY_PACKAGE: '/packages/:packageId/reviews',
  GET_BY_ID: '/reviews/:reviewId',
  GET_REVIEW_RATING: '/reviews/summary/:packageId',
  CREATE: '/packages/:packageId/reviews',
  UPDATE: '/reviews/:reviewId/edit',
  DELETE: '/reviews/:reviewId/delete',
};

export const REPORT_ROUTE = {
  CREATE: '/report/:reportedId',
};

export const CUSTOM_PACKAGE_ROUTE = {
  CREATE: '/custom-package/create',
  UPDATE: '/custom-package/:packageId/edit',
  GET_BY_ID: '/custom-package/:packageId',
  GET_ALL_PKG: '/custom-package',
  DELETE: '/custom-package/:packageId/delete',
};


export const CHAT_ROOM_ROUTE = {
  CREATE: "/chatrooms",
  UPDATE: "/chatrooms/:roomId",
  GET_BY_ID: "/chatrooms/:roomId",
  GET_USER_ROOMS: "/chatrooms",
  DELETE: "/chatrooms/:roomId",
};


export const MESSAGE_ROUTE = {
  SEND: "/chatrooms/messages",
  GET_BY_ROOM: "/chatrooms/:roomId/messages",
  MARK_AS_READ: "/messages/:messageId/read",
  DELETE: "/messages/:messageId",
  UPLOAD_MEDIA: '/messages/upload'

};


export const NOTIFICATION_ROUTE={
  FETCH_NOTIFICATION:'/notification',
  MARK_AS_READ:'/mark-read/:id'
}


export const BLOCK_ROUTE={
  BLOCK:'/block',
  UNBLOCK:'/unblock',
  IS_BLOCKED:'/blocked/:blockedId',
  GELL_ALL:'blocked'
}