const CSV = require("./../models/csv");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

module.exports.home = async function (req, res) {
  try {
    const csvFiles = await CSV.find({});

    return res.render("home", {
      files: csvFiles,
      title: "CSV File Reader | Home",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.upload = async function (req, res) {
  try {
    if (!req.file) {
      // handle error if file not present
      return res.status(400).send("No files were uploaded.");
    }

    if (req.file.mimetype !== "text/csv") {
      // handle error if file is not CSV
      return res.status(400).send("Only CSV files are allowed.");
    }

    //parser the uploaded csv file and store it in array
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        //save csv data to db
        if (req.file) {
          const oldPath = req.file.path;
          const newPath = path.join(
            __dirname,
            "../uploads",
            req.file.originalname
          );
          fs.rename(oldPath, newPath, (err) => {
            if (err) throw err;
          });
          const csvData = new CSV({
            filename: req.file.originalname,
            header_row: results[0],
            data_rows: results.slice(1),
            // path: newPath
          });
          await csvData.save();
        } else {
          res.status(400).send("No file uploaded");
        }
        return res.redirect("/");
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.view = async function (req, res) {
  try {
    const csvFile = await CSV.findById(req.params.id);
    if (!csvFile) {
      return res.status(404).send("File not found");
    }

    // Read CSV file contents
    const uploadsPath = path.join(__dirname, "../uploads");
    const fileData = await new Promise((resolve, reject) => {
      fs.readFile(
        path.join(uploadsPath, csvFile.filename),
        "utf8",
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            // Parse the CSV data and send it to the view
            const rows = data.trim().split("\n");
            const header_row = rows[0].split(",");
            const data_rows = rows.slice(1).map((row) => {
              const row_data = {};
              row.split(",").forEach((value, index) => {
                row_data[header_row[index]] = value;
              });
              return row_data;
            });
            resolve({ filename: csvFile.filename, header_row, data_rows });
          }
        }
      );
    });
    console.log(fileData);

    res.render("csvReader", {
      fileData,
      title: "CSV file",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
