const nextConfig = {
  images: {
    unoptimized: true, // Required for static export
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https", // Change to https for production
        hostname: "https://cinecamera-api-c39c6ec4c5e9.herokuapp.com", // Update to your production API domain
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  trailingSlash: true, // Recommended for static exports
};

module.exports = nextConfig;
