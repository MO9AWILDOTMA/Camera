import {
  CircleDollarSign,
  CircleUser,
  Film,
  Home,
  Percent,
  Theater,
  TicketCheck,
  Timer,
  Users,
} from "lucide-react";

export const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/movies", label: "Movies", icon: Film },
  { href: "/admin/showtimes", label: "Showtimes", icon: Timer },
  { href: "/admin/screens", label: "Screen Rooms", icon: Theater },
  { href: "/admin/reservations", label: "Reservations", icon: TicketCheck },
  { href: "/admin/payments", label: "Payments", icon: CircleDollarSign },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/profile", label: "Profile", icon: CircleUser },
];
