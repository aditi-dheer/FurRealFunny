const canvas = document.querySelector("#meme");
const form = document.getElementById("myForm");
const inputField = document.getElementById("userInput");
const loading = document.getElementById("loading");
const topTextInput = document.getElementById("top-caption");
const bottomTextInput = document.getElementById("bottom-caption");
import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm';

let image = new Image();

//ADITI
const ai = new GoogleGenAI({
    apiKey: "AIzaSyB4JK-5_NhWH3FpXrKZrvHYSVhiLn3zTbg"
});

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
    topTextInput.textContent = "";
    bottomTextInput.textContent = "";

    image.src = getRandomImage(); // get random cat image
    console.log(image.src);
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

            // Set the text content for both top and bottom captions
            topTextInput.textContent = caption.slice(0, splitIndex).trim();
            bottomTextInput.textContent = caption.slice(splitIndex).trim();

            // generate the image!
            updateMemeCanvas(canvas, image, topTextInput.textContent, bottomTextInput.textContent);
            enableDownload();
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
    const fontSize = Math.floor(width / 17);
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
};

const downloadBtn = document.getElementById("downloadBtn");

function enableDownload() {
    downloadBtn.style.display = "inline-block"; // Show the button
    downloadBtn.onclick = function () {
        const link = document.createElement("a");
        link.download = "mcat_meme.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
}