# アリアーレ Tesla コマンドAPI 仕様書（開発者向け）

最終更新: 2026-04-18

---

## 概要

テスラ車両に対して「起床（wake）」「解錠（unlock）」「施錠（lock）」「充電ポート開/閉（open\_port/close\_port）」の各コマンドを発行する**操作系API**に加え、「現在付近の充電スポット」「充電履歴」を取得する**参照系API**を提供します。すべてのエンドポイントは **HTTPS** で提供され、主に **JSON** リクエスト/レスポンスを想定します。

---

## ベースURL
- 本番環境
```
https://tesla.aliare.co.jp/tesla/tesla_api/public/api
```
- 開発環境
```
https://tesla.aliare.co.jp/tesla/tesla_api/public/api/dev
```
## 共通リクエスト仕様

- **HTTP Method**:
  - 操作系API: `POST`
  - 参照系API: `GET`
- **Content-Type**:
  - `POST` の場合: `application/json; charset=utf-8`
  - `GET` の場合: 実装に応じて `key` をクエリパラメータで付与
- **認証**:
  - `POST` の場合はリクエストボディに APIキー `key` を含めてください
    ```json
    { "key": "<YOUR_API_KEY>" }
    ```
  - `GET` の場合は以下のように `key` を付与します
    ```text
    ?key=<YOUR_API_KEY>
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

---

### 5) 現在付近の充電スポット（Nearby Charging Sites）

**GET** `/vehicles/:tag/nearby_charging_sites`

**Query Parameters**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `key` | string | Yes | APIキー |

**Request Example**

```http
GET /vehicles/3744244687446742/nearby_charging_sites?key=<YOUR_API_KEY>
```

**Response（例）**

```json
{
  "tag": "3744244687446742",
  "response": {
    "data": [
      {
        "name": "Supercharger Atsugi",
        "distance_km": 3.2,
        "available_stalls": 8
      }
    ]
  }
}
```

- 車両の現在位置付近にある充電スポット情報を返します。
- 実際のレスポンス項目は上流APIや実装状況に応じて増減する可能性があります。

---

### 6) 充電履歴（Charging History）

**GET** `/vehicles/:tag/charging_history`

**Query Parameters**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `key` | string | Yes | APIキー |

**Request Example**

```http
GET /vehicles/3744244687446742/charging_history?key=<YOUR_API_KEY>
```

**Response（例）**

```json
{
  "tag": "3744244687446742",
  "response": {
    "data": [
      {
        "sessionId": 654365280,
        "vin": "LRW3F7FS0SC530304",
        "siteLocationName": "Atsugi, Japan",
        "chargeStartDateTime": "2026-04-16T23:00:00Z",
        "chargeStopDateTime": "2026-04-17T00:10:00Z"
      }
    ]
  }
}
```

- 車両の充電履歴一覧を返します。
- セッションID、充電場所、開始/終了時刻などを取得できます。
- 実際のレスポンス項目は上流APIや実装状況に応じて増減する可能性があります。

---

## Laravel ルート定義（追加分）

```php
// 追加: 現在付近の充電スポット
Route::get('/vehicles/{tag}/nearby_charging_sites', [VehicleController::class, 'nearbyChargingSites']);

// 追加: 充電履歴
Route::get('/vehicles/{tag}/charging_history', [VehicleController::class, 'chargingHistory']);
```

