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
  getFeatured: () => api.get("/user/movies/featured"),
  getCurrentlyShowing: () => api.get("/user/movies/current"),
  getUpcoming: () => api.get("/user/movies/upcoming?size=4"),
  getById: (id: number) => api.get(`/user/movies/${id}`),
  search: (query: string) => api.get(`/user/movies/search/${query}`),
  // Admin endpoints
  create: (data: any) => api.post("/admin/movies", data),
  update: (id: number, data: any) => api.put(`/admin/movies/${id}`, data),
  delete: (id: number) => api.delete(`/admin/movies/${id}`),
}

// Screening Rooms API
export const theatersApi = {
  getAll: () => api.get("/user/screeningRooms"),
  getById: (id: number) => api.get(`/user/screeningRooms/${id}`),
  // Admin endpoints
  create: (data: any) => api.post("/admin/screeningRooms", data),
  update: (id: number, data: any) => api.put(`/admin/screeningRooms/${id}`, data),
  delete: (id: number) => api.delete(`/admin/screeningRooms/${id}`),
}

// Showtimes API
export const showtimesApi = {
  getByMovie: (movieId: number) => api.get(`/user/showtimes/movie/${movieId}`),
  getByTheater: (theaterId: number) => api.get(`/user/showtimes/theater/${theaterId}`),
  getById: (id: number) => api.get(`/user/showtimes/${id}`),
  // Admin endpoints
  create: (data: any) => api.post("/admin/showtimes", data),
  update: (id: number, data: any) => api.put(`/admin/showtimes/${id}`, data),
  delete: (id: number) => api.delete(`/admin/showtimes/${id}`),
}

// Bookings API
export const bookingsApi = {
  create: (data: any) => api.post("/cinephile/bookings", data),
  getUserBookings: () => api.get("/user/bookings/user"),
  getById: (id: number) => api.get(`/user/bookings/${id}`),
  cancel: (id: number) => api.post(`/bookings/${id}/cancel`),
}

// Seats API
export const seatsApi = {
  getByShowtime: (showtimeId: number) => api.get(`/seats/showtime/${showtimeId}`),
}

// Admin Analytics API
export const analyticsApi = {
  getSales: (period: string) => api.get(`/admin/analytics/sales?period=${period}`),
  getRevenue: (period: string) => api.get(`/admin/analytics/revenue?period=${period}`),
  getOccupancy: (period: string) => api.get(`/admin/analytics/occupancy?period=${period}`),
}

export default api

