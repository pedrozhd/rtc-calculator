// Repassa /api/<servico>/... ao backend oficial a partir do servidor.
// Só Content-Type segue adiante: a API pública da Receita fica atrás de um WAF que
// devolve um desafio em HTML quando recebe cabeçalhos de navegador (User-Agent, Cookie, Origin).
const backends: Record<string, string | undefined> = {
  "regime-regular":
    process.env.REGIME_REGULAR_API_URL || "https://piloto-cbs.tributos.gov.br/servico/calculadora-consumo/api",
  "simples-nacional": process.env.SIMPLES_NACIONAL_API_URL,
  danfse: process.env.DANFSE_API_URL,
};

async function repassar(req: Request, ctx: RouteContext<"/api/[servico]/[...caminho]">) {
  const { servico, caminho } = await ctx.params;
  const base = backends[servico];
  if (!base) return Response.json({ detail: "Serviço não configurado." }, { status: 404 });

  const destino = `${base.replace(/\/$/, "")}/${caminho.map(encodeURIComponent).join("/")}${new URL(req.url).search}`;
  const tipo = req.headers.get("content-type");
  try {
    const res = await fetch(destino, {
      method: req.method,
      headers: tipo ? { "Content-Type": tipo } : undefined,
      body: req.method === "GET" ? undefined : await req.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
    });
    return new Response(res.body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/octet-stream" },
    });
  } catch {
    return Response.json({ detail: "O backend não respondeu. Tente de novo em alguns segundos." }, { status: 502 });
  }
}

export { repassar as GET, repassar as POST };
