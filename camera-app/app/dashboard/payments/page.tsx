"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobalStatus } from "@/models/enums/global.status.enum";
import Payment from "@/models/payment.model";
import { paymentsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";

// Status badge component
const StatusBadge = ({ status }: { status: GlobalStatus }) => {
  const statusColors: any = {
    [GlobalStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
    [GlobalStatus.CONFIRMED]: "bg-green-100 text-green-800",
    [GlobalStatus.CANCELLED]: "bg-red-100 text-red-800",
  };

  return <Badge className={statusColors[status]}>{status}</Badge>;
};

const MyPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch payments data
  useEffect(() => {
    if (!user || !isAuthenticated) {
      router.push("/auth?redirect=/dashboard");
    }

    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint

        const data = (await paymentsApi.getUserPayments(user!.id)).data;
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter and sort payments
  const filteredPayments = payments
    .filter((payment) => {
      // Status filtering
      if (statusFilter !== "ALL" && payment.status !== statusFilter) {
        return false;
      }

      // Search filtering
      const searchLower = searchQuery.toLowerCase();
      const movieTitle = payment.reservation.showtime.movie.name.toLowerCase();
      const userName = payment.user.firstName.toLowerCase();

      return (
        movieTitle.includes(searchLower) ||
        userName.includes(searchLower) ||
        payment.id.toString().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === "date") {
        const dateA = new Date(a.reservation.createdAt).getTime();
        const dateB = new Date(b.reservation.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === "movie") {
        const titleA = a.reservation.showtime.movie.name;
        const titleB = b.reservation.showtime.movie.name;
        return sortOrder === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }
      return 0;
    });

  // Toggle payment details
  const togglePaymentDetails = (paymentId: number) => {
    setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
  };

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading payments...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (payments.length === 0) {
    return <div className="p-8 text-center">No payments found.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Payments</span>
          <span className="text-sm font-normal text-gray-500">
            {filteredPayments.length} payments
          </span>
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by movie, user or ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value={GlobalStatus.IN_PROGRESS}>Pending</SelectItem>
              <SelectItem value={GlobalStatus.CONFIRMED}>Completed</SelectItem>
              <SelectItem value={GlobalStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">ID</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 font-semibold"
                    onClick={() => toggleSort("movie")}
                  >
                    Movie
                    {sortBy === "movie" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 font-semibold"
                    onClick={() => toggleSort("date")}
                  >
                    Date
                    {sortBy === "date" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 font-semibold"
                    onClick={() => toggleSort("amount")}
                  >
                    Amount
                    {sortBy === "amount" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <React.Fragment key={payment.id}>
                  <TableRow>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      {payment.reservation.showtime.movie.name}
                    </TableCell>
                    <TableCell>
                      {formatDate(payment.reservation.createdAt)}
                    </TableCell>
                    <TableCell>{payment.user.firstName}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePaymentDetails(payment.id)}
                      >
                        {expandedPayment === payment.id ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details Row */}
                  {expandedPayment === payment.id && (
                    <TableRow className="bg-slate-50">
                      <TableCell colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Showtime Details
                            </h4>
                            <p>
                              <span className="font-medium">Movie:</span>{" "}
                              {payment.reservation.showtime.movie.name}
                            </p>
                            <p>
                              <span className="font-medium">Date/Time:</span>{" "}
                              {formatDate(
                                payment.reservation.showtime.dateTime
                              )}
                            </p>
                            <p>
                              <span className="font-medium">Room:</span>{" "}
                              {payment.reservation.showtime.screeningRoom.name}
                            </p>
                            <p>
                              <span className="font-medium">Version:</span>{" "}
                              {payment.reservation.showtime.showVersion}
                            </p>
                            {payment.reservation.showtime.isSpecialEvent && (
                              <Badge className="mt-1">Special Event</Badge>
                            )}
                            {payment.reservation.showtime.isPreview && (
                              <Badge className="mt-1 ml-2">Preview</Badge>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              Reservation Details
                            </h4>
                            <p>
                              <span className="font-medium">
                                Reservation ID:
                              </span>{" "}
                              {payment.reservation.id}
                            </p>
                            <p>
                              <span className="font-medium">Seats:</span>{" "}
                              {payment.reservation.seats.join(", ")}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              <StatusBadge
                                status={payment.reservation.status}
                              />
                            </p>
                            <div className="mt-2">
                              <h5 className="font-medium">Tickets:</h5>
                              <ul className="list-disc pl-5">
                                {payment.reservation.tickets.map(
                                  (ticket, idx) => (
                                    <li key={idx}>
                                      {ticket.uniqueCode}: {ticket.type}
                                    </li>
                                  )
                                )}
                                {payment.amount.toFixed(2)}MAD
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyPayments;
