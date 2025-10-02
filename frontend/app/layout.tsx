import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบปรึกษาทางการแพทย์ AI",
  description: "ระบบผู้ช่วยปรึกษาทางการแพทย์อัจฉริยะแบบออนไลน์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
