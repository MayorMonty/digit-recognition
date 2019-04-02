import DrawableCanvas from "./canvas";
import { BlobDetection } from "./analysis/blob";

/**
 * UI GLUE
 */

const canvas = document.querySelector("canvas#input") as HTMLCanvasElement;
const drawable = new DrawableCanvas(canvas, { width: 400, height: 400 });

// Assign buttons
document
  .getElementById("button-clear")
  .addEventListener("click", () => drawable.clear());

document.getElementById("button-analyze").addEventListener("click", () => {
  // ImageData
  const imagedata = drawable.export();
  const blobs = BlobDetection.find(imagedata);

  for (let blob of blobs) {
    blob.draw(drawable.context);
  }
});
