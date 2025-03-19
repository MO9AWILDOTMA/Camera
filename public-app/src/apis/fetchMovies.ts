import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const UPCOMING_MOVIES = BASE_URL  + "/user/movies/upcoming";
const SHOW_MOVIE = BASE_URL + "/user/movies";
const SEARCH_MOVIES = BASE_URL + "/user/movies/search/";

export const fetchUpcomingMovies = async () => {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(UPCOMING_MOVIES);
        return response;
    } catch (error) {
        console.error('Error fetching movies:', error);
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

export const searchForMovies = async (query:string, genre: string, size:number = 3, page: number = 1) => {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(SEARCH_MOVIES + query, {
            params: {
                genre,
                page,
                size
            }
        });
        return response;
    } catch (error) {
        console.error('Error search for movies:', error);
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


export const fetchMovieDetails = async (slug: string)=> {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(`${SHOW_MOVIE}/${slug}`);
        return response;
    } catch (error) {
        console.error('Error fetching movie:', error);
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


export const fetchMovies = async () => {
    try {
        if (!BASE_URL) {
            throw new Error('API Base URL is not configured. Please check your environment variables.');
        }
        const response = await axios(SHOW_MOVIE);
        return response;
    } catch (error) {
        console.error('Error fetching movies:', error);
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