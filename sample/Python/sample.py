import requests

url =  "https://aliare.co.jp/tesla/tesla_api/public/api/dev/vehicles/3744244687446742/commands/wake"
payload = {
	"key": ""
}

r = requests.post(url, json=payload) 
print(r.status_code)
print(r.text)
