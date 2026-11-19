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
  const base = Object.hasOwn(backends, servico) ? backends[servico] : undefined;
  if (!base) return Response.json({ detail: "Serviço não configurado." }, { status: 404 });
  // Segmentos "." e ".." fariam o fetch sair do prefixo do backend no mesmo host.
  if (caminho.some((s) => s === "." || s === ".."))
    return Response.json({ detail: "Caminho inválido." }, { status: 400 });

  const destino = `${base.replace(/\/$/, "")}/${caminho.map(encodeURIComponent).join("/")}${new URL(req.url).search}`;
  const tipo = req.headers.get("content-type");
  try {
    const body = req.method === "GET" ? undefined : await req.arrayBuffer();
    const headers: Record<string, string> = tipo ? { "Content-Type": tipo } : {};
    let res: Response;
    // O WAF às vezes responde 307 entregando cookies de sessão e espera a mesma chamada
    // de novo com eles. Repete no mesmo destino (nunca no Location recebido).
    for (let tentativa = 0; ; tentativa++) {
      res = await fetch(destino, { method: req.method, headers, body, redirect: "manual", cache: "no-store" });
      if (res.status < 300 || res.status >= 400 || tentativa === 2) break;
      headers.Cookie = res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    }
    return new Response(res.body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/octet-stream" },
    });
  } catch {
    return Response.json({ detail: "O backend não respondeu. Tente de novo em alguns segundos." }, { status: 502 });
  }
}

export { repassar as GET, repassar as POST };
