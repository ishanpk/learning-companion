import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  const genAI = new GoogleGenerativeAI("AIzaSyCJ8IkSI2EEapSwrc69k6yOgRQ4CF6nnJk");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("hi");
    console.log("gemini-2.0-flash works!");
  } catch (e) {
    console.log("gemini-2.0-flash result: " + e.message);
  }
}

test();
