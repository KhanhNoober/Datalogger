# Datalogger
Ahh Welcome welcome 


## Thư mục Arduino Code
Code DHT 22: Chỉ cần lấy ip của chip wifi
Code RFID: Thay đổi ip local của server Backend vào URL

##Thu mục Backend
Đổi serviceAccountKet.json

và mở PS và chạy
```
npm i 
```
Để cài Package

Và

```
nest start --watch
```
Để chạy Server và mở tiếp Frontend

##Thu mục Frontend
Sửa IP Của NodeMCU đã liên kết với DHT22 trong file `tempandhumid.js` 
Sửa IP thành Local IP của Server trong file `rfid.js` 


Nếu bạn chưa có vite global thì gõ lệnh dưới trước để cài vite
```
npm i -g vite
```

Sau đó gõ lệnh
```
vite -- --host
```

Xong
