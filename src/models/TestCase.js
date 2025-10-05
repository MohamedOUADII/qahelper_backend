import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  inputText: {
    type: String,
    required: true
  },
  framework: {
    type: String,
    enum: ["playwright", "cypress", "selenium", "puppeteer", "webdriverio","robotframework","uft"],
    required: true
  },
    language: {
    type: String,
    required: true
    },

  generatedCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("TestCase", testCaseSchema);
