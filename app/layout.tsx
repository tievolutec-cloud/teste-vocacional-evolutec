import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teste Vocacional | Evolutec Educação",
  description: "Descubra em poucos minutos os cursos e caminhos profissionais que mais combinam com o seu perfil.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}<Analytics /></body>
    </html>
  );
}
