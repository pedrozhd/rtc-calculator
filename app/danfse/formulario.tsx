"use client";

import { useState } from "react";

export function FormularioDanfse() {
  const [pdf, setPdf] = useState("");
  const [erro, setErro] = useState("");
  const [gerando, setGerando] = useState(false);

  async function gerar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setGerando(true);
    setErro("");
    if (pdf) URL.revokeObjectURL(pdf);
    setPdf("");
    try {
      const params = new URLSearchParams({
        stc: String(dados.get("stc")),
        canhoto: String(dados.has("canhoto")),
      });
      const res = await fetch(`/api/danfse/danfse?${params}`, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: dados.get("xml"),
      });
      if (res.ok) setPdf(URL.createObjectURL(await res.blob()));
      else {
        const corpo = await res.json().catch(() => null);
        setErro(corpo?.mensagem ?? `O serviço respondeu HTTP ${res.status}.`);
      }
    } catch {
      setErro("Não foi possível falar com o gerador de DANFSe.");
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={gerar} className="flex flex-wrap items-end gap-4 text-sm">
        <label className="space-y-1">
          <span className="block text-zinc-600 dark:text-zinc-400">XML da NFS-e (até 5 MB)</span>
          <input name="xml" type="file" accept=".xml,application/xml,text/xml" required className="block" />
        </label>
        <label className="space-y-1">
          <span className="block text-zinc-600 dark:text-zinc-400">Situação da nota</span>
          <select name="stc" className="rounded border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700">
            <option value="0">Válida</option>
            <option value="1">Substituída</option>
            <option value="2">Cancelada</option>
          </select>
        </label>
        <label className="flex items-center gap-2 py-1.5">
          <input name="canhoto" type="checkbox" defaultChecked /> Incluir canhoto
        </label>
        <button
          disabled={gerando}
          className="rounded bg-emerald-700 px-4 py-1.5 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {gerando ? "Gerando…" : "Gerar PDF"}
        </button>
      </form>

      {erro && (
        <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {erro}
        </p>
      )}

      {pdf && (
        <div className="space-y-2">
          <a href={pdf} download="danfse.pdf" className="text-sm text-emerald-700 underline">
            Baixar danfse.pdf
          </a>
          <iframe src={pdf} title="Pré-visualização do DANFSe" className="h-[80vh] w-full rounded border border-zinc-200 dark:border-zinc-800" />
        </div>
      )}
    </div>
  );
}
