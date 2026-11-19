export function AvisoBackend({ variavel }: { variavel: string }) {
  return (
    <p role="status" className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
      Este serviço ainda não está ligado: defina a variável de ambiente <code>{variavel}</code> com a URL do backend
      (veja o README) e publique de novo.
    </p>
  );
}
