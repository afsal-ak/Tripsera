// AUTH ROUTES
export const AUTH_ROUTES = {
  REFRESH_TOKEN: '/refresh-token',
  LOGIN: '/admin-login',
  FORGOT_PASSWORD: '/forgotPassword',
  FORGOT_PASSWORD_CHANGE: '/forgotPasswordChange',
  LOGOUT: '/logout',
};

// USER MANAGEMENT ROUTES
export const USER_MANAGEMENT_ROUTES = {
  GET_ALL_USERS: '/users',
  GET_SINGLE_USER: '/users/:userId',
  TOGGLE_BLOCK: '/users/:userId/toggle-block',
  SEARCH_USERS: '/users/search-all',
};

// BANNER ROUTES
export const BANNER_ROUTES = {
  ADD: '/addBanner',
  GET_ALL: '/banners',
  BLOCK: '/banners/:bannerId/block',
  UNBLOCK: '/banners/:bannerId/unblock',
  DELETE: '/banners/:bannerId/delete',
};

// CATEGORY ROUTES
export const CATEGORY_ROUTES = {
  GET_ALL: '/categories',
  GET_ACTIVE: '/category/active',
  GET_BY_ID: '/category/:id',
  ADD: '/addCategory',
  EDIT: '/category/:id',
  BLOCK: '/category/:id/block',
  UNBLOCK: '/category/:id/unblock',
};

// PACKAGE ROUTES
export const PACKAGE_ROUTES = {
  GET_ALL: '/packages',
  GET_BY_ID: '/packages/:id',
  ADD: '/addPackage',
  EDIT: '/packages/:id/edit',
  BLOCK: '/packages/:id/block',
  UNBLOCK: '/packages/:id/unblock',
};

// COUPON ROUTES
export const COUPON_ROUTES = {
  GET_ALL: '/coupons',
  ADD: '/coupon/add',
  GET_BY_ID: '/coupon/:id',
  EDIT: '/coupon/edit/:id',
  STATUS: '/coupon/status/:id',
  DELETE: '/coupon/delete/:id',
};

// BOOKING ROUTES
export const BOOKING_ROUTES = {
  GET_ALL: '/booking',
  GET_BY_ID: '/booking/:id',
  CANCEL: '/booking/cancel/:id',
  CONFIRM: '/booking/confirm/:id',
  CHANGE_TRAVEL_DATE: '/booking/:id/change-travel-date',
};

// BLOG ROUTES
export const BLOG_ROUTES = {
  GET_ALL: '/blogs',
  GET_BY_ID: '/blog/:blogId',
  DELETE: '/blog/:blogId',
  STATUS: '/blog/status/:blogId',
};

export const REVIEW_ROUTE = {
  GET_REVIEWS: '/reviews',
  GET_BY_ID: '/reviews/:reviewId',
  CHANGE_STATUS: '/reviews/:reviewId/status',
  DELETE: '/reviews/:reviewId/delete',
};

export const REFERRAL_ROUTE = {
  GET_REFERRAL: '/referral',
  ADD_REFERRAL: '/referral/add',
  GET_BY_ID: '/referral/:referralId',
  CHANGE_STATUS: '/referral/:referralId/status',
};

export const SALES_REPORT_ROUTE = {
  GET_SALES_REPORT: '/salesReport',
  SALES_REPORT_EXCEL_DOWNLOAD: '/salesReport/excel/download',
  SALES_REPORT_PDF_DOWNLOAD: '/salesReport/pdf/download',
};

export const REPORT_ROUTE = {
  GET_REPORT: '/reports',
  GET_REPORT_BY_ID: '/reports/:id',
  GET_REPORT_BY_TYPE: '/reports/type/:reportedId/:type',
  UPDATE_REPORT_STATUS: '/reports/:id/update',
  UPDATE_REPORTED_ITEM_STATUS: '/reports/type/:reportedId/update',
};

export const CUSTOM_PACKAGE_ROUTE = {
  CHANGE_STATUS: '/custom-package/:packageId/edit',
    GET_ALL_APPROVED_PKG: '/custom-package/approved',
  GET_ALL_REQUESTED_PKG: '/custom-package',

  GET_BY_ID: '/custom-package/:packageId',
  DELETE: '/custom-package/:packageId/delete',
  CREATE:'/custom-package/create',
  UPDATE:'/custom-package/edit/:id'
 };

export const DASHBOARD_ROUTE = {
  GET_DASHBOARD_SUMMARY: '/dashboard/summary',
  GET_TOP_PACKAGES: '/dashboard/top-packages',
  GET_TOP_CATEGORIES: '/dashboard/top-category',
  GET_BOOKING_CHART: '/dashboard/booking-chart',
};

export const CHAT_ROOM_ROUTE = {
  CREATE: '/chatrooms',
  UPDATE: '/chatrooms/:roomId',
    TOATAL_UNREAD_COUNT:'/count/chatrooms',

  GET_BY_ID: '/chatrooms/:roomId',
  GET_USER_ROOMS: '/chatrooms',
  DELETE: '/chatrooms/:roomId',
};

export const MESSAGE_ROUTE = {
  SEND: '/chatrooms/messages',
  GET_BY_ROOM: '/chatrooms/:roomId/messages',
  MARK_AS_READ: '/messages/:messageId/read',
  DELETE: '/messages/:messageId',
  UPLOAD_MEDIA: '/messages/upload',
};

export const NOTIFICATION_ROUTE = {
  FETCH_NOTIFICATION: '/notification',
  MARK_AS_READ: '/mark-read/:id',
};
