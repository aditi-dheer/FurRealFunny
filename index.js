import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm';

const ai = new GoogleGenAI({
  apiKey: "AIzaSyB4JK-5_NhWH3FpXrKZrvHYSVhiLn3zTbg"
});

const form = document.getElementById("myForm");
const inputField = document.getElementById("userInput");
const loading = document.getElementById("loading");
const captionDiv = document.getElementById("top-caption");
const memeContainer = document.getElementById("meme-container");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const input = inputField.value.trim();
  if (!input) return;

  loading.style.display = "block";
  memeContainer.style.display = "none";
  captionDiv.textContent = "";

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [{
        role: "user",
        parts: [{
          text: `Also, there must be NO cuss words. your response should not be inappropriate. I have a cat meme image. I need you to generate a short caption for that. For context, I am a student so it should be study related. I have an image already do not generate a new image. Your response should only be the words of text, do not include any other words or characters around it. This is what it should be based on: ${input}`
        }]
      }]
    });

    const caption = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (caption) {
      captionDiv.textContent = caption;
      memeContainer.style.display = "block";
    } else {
      captionDiv.textContent = "Oops, Gemini didn't respond with text.";
    }
  } catch (err) {
    console.error("Error generating content:", err);
    captionDiv.textContent = "An error occurred while generating the caption.";
  } finally {
    loading.style.display = "none";
  }
});
