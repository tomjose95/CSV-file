const express = require("express");
const env = require("./config/enviroment");
const port = 8000;
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
app.use(expressLayouts);
app.use(express.static(env.assets_path));
app.use("/", require("./routes"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.listen(port, (err) => {
  if (err) console.log("Error in running server at :>> ", port);

  console.log("Server is running at PORT :>>", port);
});
