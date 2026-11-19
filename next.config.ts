import type { NextConfig } from "next";

// O navegador só fala com /api/<servico>/...; o Next repassa ao backend oficial.
// Serviço sem URL configurada não ganha rota (a página avisa).
const backends = {
  "regime-regular":
    process.env.REGIME_REGULAR_API_URL ??
    "https://piloto-cbs.tributos.gov.br/servico/calculadora-consumo/api",
  "simples-nacional": process.env.SIMPLES_NACIONAL_API_URL,
  danfse: process.env.DANFSE_API_URL,
};

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return Object.entries(backends)
      .filter(([, url]) => url)
      .map(([servico, url]) => ({
        source: `/api/${servico}/:path*`,
        destination: `${url!.replace(/\/$/, "")}/:path*`,
      }));
  },
};

export default nextConfig;
