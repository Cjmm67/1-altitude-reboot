import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "1-Altitude Reboot — Multi-Agent Strategic Ideation",
  description:
    "Twelve agents. Three waves. One returned icon. A strategic ideation tool for re-imagining 1-Altitude's return to One Raffles Place.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-midnight-950 text-platinum-200 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
