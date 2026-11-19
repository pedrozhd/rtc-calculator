import Link from "next/link";

const servicos = [
  {
    href: "/regime-regular",
    nome: "Regime regular",
    informa: "UF, município, data e, por item, NCM ou NBS, CST, cClassTrib e base de cálculo.",
    recebe: "CBS, IBS estadual e IBS municipal de cada item, já com as reduções de alíquota.",
  },
  {
    href: "/simples-nacional",
    nome: "Simples Nacional",
    informa: "CRT, tipo de documento e, por item, atividade, cClassTrib, base e alíquotas efetivas.",
    recebe: "Receita bruta, base, CBS e IBS do Simples por item, conforme a NT 2026.005.",
  },
  {
    href: "/danfse",
    nome: "DANFSe",
    informa: "O arquivo XML de uma NFS-e.",
    recebe: "O Documento Auxiliar da NFS-e em PDF, pronto para baixar.",
  },
];

export default function Home() {
  return (
    <>
      <div className="space-y-4">
        <h1 className="max-w-3xl text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] font-extrabold">
          Quanto de CBS e IBS incide nesta operação?
        </h1>
        <p className="intro text-lg">
          Simule os tributos da Reforma Tributária do Consumo com os mesmos serviços que a Receita Federal publicou em
          código aberto. Escolha por onde começar.
        </p>
      </div>

      <div className="folha">
        <div className="hidden grid-cols-[13rem_1fr_1fr] sm:grid">
          <span className="folha-titulo">Serviço</span>
          <span className="folha-titulo">Você informa</span>
          <span className="folha-titulo">Você recebe</span>
        </div>
        {servicos.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="grid border-b border-linha last:border-b-0 hover:bg-faixa sm:grid-cols-[13rem_1fr_1fr]"
          >
            <h2 className="px-3 pt-4 text-xl font-bold text-carimbo underline decoration-2 underline-offset-4 sm:py-5">
              {s.nome}
            </h2>
            <p className="px-3 pt-2 text-sm leading-relaxed sm:border-l sm:border-linha sm:py-5">
              <span className="rotulo sm:hidden">Você informa</span>
              {s.informa}
            </p>
            <p className="px-3 pt-2 pb-4 text-sm leading-relaxed sm:border-l sm:border-linha sm:py-5">
              <span className="rotulo sm:hidden">Você recebe</span>
              {s.recebe}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
