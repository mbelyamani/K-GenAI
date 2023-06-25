import "styles/main.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";

import { AppProps } from "next/app";
import { AuthContextProvider } from "context/AuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
