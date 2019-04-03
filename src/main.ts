import DrawableCanvas from "./canvas";
import locate from "./analysis/locate";
import normalize, { getBoxData } from "./analysis/normalize";

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
  const { box, data } = locate(imagedata);

  drawable.context.putImageData(data, 0, 0);

  drawable.context.moveTo(0, 0);

  drawable.context.strokeStyle = "green";
  drawable.context.lineWidth = 2;
  drawable.context.strokeRect(
    box.min.x - 2,
    box.min.y - 2,
    box.max.x - box.min.x + 4,
    box.max.y - box.min.y + 4
  );

  const boxdata = normalize({ box, data: drawable.context });
});
