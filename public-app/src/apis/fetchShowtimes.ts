import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SHOWTIMES = BASE_URL  + "/user/showtimes";

export const fetchShowtimes = async () => {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(SHOWTIMES, {
            params: {
                size: 5
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching showtimes:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 500) {
                console.error('Server error:', error.response.data);
            }
            if (!error.response) {
                console.error('Network error - please check if the API server is running');
            }
        }
        throw error;
    }
}


export const fetchShowtimeDetails = async (slug: string)=> {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(`${SHOWTIMES}/${slug}`);
        return response;
    } catch (error) {
        console.error('Error fetching showtime:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 500) {
                console.error('Server error:', error.response.data);
            }
            if (!error.response) {
                console.error('Network error - please check if the API server is running');
            }
        }
        throw error;
    }
}
