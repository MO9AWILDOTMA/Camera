import { CtaType, HeroMovie, Movie, MovieStatus} from './../models/Movie';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const movieMapper = (movies: Partial<Movie[]>): HeroMovie[] => {
    let heroMovies: HeroMovie[] = []; 
    movies.forEach(m => {
        if(m) {
            const pictures = m.picturePaths;
            const image = pictures && pictures.length > 0 ? BASE_URL + pictures[0] : "/logos/camera-logo.jpg";

            let heroMovie: HeroMovie = {
                id: m.id,
                title: m.name,
                slug: m.slug,
                description: m.description,
                status: m.status,
                image,
                cta: getCta(m.status)
            };
    
            heroMovies.push(heroMovie);
        }
    })
    console.log(heroMovies);
    
    return heroMovies;
}


function getCta(status: MovieStatus): CtaType {
    if(status === MovieStatus.EXCLUSIVE_PREMIERE)
        return "Pre-book"
    else if(status === MovieStatus.NOW_SHOWING)
         return "Book Tickets"
    else return "Learn More"
}