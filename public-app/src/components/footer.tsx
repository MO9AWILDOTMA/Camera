import { Typography, Button, IconButton } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CURRENT_YEAR = new Date().getFullYear();
const LINKS = ["Movies", "Showtimes", "Screening Rooms", "About"];

export function Footer() {
  const router = useRouter();
  function handleNavigation(link: string) {
    router.push("/" + link.toLowerCase().replace(" ", "-"));
  }
  return (
    <footer className="pb-5 p-10 md:pt-10">
      <div className="container flex flex-col mx-auto">
        <div className="flex flex-col md:flex-row items-center !justify-between">
          <Image
            // color={isScrolling ? "blue-gray" : "white"}
            className="text-lg font-bold cursor-pointer"
            src={"/logos/camera-logo-2.png"}
            width={250}
            height={50}
            alt="Camera Logo"
            onClick={() => router.push("/")}
          ></Image>
          <ul className="flex justify-center flex-wrap my-4 md:my-0 w-max items-center gap-4">
            {LINKS.map((link, index) => (
              <li key={index}>
                <Typography
                  {...({} as any)}
                  as="a"
                  onClick={() => handleNavigation(link)}
                  variant="small"
                  color="white"
                  className="font-normal !text-gray-700 hover:!text-gray-900 transition-colors cursor-pointer"
                >
                  {link}
                </Typography>
              </li>
            ))}
          </ul>
          <div className="flex w-fit justify-center gap-2">
            <IconButton {...({} as any)} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-twitter text-lg" />
            </IconButton>
            <IconButton {...({} as any)} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-youtube text-lg" />
            </IconButton>
            <IconButton {...({} as any)} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-instagram text-lg" />
            </IconButton>
            <IconButton {...({} as any)} size="sm" color="gray" variant="text">
              <i className="fa-brands fa-github text-lg" />
            </IconButton>
          </div>
        </div>
        <Typography
          {...({} as any)}
          color="blue-gray"
          className="text-center mt-12 font-normal !text-gray-700"
        >
          &copy; {CURRENT_YEAR} Cinema Camera. Made with ❤️ by{" "}
          <a href="https://www.service.mo9awil.ma" target="_blank">
            Mo9awil Services
          </a>
          .
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
