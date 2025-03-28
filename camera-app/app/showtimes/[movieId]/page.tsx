"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Movie = {
  id: string
  title: string
  posterUrl: string
  releaseDate: string
  duration: number
  genre: string
  director: string
  cast: string[]
  synopsis: string
  trailerUrl: string
}

type Showtime = {
  id: string
  movieId: string
  theaterId: string
  theaterName: string
  screenName: string
  date: string
  startTime: string
  endTime: string
  price: number
}

type GroupedShowtimes = {
  [date: string]: {
    [theaterId: string]: {
      theaterName: string
      showtimes: Showtime[]
    }
  }
}

export default function ShowtimesPage({ params }: { params: { movieId: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtimes>({})
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      try {
        // For demo purposes, we'll use placeholder data
        // In a real app, you would use:
        // const movieResponse = await moviesApi.getById(params.movieId)
        // const showtimesResponse = await showtimesApi.getByMovie(params.movieId)

        const mockMovie: Movie = {
          id: params.movieId,
          title: "Interstellar",
          posterUrl: "/placeholder.svg?height=600&width=400",
          releaseDate: "2023-07-15",
          duration: 165,
          genre: "Sci-Fi",
          director: "Christopher Nolan",
          cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
          synopsis:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        }

        // Generate dates for the next 7 days
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() + i)
          return date.toISOString().split("T")[0]
        })

        // Generate mock showtimes for each date
        const mockShowtimes: Showtime[] = []
        dates.forEach((date) => {
          // Add 3 showtimes per day for theater 1
          ;["10:00", "14:30", "19:00"]
            .forEach((time) => {
              mockShowtimes.push({
                id: `${date}-${time}-1`,
                movieId: params.movieId,
                theaterId: "1",
                theaterName: "CineTix Downtown",
                screenName: "Screen 1",
                date,
                startTime: time,
                endTime: time === "10:00" ? "12:45" : time === "14:30" ? "17:15" : "21:45",
                price: 12.99,
              })
            })

            [
              // Add 2 showtimes per day for theater 2
              ("11:30", "18:00")
            ].forEach((time) => {
              mockShowtimes.push({
                id: `${date}-${time}-2`,
                movieId: params.movieId,
                theaterId: "2",
                theaterName: "CineTix Westside",
                screenName: "Screen 3",
                date,
                startTime: time,
                endTime: time === "11:30" ? "14:15" : "20:45",
                price: 14.99,
              })
            })
        })

        setMovie(mockMovie)
        setShowtimes(mockShowtimes)

        // Set the default selected date to today
        setSelectedDate(dates[0])

        // Group showtimes by date and theater
        const grouped: GroupedShowtimes = {}
        mockShowtimes.forEach((showtime) => {
          if (!grouped[showtime.date]) {
            grouped[showtime.date] = {}
          }

          if (!grouped[showtime.date][showtime.theaterId]) {
            grouped[showtime.date][showtime.theaterId] = {
              theaterName: showtime.theaterName,
              showtimes: [],
            }
          }

          grouped[showtime.date][showtime.theaterId].showtimes.push(showtime)
        })

        setGroupedShowtimes(grouped)
      } catch (error) {
        console.error("Failed to fetch movie and showtimes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieAndShowtimes()
  }, [params.movieId])

  const handleSelectShowtime = (showtimeId: string) => {
    router.push(`/booking/${showtimeId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="h-[400px] w-full max-w-[300px] animate-pulse rounded-lg bg-muted"></div>
          <div className="flex-1 space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted"></div>
            <div className="h-6 w-1/2 animate-pulse rounded-lg bg-muted"></div>
            <div className="h-24 w-full animate-pulse rounded-lg bg-muted"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Movie not found</h1>
        <Link href="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    )
  }

  // Get unique dates from showtimes
  const dates = Object.keys(groupedShowtimes).sort()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-8 md:flex-row">
        <div className="h-[400px] w-full max-w-[300px] overflow-hidden rounded-lg">
          <img src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold">{movie.title}</h1>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {movie.genre}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium">
              <Clock className="h-3 w-3" />
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
          </div>
          <p className="mb-4 text-muted-foreground">
            <strong>Director:</strong> {movie.director}
          </p>
          <p className="mb-4 text-muted-foreground">
            <strong>Cast:</strong> {movie.cast.join(", ")}
          </p>
          <p className="mb-6">{movie.synopsis}</p>
          <div className="flex gap-4">
            <Link href={movie.trailerUrl} target="_blank">
              <Button variant="outline">
                <Film className="mr-2 h-4 w-4" />
                Watch Trailer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-bold">Showtimes</h2>

        <Tabs value={selectedDate} onValueChange={setSelectedDate}>
          <TabsList className="mb-6 flex w-full overflow-x-auto">
            {dates.map((date) => (
              <TabsTrigger key={date} value={date} className="flex-1">
                <div className="flex flex-col items-center">
                  <span className="text-xs">{new Date(date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="text-sm font-medium">{new Date(date).getDate()}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {dates.map((date) => (
            <TabsContent key={date} value={date}>
              <div className="space-y-6">
                {Object.entries(groupedShowtimes[date] || {}).map(([theaterId, theaterData]) => (
                  <Card key={theaterId}>
                    <CardHeader>
                      <CardTitle>{theaterData.theaterName}</CardTitle>
                      <CardDescription>
                        <Calendar className="mr-1 inline-block h-4 w-4" />
                        {formatDate(date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {theaterData.showtimes.map((showtime) => (
                          <Button key={showtime.id} variant="outline" onClick={() => handleSelectShowtime(showtime.id)}>
                            {showtime.startTime}
                            <span className="ml-2 text-xs text-muted-foreground">{showtime.screenName}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

