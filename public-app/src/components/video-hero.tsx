import React from "react";

interface VideoHeroProps {
  videoSrc?: string;
  title?: string;
  subtitle?: string;
}

const VideoHero: React.FC<VideoHeroProps> = ({
  videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  title = "Full Hero Video",
  subtitle = "with TailwindCSS",
}) => {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          className="absolute w-full h-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-70 z-1"></div>
      </div>
      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-20 max-w-4xl mx-auto">
        <h1 className="font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3">
          {title}
        </h1>
        <h3 className="font-light text-xl sm:text-2xl md:text-2xl lg:text-3xl">
          {subtitle}
        </h3>
      </div>
    </section>
  );
};

export default VideoHero;
