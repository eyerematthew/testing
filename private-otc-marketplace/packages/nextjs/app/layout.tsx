import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Private OTC Marketplace",
  description: "Fully encrypted over-the-counter trading platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
