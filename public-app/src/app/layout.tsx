import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Layout } from "@/components/layout";
import { FixedPlugin } from "@/components/fixed-plugin";
import { Footer, Navbar } from "@/components";
import { Suspense } from "react";
import Loading from "@/components/loading";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cinema Camera",
  description:
    "Introducing Tailwind Event Landing Page, a dynamic and visually appealing landing page template designed using Tailwind CSS and Material Tailwind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-site="YOUR_DOMAIN_HERE"
          src="https://api.nepcha.com/js/nepcha-analytics.js"
        ></script>
        <link rel="shortcut icon" href="/favicon.ico" type="image/png" />
      </head>
      <body className={roboto.className}>
        <Layout>
          <Navbar />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <FixedPlugin />
          <Footer />
        </Layout>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </body>
    </html>
  );
}
