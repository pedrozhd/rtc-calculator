"use client";

import { useState } from "react";
import { gravar, ler } from "@/lib/caminho";

export type Campo = {
  nome: string; // caminho no JSON de entrada, ex.: "aliquotasNominais.cbs"
  rotulo: string;
  tipo?: string;
  sufixo?: string; // anexado ao valor enviado, ex.: hora e fuso de uma data
  opcoes?: [valor: string, rotulo: string][];
};

type Valores = Record<string, string>;
type Coluna = [rotulo: string, caminho: string];
type Erro = { code?: string; title?: string; detail?: string };
type Objeto = { nObj?: number; estadoItem?: string; erros?: Erro[] };

// Situação devolvida pelo serviço -> texto e cor do selo.
const estados: Record<string, [string, string]> = {
  CALCULADO: ["Calculado", "text-carimbo"],
  CALCULO_SIMULADO: ["Simulado", "text-ouro"],
  NAO_CALCULADO: ["Não calculado", "text-suave"],
  NAO_IMPLEMENTADO: ["Não implementado", "text-suave"],
  INCONSISTENCIA_ENTRADA: ["Entrada inconsistente", "text-erro"],
  FALHA_TECNICA: ["Falha técnica", "text-erro"],
};

// O serviço devolve decimais como "1200.00"; exibe no formato brasileiro.
function formatar(v: unknown) {
  if (v == null) return "—";
  const s = String(v);
  return /^-?\d+\.\d+$/.test(s)
    ? Number(s).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : s;
}

function montar(campos: Campo[], valores: Valores) {
  const o: Record<string, unknown> = {};
  for (const c of campos) {
    const v = valores[c.nome]?.trim();
    if (v) gravar(o, c.nome, v + (c.sufixo ?? ""));
  }
  return o;
}

function Entrada({
  campo,
  valor,
  onChange,
  rotuloOculto,
}: {
  campo: Campo;
  valor: string;
  onChange: (v: string) => void;
  rotuloOculto?: string;
}) {
  const comum = {
    className: "campo",
    value: valor,
    "aria-label": rotuloOculto,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };
  return campo.opcoes ? (
    <select {...comum}>
      {campo.opcoes.map(([v, r]) => (
        <option key={v} value={v}>
          {r}
        </option>
      ))}
    </select>
  ) : (
    <input type={campo.tipo ?? "text"} {...comum} />
  );
}

