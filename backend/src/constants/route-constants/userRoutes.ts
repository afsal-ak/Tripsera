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
  UPDATE_ADDRESS: '/profile/updateAddress',
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
};

export const BLOG_ROUTES = {
  CREATE: '/blog/create',
  EDIT: '/blog/edit/:blogId',
  GET_ALL: '/blogs',
  GET_USER_BLOGS: '/blogs/user',
  GET_BY_ID: '/blog/:blogId',
   GET_BY_SLUG: '/blog/slug/:slug',
  DELETE: '/blog/delete/:blogId',
  LIKE: '/blog/like/:blogId',
  UNLIKE: '/blog/unlike/:blogId',
};

export const REVIEW_ROUTE = {
  GET_USER_REVIEWS: '/users/me/reviews',                 
  GET_BY_PACKAGE: '/packages/:packageId/reviews',         
  GET_BY_ID: '/reviews/:reviewId',         
  GET_REVIEW_RATING:'/reviews/summary/:packageId',
  CREATE: '/packages/:packageId/reviews',                 
  EDIT: '/packages/:packageId/reviews/:reviewId',         
  DELETE: '/reviews/:reviewId/delete',      
};
