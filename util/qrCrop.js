const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');

// Load an image and detect QR code
async function detectAndCropQRCode(imagePath, outputPath) {
    // Load the image
    try {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, image.width, image.height);

        // Detect QR code
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (!qrCode) {
            throw "qrnotfound";
        }

        console.log("QR Code detected:", qrCode.data);

        // Get QR code boundaries
        const { topLeftCorner, topRightCorner, bottomLeftCorner } = qrCode.location;
        const width = Math.abs(topRightCorner.x - topLeftCorner.x);
        const height = Math.abs(bottomLeftCorner.y - topLeftCorner.y);

        // Crop the QR code area
        const cropCanvas = createCanvas(width, height);
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(
            image,
            topLeftCorner.x, topLeftCorner.y, // Source start position
            width, height,                   // Source dimensions
            0, 0,                            // Destination start position
            width, height                    // Destination dimensions
        );

        // Save the cropped QR code image
        const buffer = cropCanvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        console.log(`Cropped QR code saved to ${outputPath}`);
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

// Usage
// detectAndCropQRCode('input_image.png', 'cropped_qr_code.png');

exports.detectAndCropQRCode = detectAndCropQRCode;
