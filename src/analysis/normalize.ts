import { BoundingBox } from "./locate";
import resize, { newDimensions } from "./resize";
import { getPixelData, augmentImageData, getPixelSum } from "../lib/imagedata";

export function getBoxData({
  data,
  box
}: {
  data: CanvasRenderingContext2D;
  box: BoundingBox;
}) {
  // Create an offscreen canvas
  return data.getImageData(
    box.min.x,
    box.min.y,
    box.max.x - box.min.x,
    box.max.y - box.min.y
  );
}

/**
 * Prepares the found box to be tested against MNIST's dataset of 20x20 pixels
 * Extracts imagedata and resizes to 20x20 preserving aspect ratio
 */
export default function normalize({
  data,
  box
}: {
  data: CanvasRenderingContext2D;
  box: BoundingBox;
}): number[][] {
  let output = [...new Array(20).fill(0)].map(() =>
    [...new Array(20).fill(0)].map(() => 0)
  );

  let boxData = getBoxData({ box, data });
  const newSize = newDimensions(boxData, 20);

  let block = {
    width: Math.floor(boxData.width / newSize.width),
    height: Math.floor(boxData.height / newSize.height)
  };

  // Make boxes
  for (let x = 0; x < newSize.width; x++) {
    for (let y = 0; y < newSize.height; y++) {
      let hasImportantPixel = false;

      // If the block this region represents has an important pixel, we'll want to fill it in
      for (
        let sx = Math.floor(x * block.width);
        sx < (x + 1) * block.width;
        sx++
      ) {
        for (
          let sy = Math.floor(y * block.height);
          sy < (y + 1) * block.height;
          sy++
        ) {
          let sum = getPixelSum(boxData, sx, sy);
          if (sum > 0) {
            hasImportantPixel = true;
          }
        }
      }

      data.strokeStyle = "blue";
      data.fillStyle = "rgba(0, 0, 255, 0.5)";

      if (hasImportantPixel) {
        console.log(x, y, "hasImportantPixel");
        data.fillRect(
          box.min.x + x * block.width,
          box.min.y + y * block.height,
          block.width,
          block.height
        );
        console.log(x, y, output[x]);
        output[x][y] = 1;
      }
    }
  }

  return output;
}
