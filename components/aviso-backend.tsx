export function AvisoBackend({ variavel }: { variavel: string }) {
  return (
    <p role="status" className="aviso">
      Este serviço ainda não está ligado: defina a variável de ambiente <code>{variavel}</code> com a URL do backend
      (veja o README) e publique de novo.
    </p>
  );
}
