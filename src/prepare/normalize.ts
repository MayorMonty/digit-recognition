import { BoundingBox } from "./locate";
import resize, { newDimensions } from "./resize";
import { getPixelData, augmentImageData, getPixelSum } from "../lib/imagedata";
import { sigmoid } from "../lib/smooth";

export function getBoxData({
  data,
  box
}: {
  data: CanvasRenderingContext2D;
  box: BoundingBox;
}) {
  // Get imagedata with some extra margin for better reading
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
  // Why is this so awful? Because .fill() and TypeScript downlevel iteration is messed up
  let output = [...new Array(28).fill(0)].map(() =>
    [...new Array(28).fill(0)].map(() => 0)
  );

  let boxData = getBoxData({ box, data });
  const newSize = newDimensions(boxData, 24);

  let block = {
    width: Math.round(boxData.width / newSize.width),
    height: Math.round(boxData.height / newSize.height)
  };

  // Center the array based on the new dimensions
  let y_center = Math.floor((28 - newSize.height) / 2);
  let x_center = Math.floor((28 - newSize.width) / 2);

  // Make boxes
  for (let x = 0; x <= newSize.width; x++) {
    for (let y = 0; y <= newSize.height; y++) {
      let importantCount = 0;

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
            importantCount++;
          }
        }
      }

      data.strokeStyle = "rgba(0, 0, 255, 0.3)";

      data.strokeRect(
        box.min.x + x * block.width,
        box.min.y + y * block.height,
        block.width,
        block.height
      );

      if (importantCount > 0.05 * block.width * block.height) {
        let antialias = sigmoid(
          importantCount / (block.width * block.height),
          5.8,
          0.1
        );

        output[x + x_center][y + y_center] = antialias * 255;

        data.fillStyle = `rgba(0, 0, 255, ${antialias})`;

        data.fillRect(
          box.min.x + x * block.width,
          box.min.y + y * block.height,
          block.width,
          block.height
        );
      }
    }
  }

  return output;
}
