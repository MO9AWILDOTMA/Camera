import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SHOW_SCREENINGROOM = BASE_URL + "/user/screeningRooms";


export const fetchScreeningRoomDetails = async (slug: string)=> {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(`${SHOW_SCREENINGROOM}/${slug}`);
        return response;
    } catch (error) {
        console.error('Error fetching screeningroom:', error);
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


export const fetchScreeningRooms = async (size:number = 3, page: number = 1) => {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(SHOW_SCREENINGROOM, {
            params: {
                page,
                size
            }});
        return response;
    } catch (error) {
        console.error('Error fetching screeningrooms:', error);
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