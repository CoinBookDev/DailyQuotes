const SUPABASE_URL = "https://gqebydtmqqrbryrblewc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_JUgeAdSO--n3ahN3Qdr9qg_3YS0H779";

const fs = require("fs");
const path = require("path");

module.exports = function (app) {
  app.post("/admin/update-announcements", (req, res) => {
    const filePath = path.join(__dirname, "announcements.json");
    const newData = req.body;

    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
      if (err) {
        console.error("Failed to save announcements:", err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    });
  });
};
