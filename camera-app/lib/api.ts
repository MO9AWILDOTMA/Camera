import Role from "@/models/role.model"
import axios from "axios"

// Create an axios instance with credentials
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true,
})

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Redirect to login page or refresh token
      window.location.href = "/auth"
    }
    return Promise.reject(error)
  },
)

// Movies API
export const moviesApi = {
  getAll: (page?: number, size?: number) => api.get(`/user/movies`),
  getFeatured: () => api.get("/user/movies/featured"),
  getCurrentlyShowing: () => api.get("/user/movies/current"),
  getUpcoming: () => api.get("/user/movies/upcoming?size=4"),
  getById: (slug: string) => api.get(`/user/movies/${slug}`),
  search: (query: string) => api.get(`/user/movies/search/${query}`),
  // Admin endpoints
  create: (data: any) => api.post("/moderator/movies", data, {
    headers: { "Content-Type" : "multipart/form-data"}
  }),
  update: (id: number, data: any) => api.put(`/moderator/movies/${id}`, data, {
    headers: { "Content-Type" : "multipart/form-data"}
  }),
  delete: (id: number) => api.delete(`/moderator/movies/${id}`),
}

// Screening Rooms API
export const screenApi = {
  getAll: (page: number, size: number) => api.get(`/user/screeningRooms?page=${page}&size=${size}`),
  getById: (slug: string) => api.get(`/user/screeningRooms/${slug}`),
  // Admin endpoints
  create: (data: any) => api.post("/moderator/screeningRooms", data, {
    headers: { "Content-Type" : "multipart/form-data"}
  }),
  update: (id: number, data: any) => api.put(`/moderator/screeningRooms/${id}`, data, {
    headers: { "Content-Type" : "multipart/form-data"}
  }),
  delete: (id: number) => api.delete(`/moderator/screeningRooms/${id}`),
}

// Screening Rooms API
export const discountsApi = {
  getAll: (page:number, size: number) => api.get(`/moderator/discounts?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/moderator/discounts/${id}`),
  // Admin endpoints
  create: (data: any) => api.post("/moderator/discounts", data),
  update: (id: number, data: any) => api.put(`/moderator/discounts/${id}`, data),
  delete: (id: number) => api.delete(`/moderator/discounts/${id}`),
}

// Showtimes API
export const showtimesApi = {
  getByMovie: (movieId: number) => api.get(`/user/movies/showtimes/${movieId}`),
  getByTheater: (theaterId: number) => api.get(`/user/showtimes/theater/${theaterId}`),
  getById: (slug: string) => api.get(`/user/showtimes/${slug}`),
  getAll: (page: number, size: number) => api.get(`/user/showtimes?size=${size}&page=${page}`),
  // Admin endpoints
  create: (data: any) => api.post("/moderator/showtimes", data),
  update: (id: number, data: any) => api.put(`/moderator/showtimes/${id}`, data),
  delete: (id: number) => api.delete(`/moderator/showtimes/${id}`),
}

// Reservation API
export const reservationsApi = {
  create: (data: any) => api.post("/cinephile/reservations", data),
  getAll: (page: number, size: number) => api.get(`/moderator/reservations?size=${size}&page=${page}`),
  getUserReservation: (id: number) => api.get("/cinephile/reservations/" + id),
  getById: (id: number) => api.get(`/cinephile/reservations/${id}`),
  cancel: (id: number) => api.post(`/cinephile/reservations/${id}/cancel`),
}

export const paymentsApi = {
  create: (data: any) => api.post("/cinephile/payment", data),
  getAll: (page: number, size: number) => api.get(`/moderator/payments?size=${size}&page=${page}`),
  getUserPayments: (id: number) => api.get("/cinephile/payments/" + id),
  getById: (id: number) => api.get(`/user/payments/${id}`),
  cancel: (id: number) => api.post(`/payments/${id}/cancel`),
}

// Seats API
export const seatsApi = {
  getByShowtime: (showtimeId: number) => api.get(`/seats/showtime/${showtimeId}`),
  checkAvaibality: (seatId: number) => api(`/cinephile/seats/check/${seatId}`),
}

// Admin Analytics API
export const analyticsApi = {
  // getSales: (period: string) => api.get(`/admin/analytics/sales?period=${period}`),
  // getRevenue: (period: string) => api.get(`/admin/analytics/revenue?period=${period}`),
  // getOccupancy: (period: string) => api.get(`/admin/analytics/occupancy?period=${period}`),
  getAnalyticsData: (days: number) => api.get(`/moderator/analytics?days=${days}`)
}

export const usersApi = {
  getAll: (page: number, size: number) => api.get(`/admin/users?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/admin/users/${id}`),
  // Admin endpoints
  create: (data: any) => api.post("/admin/users", data),
  update: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  updateMyAccount: (data: any) => api.put(`/cinephile/users`, data, {
    headers: { "Content-Type" : "multipart/form-data"}
  }),
  delete: (id: number) => api.delete(`/admin/users/${id}`),
  assignRoles: (id: number, roles: Role[]) => api.post(`/admin/users/${id}/roles`, {roles})
}

export const rolesApi = {
  getAll: () => api.get("/admin/roles"),
}

export const activityApi= {
  getAll: (page: number, size: number) => api.get(`/moderator/activities?page=${page}&size=${size}`),
  getMyActivities: (id: number) => api.get(`/cinephile/activities/${id}`)
}

export const ticketApi= {
  download: (codes: string[]) => api.post(`/cinephile/tickets/download`, {
    codes
  }, {
    responseType: 'blob', // This is crucial for binary data like PDFs
    headers: {
      'Accept': 'application/pdf',
      'Content-Type': 'application/json'
    }
  })
}

export default api

