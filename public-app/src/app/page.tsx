// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./home/hero";
import SponsoredBy from "./home/sponsored-by";
import AboutEvent from "./home/about-event";
import OurStats from "./home/our-stats";
import Testimonials from "./home/testimonials";
import Faq from "./home/faq";

export default function CameraPublic() {
  return (
    <>
      <Hero />
      <SponsoredBy />
      <AboutEvent />
      <OurStats />
      <Testimonials />
      <Faq />
    </>
  );
}
