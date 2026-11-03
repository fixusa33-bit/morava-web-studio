import { getStore } from "@netlify/blobs";
const json = (statusCode, body) => new Response(JSON.stringify(body), {
  status: statusCode, headers: { "content-type": "application/json; charset=utf-8" }
});
export default async (request) => {
  if (request.method !== "GET") return json(405, { error: "Method not allowed" });
  const expected = process.env.ADMIN_PASSWORD;
  const supplied = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!expected || supplied !== expected) return json(401, { error: "Nesprávné heslo nebo chybí ADMIN_PASSWORD." });
  try {
    const store = getStore("morava-orders");
    const { blobs } = await store.list();
    const orders = [];
    for (const item of blobs) {
      const value = await store.get(item.key, { type: "json" });
      if (value) orders.push(value);
    }
    orders.sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return json(200, { orders });
  } catch (e) {
    console.error(e);
    return json(500, { error: "Nepodařilo se načíst objednávky." });
  }
};
