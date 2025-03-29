export default interface Movie {
  id: number;
  name: string;
  slug: string;
  description: string;
  genres: Genre[]
  releaseDate: string;
  duration: number;
  actors: string[];
  picturePaths: string[];
  status: string;
}

export enum Genre {
  ACTION = "ACTION",
  ADVENTURE = "ADVENTURE",
  ANIMATION = "ANIMATION",
  BIOGRAPHY = "BIOGRAPHY",
  COMEDY = "COMEDY",
  CRIME = "CRIME",
  DOCUMENTARY = "DOCUMENTARY",
  DRAMA = "DRAMA",
  FAMILY = "FAMILY",
  FANTASY = "FANTASY",
  HISTORY = "HISTORY",
  HORROR = "HORROR",
  MUSICAL = "MUSICAL",
  MYSTERY = "MYSTERY",
  ROMANCE = "ROMANCE",
  SCIENCE_FICTION = "SCIENCE_FICTION",
  SPORTS = "SPORTS",
  THRILLER = "THRILLER",
  WAR = "WAR",
  WESTERN = "WESTERN",
}
