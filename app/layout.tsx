import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
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
    <html lang="pt-BR" className={`${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="bg-barra text-barra-texto">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-stretch gap-x-1 px-4">
            <Link href="/" className="mr-6 py-3.5 text-lg font-bold [font-stretch:118%]">
              Calculadora RTC
            </Link>
            {links.map(([href, rotulo]) => (
              <Link
                key={href}
                href={href}
                className="flex items-center border-b-[3px] border-transparent px-3 py-3.5 text-sm font-medium opacity-80 hover:border-carimbo hover:opacity-100"
              >
                {rotulo}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-10">{children}</main>
        <footer className="border-t border-linha">
          <p className="mx-auto max-w-5xl px-4 py-5 text-xs text-suave">
            Cálculos feitos pelos serviços de código aberto da Receita Federal (LC 214/2025). Simulação, sem valor
            fiscal.
          </p>
        </footer>
      </body>
    </html>
  );
}
