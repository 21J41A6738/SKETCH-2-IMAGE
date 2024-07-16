const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingHistory = [];

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

const undoButton = document.getElementById("undoButton");
undoButton.addEventListener("click", undoLastDrawing);

const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearCanvas);

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
  isDrawing = false;
  drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function undoLastDrawing() {
  if (drawingHistory.length > 0) {
    clearCanvas();
    drawingHistory.pop();
    drawingHistory.forEach((drawing) => {
      ctx.putImageData(drawing, 0, 0);
    });
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory = [];
}

async function generateImage() {
  const sketchFile = canvas.toDataURL();
  //   const sketchFile = document.getElementById("sketchFile").files[0];
  const promptText = document.getElementById("promptText").value;

  if (!sketchFile || !promptText) {
    alert("Please upload a sketch file and enter a prompt.");
    return;
  }

  const formData = new FormData();
  //   formData.append("sketch_file", sketchFile);
  const sketchBlob = await fetch(sketchFile).then((res) => res.blob());
  formData.append("sketch_file", sketchBlob, "sketch.png");
  formData.append("prompt", promptText);

  try {
    const response = await fetch(
      "https://clipdrop-api.co/sketch-to-image/v1/sketch-to-image",
      {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key":
            "f52debc7cbc6129ee10bd3e35b1cd22e0b683115515d92996a33f7a89867091bc1832614a08ec27ad6dcb4f5461a1340",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    const imageData = await response.blob();
    const imageUrl = URL.createObjectURL(imageData);
    const generatedImage = document.getElementById("generatedImage");
    const downBtn = document.getElementById("downBtn");
    generatedImage.src = imageUrl;
    generatedImage.style.display = "block";
    downBtn.style.display = "block";

    const remainingCredits = response.headers.get("x-remaining-credits");
    console.log(`Remaining Credits: ${remainingCredits}`);
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again.");
  }
}

async function generateFileImage() {
  // const sketchFile = canvas.toDataURL();
  const sketchFiles = document.getElementById("sketchFiles").files[0];
  const promptTexts = document.getElementById("promptTexts").value;

  if (!sketchFiles || !promptTexts) {
    alert("Please upload a sketch file and enter a prompt.");
    return;
  }

  const formData = new FormData();
  formData.append("sketch_file", sketchFiles);
  // const sketchBlob = await fetch(sketchFile).then((res) => res.blob());
  // formData.append("sketch_file", sketchBlob, "sketch.png");
  formData.append("prompt", promptTexts);

  try {
    const response = await fetch(
      "https://clipdrop-api.co/sketch-to-image/v1/sketch-to-image",
      {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key":
            "f52debc7cbc6129ee10bd3e35b1cd22e0b683115515d92996a33f7a89867091bc1832614a08ec27ad6dcb4f5461a1340",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    const imageData = await response.blob();
    const imageUrl = URL.createObjectURL(imageData);
    const generatedImage = document.getElementById("generatedImage");
    const downBtn = document.getElementById("downBtn");
    generatedImage.src = imageUrl;
    generatedImage.style.display = "block";
    downBtn.style.display = "block";

    const remainingCredits = response.headers.get("x-remaining-credits");
    console.log(`Remaining Credits: ${remainingCredits}`);
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again.");
  }
}

const downloadButton = document.getElementById("downBtn");
downloadButton.addEventListener("click", () => {
  const generatedImage = document.getElementById("generatedImage");
  const imageUrl = generatedImage.src;
  const downloadLink = document.createElement("a");
  downloadLink.href = imageUrl;
  downloadLink.download = "generated_image.jpg";
  downloadLink.click();
});
