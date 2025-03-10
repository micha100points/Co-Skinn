const express = require("express");
const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const config = require("config");
const querystring = require("querystring");
const axios = require("axios");
const router = express.Router();
process.env.TZ = "Asia/Ho_Chi_Minh";

// Hàm sắp xếp object theo thứ tự alphabet
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

// API tạo URL thanh toán
router.post("/create_payment_url", (req, res) => {
  try {
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require("config");

    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    console.log(bankCode);

    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ paymentUrl: vnpUrl });
  } catch (error) {
    console.error("Error in create_payment_url:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// API xử lý kết quả trả về từ VNPay
router.get("/vnpay_return", function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];
  vnp_Params = sortObject(vnp_Params);
  let config = require("config");
  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    let orderStatus =
      vnp_Params["vnp_ResponseCode"] === "00" ? "success" : "error";

    if (orderStatus === "success") {
      axios.put(`http://localhost:5000/api/orders/update-status/${vnp_Params["vnp_TxnRef"]}`, {
        status: 'Đã thanh toán'  // Giả sử bạn muốn cập nhật trạng thái thành "paid"
    })
    .then(response => {
      console.log("Order status updated:", response.data);
    })
    .catch(error => {
      console.error("Error updating order status:", error);
    });
        res.status(200).send(`
              <html>
                  <head>
                      <style>
                          body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f7f8fa; }
                          .container { text-align: center; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
                          .container h2 { color: #28a745; }
                          .details { margin-top: 10px; text-align: left; }
                          .details p { margin: 5px 0; }
                          .button { margin-top: 20px; }
                          .button button { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <h2>Payment Successful!</h2>
                          <div class="details">
                              <p><strong>Amount:</strong> đ${
                                vnp_Params["vnp_Amount"] / 100
                              }</p>
                              <p><strong>Transaction ID:</strong> ${
                                vnp_Params["vnp_TransactionNo"]
                              }</p>
                              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                              <p><strong>Payment Method:</strong> ${
                                vnp_Params["vnp_BankCode"] || "Unknown"
                              }</p>
                          </div>
                      <div class="button">
                          <button onclick="goBack()">DONE</button>
                      </div>

                      <script>
                      function goBack() {
                          // Android 
                          if (window.AndroidInterface) {
                              window.AndroidInterface.paymentSuccess();
                          }
                          
                          // web 
                          window.location.href = 'http://localhost:3000/';
                      }
</script>
                      </div>
                  </body>
              </html>
          `);
    } else {
      res.status(200).send("<p>Payment failed. Please try again.</p>");
    }
  } else {
    res.status(400).send("Invalid request.");
  }
});

module.exports = router;
