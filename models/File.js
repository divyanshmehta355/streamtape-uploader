import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: String,
    fileId: String,
    streamUrl: String,
    downloadUrl: String,
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
export default File;
