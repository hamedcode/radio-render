const express = require("express");
const request = require("request");

const app = express();

// لیست رادیوها
const stations = {
  "/rj": {
    name: "Radio Javan",
    url: "https://shoutcast2.glwiz.com:8000/Radio_javan.mp3"
  },
  "/gl": {
    name: "Radio GL",
    url: "https://shoutcast2.glwiz.com:8000/RadioGL.mp3"
  },
    "/70spersian": {
    name: "70s persian",
    url: "https://shoutcast.glwiz.com/KMspersian.mp3"
  },
  "/azari": {
    name: "azari",
    url: "https://shoutcast.glwiz.com/KMsazeri.mp3"
  }
};

// صفحه اصلی: نمایش رادیوها و لینک‌ها
app.get("/", (req, res) => {
  let html = "<h2>Radio Proxy is running!</h2><ul>";
  for (const path in stations) {
    html += `<li><b>${stations[path].name}</b>: <a href="${path}">${path}</a></li>`;
  }
  html += "</ul>";
  res.send(html);
});

// مسیر رادیوها
app.get("/:name", (req, res) => {
  const path = "/" + req.params.name;
  const station = stations[path];

  if (!station) {
    res.status(404).send("Radio not found");
    return;
  }

  console.log("Proxying:", station.url);

  // هدرهای سازگار با استریم
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "no-store");

  // passthrough مستقیم بدون بافر
  request({
    url: station.url,
    headers: { "Icy-MetaData": "1" },
  })
    .on("error", (err) => {
      console.error("Stream error:", err);
      res.end();
    })
    .pipe(res);
});

// سرور Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

