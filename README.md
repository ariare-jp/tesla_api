# �A���A�[�� Tesla �R�}���hAPI �d�l���i�J���Ҍ����j

�ŏI�X�V: 2025-10-05 (JST)

---

## �T�v

�e�X���ԗ��ɑ΂��āu�N���iwake�j�v�u�����iunlock�j�v�u�{���ilock�j�v�u�[�d�|�[�g�J/�iopen\_port/close\_port�j�v�̊e�R�}���h�𔭍s���邽�߂�**HTTP POST API**�ł��B���ׂẴG���h�|�C���g�� **HTTPS** �Œ񋟂���A**JSON** ���N�G�X�g/���X�|���X��z�肵�܂��B

---

## �x�[�XURL
- �{�Ԋ�
```
https://aliare.co.jp/tesla/tesla_api/public/api
```
- �J����
```
https://aliare.co.jp/tesla/tesla_api/public/api/dev
```
## ���ʃ��N�G�X�g�d�l

- **HTTP Method**: `POST`
- **Content-Type**: `application/json; charset=utf-8`
- **�F��**: ���N�G�X�g�{�f�B�� API�L�[ `key` ���܂߂Ă�������
  ```json
  { "key": "<YOUR_API_KEY>" }
  ```


## ���ʃ��X�|���X�d�l

���s�����ł͈ȉ��̂悤�ȃy�C���[�h��Ԃ����Ƃ�����܂��i�v���L�V�w�̃��b�Z�[�W�����j�B

```json
{
  "tag": "3744244687446742",
  "action": "unlock",
  "status": 200,
  "body": {
    "response": { /* �x���_�[���� */ },
    "error": null,
    "error_description": "",
    "_proxy_debug": {
      "url": "https://<upstream>...",
      "method": "POST"
    }
  }
}
```

- `status`: HTTP�����̃X�e�[�^�X�R�[�h�i200�n=�����A400/500�n=���s�j
- `body.response`: �㗬�iTesla API���j����̐������i�������j
- `body.error` / `error_description`: ���s���̏ڍ�
- �t�B�[���h�͏����ύX�����\��������܂��B�N���C�A���g�����ł�**���m�t�B�[���h�Ɋ��e**�ɂ��Ă��������B

## �G���[�n���h�����O

| HTTP | ����                                       |
| ---- | ---------------------------------------- |
| 200  | ��/�����B���e�� `status` �� `body.response` ���m�F |
| 400  | �s�����N�G�X�g�i�p�����[�^�s���A�`���s���Ȃǁj                  |
| 401  | �F�؎��s�i`key` ���s��/�����j                       |
| 403  | �F���s�i���̎ԗ�/���삪������Ă��Ȃ��j                   |
| 404  | �ΏۂȂ��i`vehicle_id` �s�� �Ȃǁj                 |
| 429  | ���[�g���߁i�Z���Ԃ̘A�ł�}���j                         |
| 5xx  | �T�[�o/�㗬��Q�B�Ď��s�𐄏��i�w���o�b�N�I�t�j                 |

---

## �G���h�|�C���g�ꗗ

### 1) �ԗ��N���iWake Vehicle�j

**POST** `/vehicles/:tag/commands/wake`

**Request Body**

```json
{ "key": "<YOUR_API_KEY>" }
```

**Response�i��j**

```json
{
  "tag": "3744244687446742",
  "action": "unlock",
  "status": 200,
  "body": { /* Fleet���� or Proxy���� + after�ԗ���� */ }
}
```

---

### 2) ���� / 3) �{�� / 4) �|�[�g�J��

**POST** `/vehicles/:tag/commands/{unlock|lock|open_port|close_port}`

**Request Body**

```json
{ "key": "<YOUR_API_KEY>" }
```

**Response�i��j**

```json
{
  "tag": "3744244687446742",
  "action": "unlock",
  "status": 200,
  "body": { /* Fleet���� or Proxy���� + after�ԗ���� */ }
}
```

