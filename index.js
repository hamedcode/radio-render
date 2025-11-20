const express = require("express");
const request = require("request");

const app = express();

// لیست رادیوها
const stations = {
  "/rj": "https://shoutcast2.glwiz.com:8000/Radio_javan.mp3",
  "/gl": "https://shoutcast2.glwiz.com:8000/RadioGL.mp3",
  "/simorgh": "https://shoutcast2.glwiz.com:8000/radiosimorghoriginalpersianmusic.mp3"
};

// مسیر اصلی رادیوها
app.get("/:name", (req, res) => {
  const path = "/" + req.params.name;
  const url = stations[path];

  if (!url) {
    res.status(404).send("Radio not found");
    return;
  }

  console.log("Proxying:", url);

  // هدرهای سازگار با استریم
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "no-store");

  // بدون بافر → passthrough مستقیم
  request({
    url: url,
    headers: { "Icy-MetaData": "1" },
  }).on("error", (err) => {
    console.error(err);
    res.end();
  }).pipe(res);
});

// سرور Replit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
