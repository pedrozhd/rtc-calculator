import { AvisoBackend } from "@/components/aviso-backend";
import { FormularioDanfse } from "./formulario";

export default function Danfse() {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">DANFSe</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Envie o XML de uma NFS-e para gerar o Documento Auxiliar em PDF. O arquivo não é armazenado.
        </p>
      </div>
      {!process.env.DANFSE_API_URL && <AvisoBackend variavel="DANFSE_API_URL" />}
      <FormularioDanfse />
    </>
  );
}
