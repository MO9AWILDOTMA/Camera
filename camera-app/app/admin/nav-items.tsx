import {
  CircleDollarSign,
  Film,
  Home,
  Percent,
  Settings,
  Theater,
  TicketCheck,
  Timer,
  User,
} from "lucide-react";

export const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/movies", label: "Movies", icon: Film },
  { href: "/admin/showtimes", label: "Showtimes", icon: Timer },
  { href: "/admin/screens", label: "Screen Rooms", icon: Theater },
  { href: "/admin/reservations", label: "Reservations", icon: TicketCheck },
  { href: "/admin/payments", label: "Payments", icon: CircleDollarSign },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/users", label: "Users", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
