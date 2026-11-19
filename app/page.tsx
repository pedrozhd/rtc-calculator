import Link from "next/link";

const servicos = [
  [
    "/regime-regular",
    "Regime regular",
    "CBS e IBS por item da operação, com reduções de alíquota conforme CST e cClassTrib.",
  ],
  [
    "/simples-nacional",
    "Simples Nacional",
    "CBS e IBS de operações de optantes do Simples, por atividade e tipo de receita bruta.",
  ],
  ["/danfse", "DANFSe", "Gera o PDF do DANFSe a partir do XML de uma NFS-e."],
];

export default function Home() {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Calculadora da Reforma Tributária do Consumo</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Uma interface única para os três serviços publicados pela Receita Federal (LC 214/2025).
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {servicos.map(([href, titulo, descricao]) => (
          <li key={href}>
            <Link
              href={href}
              className="block h-full rounded-lg border border-zinc-200 p-4 hover:border-emerald-600 dark:border-zinc-800"
            >
              <h2 className="font-medium">{titulo}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{descricao}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
