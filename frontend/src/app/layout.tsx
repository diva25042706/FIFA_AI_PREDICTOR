import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import QueryProvider from "@/lib/query-provider";

export const metadata: Metadata = {
  title: "FIFA World Cup AI Platform",
  description: "Next-generation World Cup predictions using Machine Learning and Explainable AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background flex text-foreground">
        <QueryProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-auto p-6 md:p-8">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
