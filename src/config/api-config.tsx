// src/config/api-config.ts
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8090/api',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register'
    },
    PUBLICATIONS: {
      BASE: '/publications',
      PUBLIC: '/publications/public',
      ACTIVE: '/publications/public/active',
      BY_CATEGORY: '/publications/public/category',
      PENDING: '/publications/pending',
      APPROVE: (id: string) => `/publications/${id}/approve`,
      REJECT: (id: string) => `/publications/${id}/reject`,
      LIKE: (id: string) => `/publications/public/${id}/like`,
      DETAIL: (id: string) => `/publications/${id}`,
      PUBLIC_DETAIL: (id: string) => `/publications/public/${id}`
    },
    USERS: {
      BASE: '/users',
      DETAIL: (id: string) => `/users/${id}`,
      STATUS: (id: string) => `/users/${id}/status`
    },
    COMMENTS: {
      BASE: (publicationId: string) => `/publications/${publicationId}/comments`,
      DETAIL: (publicationId: string, commentId: string) => `/publications/${publicationId}/comments/${commentId}`
    },
    NEWSLETTER: {
      SUBSCRIBE: '/newsletter/subscribe',
      UNSUBSCRIBE: '/newsletter/unsubscribe',
      SUBSCRIBERS: '/newsletter/subscribers',
      DELETE_SUBSCRIBER: (id: string) => `/newsletter/subscribers/${id}`,
      TEST: '/newsletter/test'
    }
  };