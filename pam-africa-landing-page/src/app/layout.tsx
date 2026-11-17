import "./globals.css";
import localFont from "next/font/local";
import NextThemeProvider from "@/context/NextThemeProvider";
import Contact from "@/components/home/Contact";
import Script from "next/script";
import { preloader } from "@/constants/preloader";

const helveticaNow = localFont({
  variable: "--font-helvetica-now",
  src: [
    {
      path: "../../public/fonts/HelveticaNowDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNowDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNowDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/HelveticaNowDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    // Optional italics
    {
      path: "../../public/fonts/HelveticaNowDisplay-RegIta.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://pam-africa-landing-page.vercel.app"),
  title: "PAM Africa - Powering Africa's Energy Future",
  description:
    "Leading energy solutions across Africa. Empowering communities with sustainable, innovative energy technologies and infrastructure.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/android-icon-36x36.png",
        sizes: "36x36",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-70x70.png",
        sizes: "70x70",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-150x150.png",
        sizes: "150x150",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-310x310.png",
        sizes: "310x310",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {preloader.map((url, index) => (
          <link
            key={url}
            rel="preload"
            as="image"
            href={url}
            fetchPriority={index < 3 ? "high" : "auto"}
          />
        ))}
        <Script id="precache-preloader" strategy="beforeInteractive">
          {`
            (function(){
              const urls = ${JSON.stringify(preloader)};
              for (let i = 0; i < urls.length; i++) {
                const img = new Image();
                img.decoding = 'async';
                try { img.fetchPriority = i < 3 ? 'high' : 'auto'; } catch(e){}
                img.src = urls[i];
              }
            })();
          `}
        </Script>
      </head>
      <body className={`${helveticaNow.variable} antialiased`}>
        <NextThemeProvider>{children}</NextThemeProvider>
        <Contact />
      </body>
    </html>
  );
}
