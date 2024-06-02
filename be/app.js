const express = require('express');
const CryptoJS = require('crypto-js');
const cors = require('cors'); 
const mongoose = require('mongoose');

const app = express();
const PORT = 3500;

const privateKey = "c725269e385de5e8b9f101439a1677a3";
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin123456@admin.dwdnoo6.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });
// Route để lấy MAC từ máy chủ
app.post('/getMac', (req, res) => {
    try {
        const orderData = req.body;
        console.log('Received order data:', orderData);
        if (!Array.isArray(orderData.item)) {
            orderData.item = [orderData.item];
        }
        // Chuyển đổi dữ liệu item thành chuỗi
        orderData.item = JSON.stringify(orderData.item);

        // Tạo MAC từ dữ liệu đơn hàng và khóa riêng tư
        const dataMac = Object.keys(orderData)
            .sort()
            .map(key => `${key}=${typeof orderData[key] === "object" ? JSON.stringify(orderData[key]) : orderData[key]}`)
            .join("&");
        
        const mac = CryptoJS.HmacSHA256(dataMac, privateKey).toString();
        console.log("mac" , mac)
        // Trả về MAC và dữ liệu đơn hàng cho máy khách
        res.json({ mac, orderData });
    } catch (error) {
        console.error("Error generating MAC:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post('/notify', (req, res) => {
    const { appId, orderId, method, mac } = req.body;

    // Tạo chuỗi data theo format quy định
    const data = `appId=${appId}&orderId=${orderId}&method=${method}`;

    // Tính toán reqmac sử dụng HMAC với thuật toán HmacSHA256 và privateKey
    const reqmac = crypto.createHmac('sha256', privateKey).update(data).digest('hex');

    // So sánh reqmac với mac nhận được từ request
    if (reqmac === mac) {
        // request hợp lệ
        console.log('Request hợp lệ:', { appId, orderId, method });
        res.status(200).send('Request hợp lệ');
    } else {
        // request không hợp lệ
        console.error('Request không hợp lệ:', { appId, orderId, method });
        res.status(400).send('Request không hợp lệ');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
