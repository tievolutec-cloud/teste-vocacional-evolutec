import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const INITIAL_COUNTER = 8709;
const BASELINE_COMPLETED_ROWS = 1;
const COUNT_QUERY = encodeURIComponent("select count(A) label count(A) ''");
const SHEET_COUNT_URL = `https://docs.google.com/spreadsheets/d/1yFNJewVii1I1wTQ0FZhGb9__wWle6CJjjSsn-b8XNsY/gviz/tq?gid=0&headers=2&tqx=out:json&tq=${COUNT_QUERY}`;

type GoogleCountResponse = {
  table?: { rows?: Array<{ c?: Array<{ v?: number | null }> }> };
};

export async function GET() {
  try {
    // A consulta agregada retorna somente a contagem; nomes e telefones não saem da planilha.
    const response = await fetch(SHEET_COUNT_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível consultar a planilha.");

    const body = await response.text();
    const jsonStart = body.indexOf("{");
    const jsonEnd = body.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < jsonStart) throw new Error("Resposta inválida.");

    const payload = JSON.parse(body.slice(jsonStart, jsonEnd + 1)) as GoogleCountResponse;
    const completedRows = Number(payload.table?.rows?.[0]?.c?.[0]?.v ?? BASELINE_COMPLETED_ROWS);
    const count = INITIAL_COUNTER + Math.max(0, completedRows - BASELINE_COMPLETED_ROWS);

    return NextResponse.json({ count }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ count: INITIAL_COUNTER }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
