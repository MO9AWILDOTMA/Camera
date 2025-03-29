import {
    Film,
    Home,
    Settings,
    Theater,
    Timer,
    User,
  } from "lucide-react";

export const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/movies", label: "Movies", icon: Film },
    { href: "/admin/showtimes", label: "Showtimes", icon: Timer },
    { href: "/admin/theaters", label: "Theaters", icon: Theater },
    { href: "/admin/users", label: "Users", icon: User },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];