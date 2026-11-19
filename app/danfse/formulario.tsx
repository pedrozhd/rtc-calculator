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
      setErro("Não foi possível falar com o gerador de DANFSe. Tente de novo em alguns segundos.");
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={gerar} className="folha">
        <h2 className="folha-titulo">Nota fiscal de serviço</h2>
        <div className="grade">
          <label className="celula sm:col-span-2">
            <span className="rotulo">Arquivo XML da NFS-e (até 5 MB)</span>
            <input
              name="xml"
              type="file"
              accept=".xml,application/xml,text/xml"
              required
              className="campo mt-1 file:mr-3 file:rounded-sm file:border file:border-tinta file:bg-transparent file:px-3 file:py-1 file:text-sm file:font-medium"
            />
          </label>
          <label className="celula">
            <span className="rotulo">Situação da nota</span>
            <select name="stc" className="campo">
              <option value="0">Válida</option>
              <option value="1">Substituída</option>
              <option value="2">Cancelada</option>
            </select>
          </label>
          <label className="celula">
            <span className="rotulo">Canhoto</span>
            <span className="flex items-center gap-2 text-[0.9375rem]">
              <input name="canhoto" type="checkbox" defaultChecked className="size-4 accent-(--carimbo)" /> Incluir no
              PDF
            </span>
          </label>
        </div>
        <div className="canhoto">
          <button disabled={gerando} className="botao">
            {gerando ? "Gerando…" : "Gerar PDF"}
          </button>
        </div>
      </form>

      {erro && (
        <p role="alert" className="aviso aviso-erro">
          {erro}
        </p>
      )}

      {pdf && (
        <section className="folha">
          <h2 className="folha-titulo">DANFSe gerado</h2>
          <iframe src={pdf} title="Pré-visualização do DANFSe" className="h-[80vh] w-full" />
          <div className="canhoto">
            <a href={pdf} download="danfse.pdf" className="botao">
              Baixar PDF
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
