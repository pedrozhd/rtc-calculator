# Calculadora RTC

Interface única em Next.js para os três serviços de código aberto da Receita Federal sobre a Reforma Tributária do Consumo (LC 214/2025):

| Página | Serviço oficial | De onde vem o cálculo |
|---|---|---|
| `/regime-regular` | [calculadora-rtc-regime-regular](https://github.com/ReceitaFederal/calculadora-rtc-regime-regular) | API pública da Receita (já funciona sem configurar nada) |
| `/simples-nacional` | [calculadora-rtc-simples-nacional](https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional) | Container próprio (`SIMPLES_NACIONAL_API_URL`) |
| `/danfse` | [calculadora-rtc-gerador-danfse](https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse) | Container próprio (`DANFSE_API_URL`) |

O app não reimplementa regra tributária: o navegador chama `/api/<servico>/...` e o Next repassa ao backend oficial (rewrites em `next.config.ts`). Nada é armazenado.

## Rodar localmente

```bash
docker compose -f backends/docker-compose.yml up --build   # Simples Nacional (8082) e DANFSe (8081)
cp .env.example .env.local
npm install
npm run dev
```

O primeiro build dos backends demora alguns minutos (compila o Java e gera o banco SQLite com as tabelas tributárias). Sem os containers, só o regime regular funciona.

## Publicar

1. **Backends**: a Vercel não executa Java nem o serviço em Go, então publique as duas imagens em um provedor de containers (Render, Fly.io, Railway...). O Simples Nacional usa `backends/simples-nacional/Dockerfile`; o DANFSe usa o `Dockerfile` do próprio repositório oficial. Ambos aceitam `SERVER_PORT` para trocar a porta.
2. **Vercel**: importe este repositório e defina `SIMPLES_NACIONAL_API_URL` e `DANFSE_API_URL` com as URLs públicas dos backends, terminadas em `/api` e sem barra no final. As URLs são lidas no build: ao alterá-las, publique de novo.

## Verificação

```bash
npm test        # utilitário de caminhos
npm run lint
npm run build
```
