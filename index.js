import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm';

const ai = new GoogleGenAI({
  apiKey: "AIzaSyB4JK-5_NhWH3FpXrKZrvHYSVhiLn3zTbg"
});

const form = document.getElementById("myForm");
const inputField = document.getElementById("userInput");
const loading = document.getElementById("loading");
const topCaptionDiv = document.getElementById("top-caption");
const bottomCaptionDiv = document.getElementById("bottom-caption");
const memeContainer = document.getElementById("meme-container");
const memeImage = document.getElementById("memeImage");

const imageLibrary = [
  './images_library/cat_mouth_img.png',
  './images_library/cats+liquid+2.png',
  './images_library/Cool-cat-meme-2.jpg',
  './images_library/loading-cat.gif',
  './images_library/math cat.jpg',
  './images_library/melted12_4e189508-0c43-406c-a76a-d6f05053163f.jpg.png',
  './images_library/standing cat.png',
  './images_library/table_cat.jpeg',
  './images_library/98e24af569e8f8dfb4391dbac0accb10_9edaab163f5e46e04be6a7ecb1dda7ae.webp',
  './images_library/Screen_Shot_2024-03-15_at_10.53.41_AM.webp'
];

// Function to get a random image from the library
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * imageLibrary.length);
  return imageLibrary[randomIndex];
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Trim the input to remove any leading/trailing whitespace
  const input = inputField.value.trim();
  if (!input) return;  // Do not proceed if input is empty after trimming

  loading.style.display = "block";
  memeContainer.style.display = "none";
  topCaptionDiv.textContent = "";
  bottomCaptionDiv.textContent = "";

  // Randomly select an image
  memeImage.src = getRandomImage();

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [{
        role: "user",
        parts: [{
          text: `Also, there must be NO cuss words. Your response should not be inappropriate. I have a cat meme image. I need you to generate a short caption for that. For context, I am a student so it should be study related. I have an image already, do not generate a new image. Your response should only be the words of text, do not include any other words or characters around it. This is what it should be based on: ${input}`
        }]
      }]
    });

    const caption = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (caption) {
      // Find the best place to split the text to avoid breaking words
      const middleIndex = Math.floor(caption.length / 2);
      let splitIndex = caption.lastIndexOf(' ', middleIndex); // Find the last space before the middle

      // If no space found, use the middle index
      if (splitIndex === -1) {
        splitIndex = middleIndex;
      }

      const topText = caption.slice(0, splitIndex).trim();
      const bottomText = caption.slice(splitIndex).trim();

      // Set the text content for both top and bottom captions
      topCaptionDiv.textContent = topText;
      bottomCaptionDiv.textContent = bottomText;

      memeContainer.style.display = "block";
    } else {
      topCaptionDiv.textContent = "Oops, Gemini didn't respond with text.";
    }
  } catch (err) {
    console.error("Error generating content:", err);
    topCaptionDiv.textContent = "An error occurred while generating the caption.";
  } finally {
    loading.style.display = "none";
  }
});
