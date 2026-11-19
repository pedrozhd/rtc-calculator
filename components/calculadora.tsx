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

const entrada =
  "w-full rounded border border-zinc-300 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700";

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
    className: entrada,
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
      setErro("Não foi possível falar com o serviço de cálculo.");
    } finally {
      setCalculando(false);
    }
  }

  const objetos = (ler(resultado, "objetos") as Objeto[] | undefined) ?? [];

  return (
    <div className="space-y-6">
      <form onSubmit={calcular} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {campos.map((c) => (
            <label key={c.nome} className="space-y-1 text-sm">
              <span className="block text-zinc-600 dark:text-zinc-400">{c.rotulo}</span>
              <Entrada campo={c} valor={op[c.nome] ?? ""} onChange={(v) => setOp({ ...op, [c.nome]: v })} />
            </label>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-zinc-600 dark:text-zinc-400">
                <th className="pr-2 font-normal">#</th>
                {camposItem.map((c) => (
                  <th key={c.nome} className="pr-2 pb-1 font-normal">
                    {c.rotulo}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {itens.map((it, i) => (
                <tr key={i}>
                  <td className="pr-2">{i + 1}</td>
                  {camposItem.map((c) => (
                    <td key={c.nome} className="pr-2 pb-1">
                      <Entrada
                        campo={c}
                        valor={it[c.nome] ?? ""}
                        rotuloOculto={`${c.rotulo} do item ${i + 1}`}
                        onChange={(v) => setItens(itens.map((x, j) => (j === i ? { ...x, [c.nome]: v } : x)))}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      aria-label={`Remover item ${i + 1}`}
                      disabled={itens.length === 1}
                      onClick={() => setItens(itens.filter((_, j) => j !== i))}
                      className="px-2 text-zinc-500 hover:text-red-600 disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setItens([...itens, itemInicial])}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
          >
            Adicionar item
          </button>
          <button
            disabled={calculando}
            className="rounded bg-emerald-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {calculando ? "Calculando…" : "Calcular"}
          </button>
        </div>
      </form>

      {erro && (
        <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {erro}
        </p>
      )}

      {resultado != null && (
        <section aria-live="polite" className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-zinc-300 text-left dark:border-zinc-700">
                  <th className="py-1 pr-3">#</th>
                  <th className="pr-3">Situação</th>
                  {colunas.map(([r]) => (
                    <th key={r} className="pr-3 text-right">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {objetos.map((o, i) => (
                  <tr key={i} className="border-b border-zinc-200 align-top dark:border-zinc-800">
                    <td className="py-1 pr-3">{o.nObj}</td>
                    <td className="pr-3">
                      {o.estadoItem}
                      {o.erros?.map((er, j) => (
                        <p key={j} className="text-red-700 dark:text-red-300">
                          {er.code}: {er.detail ?? er.title}
                        </p>
                      ))}
                    </td>
                    {colunas.map(([r, c]) => (
                      <td key={r} className="pr-3 text-right tabular-nums">
                        {String(ler(o, c) ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {totais.map(([r, c]) => (
              <div key={r} className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
                <dt className="text-xs text-zinc-600 dark:text-zinc-400">{r}</dt>
                <dd className="text-lg font-semibold tabular-nums">{String(ler(resultado, c) ?? "—")}</dd>
              </div>
            ))}
          </dl>

          <details className="text-sm">
            <summary className="cursor-pointer text-zinc-600 dark:text-zinc-400">Resposta completa (JSON)</summary>
            <pre className="mt-2 overflow-x-auto rounded bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </details>
        </section>
      )}
    </div>
  );
}
