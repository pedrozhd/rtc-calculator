import { Calculadora } from "@/components/calculadora";

const G = "tribCalc.IBSCBS.gIBSCBS";
const T = "total.tribCalc.IBSCBSTot";

export default function RegimeRegular() {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Regime regular</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Informe NCM (bens) ou NBS (serviços) em cada item. As alíquotas só devem ser preenchidas para fatos geradores
          a partir de 2027; em 2026 o serviço usa as alíquotas de referência.
        </p>
      </div>
      <Calculadora
        endpoint="/api/regime-regular/calculadora/observabilidade/regime-geral"
        fixos={{ versao: "1.0.0" }}
        campos={[
          // O serviço exige data, hora e fuso; a hora não altera o cálculo.
          { nome: "dhFatoGerador", rotulo: "Data do fato gerador", tipo: "date", sufixo: "T12:00:00-03:00" },
          { nome: "uf", rotulo: "UF (sigla)" },
          { nome: "municipio", rotulo: "Município (código IBGE)" },
        ]}
        inicial={{ dhFatoGerador: "2026-06-01", uf: "RS", municipio: "4314902" }}
        camposItem={[
          { nome: "ncm", rotulo: "NCM" },
          { nome: "nbs", rotulo: "NBS" },
          { nome: "cst", rotulo: "CST" },
          { nome: "cClassTrib", rotulo: "cClassTrib" },
          { nome: "baseCalculo", rotulo: "Base de cálculo" },
          { nome: "aliquotasNominais.cbs", rotulo: "CBS %" },
          { nome: "aliquotasNominais.ibsEstadual", rotulo: "IBS UF %" },
          { nome: "aliquotasNominais.ibsMunicipal", rotulo: "IBS Mun %" },
        ]}
        itemInicial={{ ncm: "61091000", cst: "000", cClassTrib: "000001", baseCalculo: "100.00" }}
        colunas={[
          ["Base", `${G}.vBC`],
          ["IBS UF", `${G}.gIBSUF.vIBSUF`],
          ["IBS Mun", `${G}.gIBSMun.vIBSMun`],
          ["CBS", `${G}.gCBS.vCBS`],
        ]}
        totais={[
          ["Base total", `${T}.vBCIBSCBS`],
          ["IBS", `${T}.gIBS.vIBS`],
          ["CBS", `${T}.gCBS.vCBS`],
        ]}
      />
    </>
  );
}
