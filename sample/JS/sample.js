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

    // ���X�|���X���e�L�X�g�Ŏ擾�iJSON �̏ꍇ�� res.json() ���g���Ă��������j
    const text = await res.text();
    console.log("body:", text);
  } catch (err) {
    console.error("�G���[:", err);
  }
}
postwake();
