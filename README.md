# Morava Web Studio — Netlify

## Obsah
- `index.html` — hlavní web v češtině
- `admin.html` — interní přehled poptávek
- `privacy.html` — vzorová stránka ochrany osobních údajů (před ostrým provozem doplnit)
- `netlify/functions/create-order.mjs` — ukládá poptávky do Netlify Blobs a posílá notifikace
- `netlify/functions/list-orders.mjs` — chráněný výpis objednávek
- `netlify.toml` — konfigurace Netlify

## Nasazení
1. Nahrajte celý obsah složky do nového GitHub repository.
2. V Netlify zvolte Add new site → Import an existing project a připojte repository.
3. Build command nechte prázdný, publish directory nastavte na `.`.
4. Po deployi otevřete Site configuration → Environment variables a přidejte:

| Proměnná | Povinná | Popis |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | pro Telegram | Token Telegram bota |
| `TELEGRAM_CHAT_ID` | pro Telegram | ID cílového chatu |
| `RESEND_API_KEY` | pro email | API klíč služby Resend |
| `NOTIFICATION_EMAIL` | pro email | Adresa pro příjem poptávek |
| `RESEND_FROM` | volitelná | Ověřená adresa odesílatele Resend |
| `ADMIN_PASSWORD` | ano pro admin | Silné heslo administrátora |

5. Proveďte nový deploy po přidání proměnných.
6. Testovací formulář: odešlete z hlavní stránky poptávku.
7. Admin: `https://VAŠE-DOMÉNA/admin.html` a přihlaste se heslem `ADMIN_PASSWORD`.

## Telegram
Vytvořte bota přes BotFather, pošlete botovi zprávu /start a zjistěte chat ID. U skupiny přidejte bota do skupiny a použijte ID skupiny. Nikdy nevkládejte token do HTML ani veřejného GitHubu.

## Email
Integrace používá Resend API. Vytvořte účet, ověřte odesílací doménu a nastavte `RESEND_API_KEY`, `NOTIFICATION_EMAIL` a `RESEND_FROM`. Bez těchto proměnných se e-mailová notifikace neposílá.

## Tabulka objednávek
Poptávky se ukládají do Netlify Blobs. Stránka `/admin.html` je načítá přes chráněnou Netlify Function. Přístup chrání `ADMIN_PASSWORD`.

## Důležité před ostrým provozem
- Nahraďte vzorovou stránku `privacy.html` skutečnými informacemi o správci, právním základu, době uchování a právech osob.
- Doplňte skutečné kontaktní údaje a ověřte, že je smíte používat.
- Ukázky portfolia jsou jasně označené jako koncepty, nikoli jako realizace pro klienty.
- Zkontrolujte živnostenské, daňové a spotřebitelské povinnosti v ČR.
- Zatím není integrována online platba; platba se domlouvá individuálně po schválení nabídky.
