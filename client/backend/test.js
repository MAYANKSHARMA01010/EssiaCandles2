const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Minimal Express Server Running!");
});

app.listen(5002, () => {
  console.log("🚀 Test server running on port 5002");
});
