const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/admin/update-announcements", (req, res) => {
  const filePath = path.join(__dirname, "announcements.json");
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
