<meta name='viewport' content='width=device-width, initial-scale=1'/><style>/* css/styles.css */

/* Reset and basic styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #f7f7f7;
  color: #333;
  line-height: 1.6;
}

/* Header styling */
header {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #fff;
  padding: 20px;
  text-align: center;
}
header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}
header nav ul {
  list-style: none;
  display: flex;
  justify-content: center;
}
header nav ul li {
  margin: 0 15px;
}
header nav ul li a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

/* Main section styling */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}
#upload-section {
  margin-bottom: 30px;
  text-align: center;
}
#upload-section input[type="file"] {
  padding: 10px;
  margin: 10px;
  font-size: 1em;
}
#controls {
  margin: 20px 0;
}
#controls label {
  margin: 0 5px;
  font-weight: bold;
}
#controls input[type="range"] {
  width: 150px;
  margin: 0 10px;
}
#action-buttons button {
  padding: 10px 20px;
  margin: 10px 5px;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  background-color: #2575fc;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}
#action-buttons button:hover {
  background-color: #6a11cb;
}

/* Canvas preview styling */
#preview-section {
  border: 2px solid #ddd;
  background: #fff;
  padding: 10px;
}
#photoCanvas {
  max-width: 100%;
  height: auto;
}

/* Footer styling */
footer {
  background: #333;
  color: #ccc;
  text-align: center;
  padding: 15px;
  width: 100%;
  bottom: 0;
  position: fixed;
}

@media(min-width: 768px) {
  main {
    width: 80%;
    margin: 0 auto;
  }
}</style><script>// js/script.js

// Global variables for canvas, context, and the original image
const canvas = document.getElementById('photoCanvas');
const ctx = canvas.getContext('2d');
let originalImage = null;
let originalImageData = null; // To store the original canvas data for reset

// Elements for user controls
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const previewBtn = document.getElementById('previewBtn');
const resetBtn = document.getElementById('resetBtn');
const fileInput = document.getElementById('photoUpload');

// Handle file upload: Load image, draw on canvas, and save the original image data
fileInput.addEventListener('change', function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Resize canvas based on image dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw image and save the original image and image data for resetting
      ctx.drawImage(img, 0, 0);
      originalImage = img;
      originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Function to apply brightness and contrast adjustments
function applyAdjustments() {
  if (!originalImageData) {
    alert("Please upload an image first!");
    return;
  }
  
  // Retrieve slider values
  const brightness = parseInt(brightnessSlider.value, 10); // Value in range [-100, 100]
  const contrast = parseFloat(contrastSlider.value);         // Value in range [0, 3]

  // Create a new ImageData object to modify without affecting the original
  let imageData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );
  let data = imageData.data;

  // Loop over each pixel and adjust brightness and contrast
  // The formula for contrast adjustment: newValue = ((oldValue - 128) * contrast) + 128
  for (let i = 0; i < data.length; i += 4) {
    // Increase brightness
    data[i]     = data[i]     + brightness; // Red
    data[i + 1] = data[i + 1] + brightness; // Green
    data[i + 2] = data[i + 2] + brightness; // Blue

    // Apply contrast adjustment
    data[i]     = ((data[i]     - 128) * contrast) + 128;
    data[i + 1] = ((data[i + 1] - 128) * contrast) + 128;
    data[i + 2] = ((data[i + 2] - 128) * contrast) + 128;
  }

  // Draw the adjusted image data onto the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Event listener for the preview adjustments button
previewBtn.addEventListener('click', applyAdjustments);

// Reset the canvas to the original image data
resetBtn.addEventListener('click', function() {
  if (!originalImageData) {
    return;
  }
  ctx.putImageData(originalImageData, 0, 0);
  // Optionally, reset slider values to defaults
  brightnessSlider.value = 20;
  contrastSlider.value = 1.1;
});

/*
  Future Enhancements and Integration Points:

  1. Advanced Processing with OpenCV.js:
     - Uncomment the OpenCV.js script in index.html.
     - Replace or supplement basic adjustments with OpenCV functions.
     Example:
       let src = cv.imread(canvas);
       cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
       cv.imshow(canvas, src);
       src.delete();

  2. Deep Learning with TensorFlow.js:
     - Uncomment the TensorFlow.js script in index.html.
     - Load a pre-trained model for tasks like super-resolution or style transfer.
     Example:
       const model = await tf.loadGraphModel('model.json');
       // Process the canvas image tensor and apply model predictions

  3. Web Workers for Performance:
     - Move heavy image processing operations into a separate thread using Web Workers.
     - This approach keeps the UI responsive, especially for high-resolution images.
*/</script>