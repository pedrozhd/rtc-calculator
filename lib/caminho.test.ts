import assert from "node:assert/strict";
import test from "node:test";
import { gravar, ler } from "./caminho.ts";

test("gravar cria objetos aninhados e ler os percorre", () => {
  const o = {};
  gravar(o, "ncm", "10063021");
  gravar(o, "aliquotasNominais.cbs", "8.8");
  gravar(o, "aliquotasNominais.ibsEstadual", "0.05");
  assert.deepEqual(o, {
    ncm: "10063021",
    aliquotasNominais: { cbs: "8.8", ibsEstadual: "0.05" },
  });
  assert.equal(ler(o, "aliquotasNominais.cbs"), "8.8");
  assert.equal(ler(o, "tribCalc.IBSCBS.vBC"), undefined);
});
