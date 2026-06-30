import type { Metadata } from "next";
import { Inter } from "next/font/google"; // استخدمنا خط من جوجل بدل الملفات المحلية
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; 

// تهيئة الخط
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DARES-AI",
  description: "Personalized AI Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* استخدمنا الخط هنا */}
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}