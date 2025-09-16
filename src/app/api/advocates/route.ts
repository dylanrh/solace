import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { NextResponse } from "next/server";
import { ilike, or, sql, desc, asc } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const qRaw = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200); // sane cap
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  const sort = (searchParams.get("sort") ?? "lastName").toLowerCase();
  const order = (searchParams.get("order") ?? "asc").toLowerCase();

  const sortMap = {
    firstname: advocates.firstName,
    lastname: advocates.lastName,
    city: advocates.city,
  } as const;

  // pick sort column, default lastName
  const sortCol = sortMap[sort as keyof typeof sortMap] ?? advocates.lastName;

  const orderByExpr = order === "desc" ? desc(sortCol) : asc(sortCol);
  // simple case-insensitive search across key text columns.
  const where = qRaw
    ? or(
        ilike(advocates.firstName, `%${qRaw}%`),
        ilike(advocates.lastName, `%${qRaw}%`),
        ilike(advocates.city, `%${qRaw}%`),
        ilike(advocates.degree, `%${qRaw}%`)
      )
    : undefined;

  // Query page + total (two cheap queries; minimal and clear)
  const rows = await db
    .select()
    .from(advocates)
    .orderBy(orderByExpr)
    .where(where as any)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(advocates)
    .where(where as any);

  // Keep the payload shape { data }, add total via header
  return NextResponse.json(
    { data: rows },
    { headers: { "X-Total-Count": String(count) } }
  );
}
