# アリアーレ Tesla コマンドAPI 仕様書（開発者向け）

最終更新: 2025-10-05 (JST)

---

## 概要

テスラ車両に対して「起床（wake）」「解錠（unlock）」「施錠（lock）」「充電ポート開/閉（open\_port/close\_port）」の各コマンドを発行するための**HTTP POST API**です。すべてのエンドポイントは **HTTPS** で提供され、**JSON** リクエスト/レスポンスを想定します。

---

## ベースURL
- 本番環境
```
https://aliare.co.jp/tesla/tesla_api/public/api
```
- 開発環境
```
https://aliare.co.jp/tesla/tesla_api/public/api/dev
```
## 共通リクエスト仕様

- **HTTP Method**: `POST`
- **Content-Type**: `application/json; charset=utf-8`
- **認証**: リクエストボディに APIキー `key` を含めてください
  ```json
  { "key": "<YOUR_API_KEY>" }
  ```


## 共通レスポンス仕様

現行実装では以下のようなペイロードを返すことがあります（プロキシ層のメッセージを内包）。

```json
{
  "tag": "3744244687446742",
  "action": "unlock",
  "status": 200,
  "body": {
    "response": { /* ベンダー応答 */ },
    "error": null,
    "error_description": "",
    "_proxy_debug": {
      "url": "https://<upstream>...",
      "method": "POST"
    }
  }
}
```

- `status`: HTTP相当のステータスコード（200系=成功、400/500系=失敗）
- `body.response`: 上流（Tesla API等）からの生応答（成功時）
- `body.error` / `error_description`: 失敗時の詳細
- フィールドは将来変更される可能性があります。クライアント実装では**未知フィールドに寛容**にしてください。

## エラーハンドリング

| HTTP | 説明                                       |
| ---- | ---------------------------------------- |
| 200  | 受理/成功。内容は `status` と `body.response` を確認 |
| 400  | 不正リクエスト（パラメータ不足、形式不正など）                  |
| 401  | 認証失敗（`key` が不正/欠落）                       |
| 403  | 認可失敗（その車両/操作が許可されていない）                   |
| 404  | 対象なし（`vehicle_id` 不正 など）                 |
| 429  | レート超過（短時間の連打を抑制）                         |
| 5xx  | サーバ/上流障害。再試行を推奨（指数バックオフ）                 |

---

## エンドポイント一覧

### 1) 車両起床（Wake Vehicle）

**POST** `/vehicles/:tag/commands/wake`

**Request Body**

```json
{ "key": "<YOUR_API_KEY>" }
```

**Response（例）**

```json
{
  "tag": "3744244687446742",
  "action": "unlock",
  "status": 200,
  "body": { /* Fleet応答 or Proxy応答 + after車両状態 */ }
}
```

---

### 2) 解錠 / 3) 施錠 / 4) ポート開閉

**POST** `/vehicles/:tag/commands/{unlock|lock|open_port|close_port}`

**Request Body**

```json
{ "key": "<YOUR_API_KEY>" }
```

**Response（例）**

```json
{
  "tag": "3744244687446742",
  "action": "unlock",
  "status": 200,
  "body": { /* Fleet応答 or Proxy応答 + after車両状態 */ }
}
```

