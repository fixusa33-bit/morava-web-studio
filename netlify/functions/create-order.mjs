
import { getStore } from "@netlify/blobs";

const json = (statusCode, body) => new Response(JSON.stringify(body), {
  status: statusCode,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*"
  }
});

export default async (request) => {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: "Neplatná data." });
  }

  const required = ["name", "email", "package"];

  if (required.some(k => !String(data[k] || "").trim())) {
    return json(400, { error: "Vyplňte prosím povinná pole." });
  }

  if (
    String(data.name).length > 100 ||
    String(data.email).length > 150 ||
    String(data.details || "").length > 2000
  ) {
    return json(400, { error: "Některé pole je příliš dlouhé." });
  }

  const order = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(data.name).trim(),
    email: String(data.email).trim(),
    phone: String(data.phone || "").trim(),
    business: String(data.business || "").trim(),
    package: String(data.package).trim(),
    extras: String(data.extras || "").trim(),
    details: String(data.details || "").trim()
  };

  try {
    const store = getStore("morava-orders");
    await store.setJSON(order.id, order);
  } catch (e) {
    console.error("Blob storage error:", e);
    return json(500, {
      error: "Poptávku se nepodařilo uložit."
    });
  }

  const message = [
    "NOVÁ POPTÁVKA — MORAVA WEB STUDIO",
    `Jméno/firma: ${order.name}`,
    `E-mail: ${order.email}`,
    `Telefon: ${order.phone || "-"}`,
    `Obor: ${order.business || "-"}`,
    `Balíček: ${order.package}`,
    `Doplňky: ${order.extras || "-"}`,
    `Popis: ${order.details || "-"}`,
    `Datum: ${order.createdAt}`,
    `ID: ${order.id}`
  ].join("\n");

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        console.error("Telegram API error:", {
          status: response.status,
          description: result.description,
          error_code: result.error_code
        });
      } else {
        console.log("Telegram notification sent successfully.");
      }
    } catch (e) {
      console.error("Telegram request error:", e.message);
    }
  } else {
    console.error("Telegram environment variables are missing.");
  }

  return json(200, {
    ok: true,
    id: order.id
  });
};
