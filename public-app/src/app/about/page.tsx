import VideoHero from "@/components/video-hero";
import React from "react";

const About = () => {
  return (
    <>
      <VideoHero
        title="About Us"
        videoSrc="/video/video-4.mp4"
        subtitle="At Cinema Caméra, we believe in the power of film to connect, inspire, and transform. Nestled in the historic city of Meknes, our cinema is more than just a theater—it’s a cultural landmark where stories come to life. Join us as we celebrate the art of cinema and create unforgettable experiences for every Cinephile."
      />

      {/* About Us Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 mb-6">
            Cinema Caméra, established in 1938, is one of Morocco’s most iconic
            and historic theaters. Located in the heart of Meknes, our cinema
            has been a cultural hub for film enthusiasts for over eight decades.
            We proudly reopened two years ago, thanks to the unwavering support
            of cinephiles and the local community.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Today, Cinema Caméra is more than just a theater—it’s a celebration
            of cinema. We showcase a diverse range of films, from timeless
            classics to contemporary masterpieces, and host events that bring
            the community together. Our mission is to preserve the magic of
            cinema while embracing modern technology and storytelling.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Join us as we continue to inspire, entertain, and connect through
            the power of film. Whether you’re a lifelong movie lover or a
            first-time visitor, Cinema Caméra welcomes you to be part of our
            story.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
