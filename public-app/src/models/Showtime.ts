import { Movie } from "./Movie";

export default interface Showtime {
    "id": number;
    "createdAt": string;
    "updatedAt": string,
    "slug": string,
    "dateTime": string,
    "price": number;
    "movie": Movie;
    "discounts": object;
    "showVersion": string;
    "totalSeats": number;
    "reservedSeats": number;
    "specialEvent": boolean;
    "preview": boolean;
}