export function Calculadora({
  endpoint,
  fixos,
  campos,
  camposItem,
  inicial,
  itemInicial,
  colunas,
  totais,
}: {
  endpoint: string;
  fixos?: Record<string, string>;
  campos: Campo[];
  camposItem: Campo[];
  inicial: Valores;
  itemInicial: Valores;
  colunas: Coluna[];
  totais: Coluna[];
}) {
  const [op, setOp] = useState(inicial);
  const [itens, setItens] = useState([itemInicial]);
  const [resultado, setResultado] = useState<unknown>(null);
  const [erro, setErro] = useState("");
  const [calculando, setCalculando] = useState(false);

  async function calcular(e: React.FormEvent) {
    e.preventDefault();
    setCalculando(true);
    setErro("");
    setResultado(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          ...fixos,
          ...montar(campos, op),
          itens: itens.map((it, i) => ({ numero: i + 1, ...montar(camposItem, it) })),
        }),
      });
      const corpo = await res.json().catch(() => null);
      if (res.ok) setResultado(corpo);
      else {
        // Erros de validação da operação inteira vêm em `errors`, além do resumo em `detail`.
        const detalhes = ((corpo?.errors as Erro[] | undefined) ?? []).map((er) => er.detail ?? er.title);
        setErro(
          [corpo?.detail ?? corpo?.title ?? `O serviço respondeu HTTP ${res.status}.`, ...detalhes].join(" "),
        );
      }
    } catch {
      setErro("Não foi possível falar com o serviço de cálculo. Tente de novo em alguns segundos.");
    } finally {
      setCalculando(false);
    }
  }

  const objetos = (ler(resultado, "objetos") as Objeto[] | undefined) ?? [];

  return (
    <div className="space-y-8">
      <form onSubmit={calcular} className="folha">
        <h2 className="folha-titulo">Dados da operação</h2>
        <div className="grade">
          {campos.map((c) => (
            <label key={c.nome} className="celula">
              <span className="rotulo">{c.rotulo}</span>
              <Entrada campo={c} valor={op[c.nome] ?? ""} onChange={(v) => setOp({ ...op, [c.nome]: v })} />
            </label>
          ))}
        </div>

        <h2 className="folha-titulo">Itens</h2>
        <div className="overflow-x-auto">
          <table className="itens min-w-[720px]">
            <thead>
              <tr>
                <th>Nº</th>
                {camposItem.map((c) => (
                  <th key={c.nome}>{c.rotulo}</th>
                ))}
                <th>
                  <span className="sr-only">Remover</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {itens.map((it, i) => (
                <tr key={i}>
                  <td className="num text-suave">{i + 1}</td>
                  {camposItem.map((c) => (
                    <td key={c.nome}>
                      <Entrada
                        campo={c}
                        valor={it[c.nome] ?? ""}
                        rotuloOculto={`${c.rotulo} do item ${i + 1}`}
                        onChange={(v) => setItens(itens.map((x, j) => (j === i ? { ...x, [c.nome]: v } : x)))}
                      />
                    </td>
                  ))}
                  <td className="w-10 text-center">
                    <button
                      type="button"
                      aria-label={`Remover item ${i + 1}`}
                      disabled={itens.length === 1}
                      onClick={() => setItens(itens.filter((_, j) => j !== i))}
                      className="text-suave hover:text-erro disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="canhoto">
          <button disabled={calculando} className="botao">
            {calculando ? "Calculando…" : "Calcular tributos"}
          </button>
          <button type="button" onClick={() => setItens([...itens, itemInicial])} className="botao-leve">
            Adicionar item
          </button>
        </div>
      </form>

      {erro && (
        <p role="alert" className="aviso aviso-erro">
          {erro}
        </p>
      )}

      {resultado != null && (
        <section aria-live="polite" className="folha">
          <h2 className="folha-titulo">Resultado do cálculo</h2>
          <div className="overflow-x-auto">
            <table className="itens min-w-[640px]">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Situação</th>
                  {colunas.map(([r]) => (
                    <th key={r} className="num">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {objetos.map((o, i) => {
                  const [texto, cor] = estados[o.estadoItem ?? ""] ?? [o.estadoItem ?? "—", "text-suave"];
                  return (
                    <tr key={i}>
                      <td className="num text-suave">{o.nObj}</td>
                      <td>
                        <span className={`selo ${cor}`}>{texto}</span>
                        {o.erros?.map((er, j) => (
                          <p key={j} className="mt-1 max-w-prose text-erro">
                            {er.code}: {er.detail ?? er.title}
                          </p>
                        ))}
                      </td>
                      {colunas.map(([r, c]) => (
                        <td key={r} className="num">
                          {formatar(ler(o, c))}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <dl className="grade bg-faixa">
            {totais.map(([r, c]) => (
              <div key={r} className="celula py-3">
                <dt className="rotulo">{r}</dt>
                <dd className="text-2xl font-bold tabular-nums [font-stretch:112%]">{formatar(ler(resultado, c))}</dd>
              </div>
            ))}
          </dl>

          <details className="px-3 py-2 text-sm">
            <summary className="cursor-pointer text-suave">Resposta completa do serviço (JSON)</summary>
            <pre className="mt-2 mb-1 overflow-x-auto bg-faixa p-3 text-xs">{JSON.stringify(resultado, null, 2)}</pre>
          </details>
        </section>
      )}
    </div>
  );
}
