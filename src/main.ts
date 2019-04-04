import DrawableCanvas from "./canvas";
import locate from "./analysis/locate";
import normalize, { getBoxData } from "./analysis/normalize";

/**
 * UI GLUE
 */

const canvas = document.querySelector("canvas#input") as HTMLCanvasElement;
const drawable = new DrawableCanvas(canvas, { width: 400, height: 400 });

const focus = (document.querySelector(
  "canvas#focus"
) as HTMLCanvasElement).getContext("2d");

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

  // Get input as a 20x20 array of booleans (for passing into NN)
  const mnist = normalize({ box, data: drawable.context });

  focus.fillStyle = "white";
  focus.fillRect(0, 0, focus.canvas.width, focus.canvas.height);

  focus.fillStyle = "black";

  for (let x = 0; x < mnist.length; x++) {
    for (let y = 0; y < mnist[x].length; y++) {
      if (mnist[x][y] === 0) continue;

      focus.fillRect(x * 3, y * 3, 3, 3);
    }
  }

  console.log(mnist);
});
