const mongoose = require("mongoose");

const csvSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    header_row: {
      type: [Object],
    },
    data_rows: {
      type: [Object],
    },
  },
  {
    timestamps: true,
  }
);

const CSV = mongoose.model("CSV", csvSchema);
module.exports = CSV;
