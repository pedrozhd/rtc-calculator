// Leitura e escrita por caminho pontilhado ("a.b.c"), usadas para montar o JSON
// de entrada das calculadoras e ler campos aninhados da resposta.
type Obj = Record<string, unknown>;

export function ler(obj: unknown, caminho: string): unknown {
  return caminho
    .split(".")
    .reduce<unknown>((o, k) => (o as Obj | null | undefined)?.[k], obj);
}

export function gravar(obj: Obj, caminho: string, valor: unknown): void {
  const chaves = caminho.split(".");
  const ultima = chaves.pop()!;
  let alvo = obj;
  for (const k of chaves) alvo = (alvo[k] ??= {}) as Obj;
  alvo[ultima] = valor;
}
