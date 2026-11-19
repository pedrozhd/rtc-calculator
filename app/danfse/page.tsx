import { AvisoBackend } from "@/components/aviso-backend";
import { FormularioDanfse } from "./formulario";

export default function Danfse() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="titulo">DANFSe</h1>
        <p className="intro">
          Envie o XML de uma NFS-e para gerar o Documento Auxiliar em PDF. O arquivo não é armazenado.
        </p>
      </div>
      {!process.env.DANFSE_API_URL && <AvisoBackend variavel="DANFSE_API_URL" />}
      <FormularioDanfse />
    </>
  );
}
