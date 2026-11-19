import { AvisoBackend } from "@/components/aviso-backend";
import { Calculadora } from "@/components/calculadora";

export default function SimplesNacional() {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Simples Nacional</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cálculo conforme a NT 2026.005. A atividade (cAtivSN) vai de 01 a 14, ou 90 para operações não tributáveis;
          as alíquotas efetivas do Simples são informadas por item.
        </p>
      </div>
      {!process.env.SIMPLES_NACIONAL_API_URL && <AvisoBackend variavel="SIMPLES_NACIONAL_API_URL" />}
      <Calculadora
        endpoint="/api/simples-nacional/calculadora/observabilidade/simples-nacional"
        fixos={{ versao: "2.0.0" }}
        campos={[
          { nome: "data", rotulo: "Data do fato gerador", tipo: "date" },
          { nome: "tpDoc", rotulo: "Documento", opcoes: [["55", "55 - NF-e"], ["65", "65 - NFC-e"]] },
          {
            nome: "CRT",
            rotulo: "CRT",
            opcoes: [
              ["1", "1 - Simples Nacional"],
              ["2", "2 - Simples, excesso de sublimite"],
              ["3", "3 - Regime normal"],
            ],
          },
          {
            nome: "tpRegimeIBSCBS",
            rotulo: "Regime IBS/CBS",
            opcoes: [["", "Não informado"], ["2", "2 - Apuração por fora (CRT 3)"]],
          },
          {
            nome: "tpEnteGov",
            rotulo: "Compra governamental",
            opcoes: [["", "Não"], ["1", "União"], ["2", "Estado"], ["3", "Distrito Federal"], ["4", "Município"]],
          },
        ]}
        inicial={{ data: "2027-03-15", tpDoc: "55", CRT: "1" }}
        camposItem={[
          { nome: "cAtivSN", rotulo: "Atividade" },
          { nome: "cClassTrib", rotulo: "cClassTrib" },
          { nome: "baseCalculo", rotulo: "Base de cálculo" },
          { nome: "valorImpostoSeletivo", rotulo: "Imposto Seletivo" },
          { nome: "pIBSSN", rotulo: "IBS %" },
          { nome: "pCBSSN", rotulo: "CBS %" },
        ]}
        itemInicial={{
          cAtivSN: "01",
          cClassTrib: "000001",
          baseCalculo: "950.00",
          valorImpostoSeletivo: "0.00",
          pIBSSN: "1.25",
          pCBSSN: "2.75",
        }}
        colunas={[
          ["Receita bruta", "tribCalc.vRBSNitem"],
          ["Base", "tribCalc.vBC"],
          ["IBS", "tribCalc.vIBSSN"],
          ["CBS", "tribCalc.vCBSSN"],
          ["Total", "tribCalc.totalItem"],
        ]}
        totais={[
          ["Receita bruta", "total.vRBSNtot"],
          ["IBS", "total.vIBSSNtot"],
          ["CBS", "total.vCBSSNtot"],
          ["Total de tributos", "total.totalTributos"],
        ]}
      />
    </>
  );
}
