import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  Squares2X2Icon,
  XMarkIcon,
  Bars3Icon,
  HomeIcon,
  FilmIcon,
  TvIcon,
  WindowIcon,
} from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DASH_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL + "/showtimes";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NavItem({ children, href, setOpen }: NavItemProps) {
  const router = useRouter();
  return (
    <li>
      <Typography
        {...({} as any)}
        as="a"
        onClick={() => {
          setOpen(false);
          router.push(href!);
        }}
        variant="paragraph"
        className="flex items-center gap-2 font-medium cursor-pointer"
      >
        {children}
      </Typography>
    </li>
  );
}

const NAV_MENU = [
  {
    name: "Home",
    icon: HomeIcon,
    href: "/",
  },
  {
    name: "Movies",
    icon: FilmIcon,
    href: "/movies",
  },
  {
    name: "Showtimes",
    icon: EyeIcon,
    href: "/showtimes",
  },
  {
    name: "Screening Rooms",
    icon: TvIcon,
    href: "/screening_rooms",
  },
  {
    name: "About Us",
    icon: WindowIcon,
    href: "/about",
  },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const router = useRouter();

  const handleOpen = () => setOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  React.useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MTNavbar
      {...({} as any)}
      shadow={false}
      fullWidth
      blurred={false}
      color={isScrolling ? "white" : "transparent"}
      className="fixed top-0 z-50 border-0"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Image
          // color={isScrolling ? "blue-gray" : "white"}
          className="text-lg font-bold cursor-pointer"
          src={"/logos/camera-logo-2.png"}
          width={250}
          height={50}
          alt="Camera Logo"
          onClick={() => router.push("/")}
        ></Image>
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            isScrolling ? "text-gray-900" : "text-white"
          }`}
        >
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem setOpen={setOpen} key={name} href={href}>
              <Icon className="h-5 w-5" />
              <span>{name}</span>
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-4 lg:flex">
          <a href={DASH_URL} target="_blank">
            <Button {...({} as any)} color={isScrolling ? "gray" : "white"}>
              book now!
            </Button>
          </a>
        </div>
        <IconButton
          {...({} as any)}
          variant="text"
          color={isScrolling ? "gray" : "white"}
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-4 rounded-lg bg-white px-6 py-5">
          <ul className="flex flex-col gap-4 text-gray-900">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem setOpen={setOpen} key={name} href={href}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-4">
            <a href={DASH_URL} target="_blank">
              <Button {...({} as any)} color="gray">
                book now!
              </Button>
            </a>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
