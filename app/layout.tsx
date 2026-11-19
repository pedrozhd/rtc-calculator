import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculadora RTC",
  description:
    "CBS, IBS e Imposto Seletivo da Reforma Tributária do Consumo: regime regular, Simples Nacional e DANFSe.",
};

const links = [
  ["/regime-regular", "Regime regular"],
  ["/simples-nacional", "Simples Nacional"],
  ["/danfse", "DANFSe"],
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 text-sm">
            <Link href="/" className="font-semibold">
              Calculadora RTC
            </Link>
            {links.map(([href, rotulo]) => (
              <Link key={href} href={href} className="text-zinc-600 hover:text-emerald-700 dark:text-zinc-400">
                {rotulo}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8">{children}</main>
        <footer className="mx-auto w-full max-w-5xl px-4 py-6 text-xs text-zinc-500">
          Cálculos feitos pelos serviços de código aberto da Receita Federal. Ferramenta de simulação, sem valor fiscal.
        </footer>
      </body>
    </html>
  );
}
