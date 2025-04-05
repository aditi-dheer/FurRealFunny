const canvas = document.querySelector("#meme");
const form = document.getElementById("myForm");
const inputField = document.getElementById("userInput");
const loading = document.getElementById("loading");
const topTextInput = document.getElementById("top-caption");
const bottomTextInput = document.getElementById("bottom-caption");
import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm';

let image = new Image();
image.src = "src/catComputer1.jpg";

//ADITI
const ai = new GoogleGenAI({
    apiKey: "AIzaSyB4JK-5_NhWH3FpXrKZrvHYSVhiLn3zTbg"
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Trim the input to remove any leading/trailing whitespace
    const input = inputField.value.trim();
    if (!input) return;  // Do not proceed if input is empty after trimming

    loading.style.display = "block";
    topTextInput.textContent = "";
    bottomTextInput.textContent = "";

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
            topTextInput.textContent = topText;
            bottomTextInput.textContent = bottomText;

            // generate the image!
            updateMemeCanvas(canvas, image, topTextInput.textContent, bottomTextInput.textContent);
        } else {
            topTextInput.textContent = "Oops, Gemini didn't respond with text.";
        }
    } catch (err) {
        console.error("Error generating content:", err);
        topTextInput.textContent = "An error occurred while generating the caption.";
    } finally {
        loading.style.display = "none";
    }
});
// generate the image
function updateMemeCanvas(canvas, image, topText, bottomText) {
    const ctx = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;
    const fontSize = Math.floor(width / 19);
    const yOffset = height / 25;

    // Update canvas background
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);

    // Prepare text
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.floor(fontSize / 4);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.font = `${fontSize}px sans-serif`;

    // Add top text
    ctx.textBaseline = "top";
    ctx.strokeText(topText, width / 2, yOffset);
    ctx.fillText(topText, width / 2, yOffset);

    // Add bottom text
    ctx.textBaseline = "bottom";
    ctx.strokeText(bottomText, width / 2, height - yOffset);
    ctx.fillText(bottomText, width / 2, height - yOffset);
}