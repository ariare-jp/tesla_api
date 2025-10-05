const url =  "https://aliare.co.jp/tesla/tesla_api/public/api/dev/vehicles/3744244687446742/commands/wake";
const payload = { key: "" };

async function postwake() {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("status:", res.status);

    // レスポンスをテキストで取得（JSON の場合は res.json() を使ってください）
    const text = await res.text();
    console.log("body:", text);
  } catch (err) {
    console.error("エラー:", err);
  }
}
postwake();
