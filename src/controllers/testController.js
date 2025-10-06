import TestCase from "../models/TestCase.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const frameworkLanguageMap = {
  playwright: "TypeScript",
  cypress: "JavaScript",
  selenium: "Java",
  robotframework: "Python",
  puppeteer: "JavaScript",
  webdriverio: "JavaScript",
  uft: "JavaScript"
};


export const createTestCase = async (req, res) => {
  const { title, inputText, framework } = req.body;
  const userId = req.user.id;
  const language = frameworkLanguageMap[framework] || "JavaScript";

  try {
    // Refined AI prompt
    const prompt = `
        You are an expert QA automation engineer.
        Generate a ${framework} automation script in ${language} for the following test case:
        ---
        ${inputText}
        ---
        Only output the code, no explanations, no comments.
        Format the code as a proper code block with triple backticks.
    `;

    console.log("Sending prompt to OpenRouter...");

    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // console.log("AI Response:", aiResponse.data);

    let generatedCode = aiResponse.data?.choices?.[0]?.message?.content || "";

    // Extract code inside triple backticks
    const codeMatch = generatedCode.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (codeMatch) {
      generatedCode = codeMatch[1];
    }

    const newTestCase = new TestCase({
      userId,
      title,
      inputText,
      framework,
      language,
      generatedCode
    });

    await newTestCase.save();

    res.status(201).json(newTestCase);
  } catch (err) {
    console.error("Error generating test case:", err.response?.data || err.message);
    res.status(500).json({ message: "Error generating test case", error: err.message });
  }
};



export const getTestCases = async (req, res) => {
  const userId = req.user.id;

  try {
    const testCases = await TestCase.find({ userId }).sort({ createdAt: -1 });
    res.json(testCases);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test cases", error: err.message });
  }
};

export const deleteTestCase = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const testCase = await TestCase.findOneAndDelete({ _id: id, userId });
    if (!testCase) return res.status(404).json({ message: "Test case not found" });

    res.json({ message: "Test case deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting test case", error: err.message });
  }
};
