import { Inter } from "next/font/google";
import ReduxProvider from "@/components/provider/ReduxProvider";
import "./globals.css";
import { FetchLoading } from "@/components/generals/LoadingBox";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProviderWarp from "@/components/provider/ThemeProvider";
import Localization from "@/components/provider/LocalizationProvider";

const inter = Inter({ subsets: ["latin"] });
// const viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
// };
export const metadata = {
  title: "NaS",
  description: "Make it simple",
  icons: {
    icon: "/NA_logo.jpg",
  },
};
function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={inter.className}>
        <ThemeProviderWarp>
          <Localization>
            <ReduxProvider>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
              />
              <FetchLoading />
              {children}
            </ReduxProvider>
          </Localization>
        </ThemeProviderWarp>
      </body>
    </html>
  );
}

export default RootLayout;
