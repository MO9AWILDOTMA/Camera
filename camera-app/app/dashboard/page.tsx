import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Reservations</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Interstellar</CardTitle>
                <CardDescription>Tomorrow at 7:00 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>CineTix Downtown • Screen 1</p>
                  <p className="mt-2">Seats: D-5, D-6</p>
                  <div className="mt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span>$25.98</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>The Dark Knight</CardTitle>
                <CardDescription>Saturday at 2:30 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>CineTix Westside • Screen 3</p>
                  <p className="mt-2">Seats: G-10, G-11, G-12</p>
                  <div className="mt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span>$44.97</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ticket Purchase</CardTitle>
                <CardDescription>3 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>You purchased 2 tickets for Inception</p>
                  <p className="mt-2">Total: $29.98</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ticket Cancellation</CardTitle>
                <CardDescription>1 week ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>You cancelled your reservation for The Shawshank Redemption</p>
                  <p className="mt-2">Refund: $14.99</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Dune: Part Two</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>Based on your interest in sci-fi movies</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Oppenheimer</CardTitle>
                <CardDescription>Now Showing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>Based on your interest in Christopher Nolan films</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>The Marvels</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>Based on your interest in action movies</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

