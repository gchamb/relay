import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { UserProvider } from "@/hooks/user";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout className={inter.className}>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
