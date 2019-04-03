import { getPixelSum } from "../lib/pixeldata";

/**
 * Detects the character bounds for centering/resizing
 **/

/**
 * Represents box around character
 */
export interface BoundingBox {
  min: {
    x: number;
    y: number;
  };
  max: {
    x: number;
    y: number;
  };
}

/**
 * Iterates through
 * @param data Image to search
 */
export default function locate(
  data: ImageData
): { box: BoundingBox; data: ImageData } {
  let box: BoundingBox = {
    min: { x: data.width, y: data.height },
    max: { x: 0, y: 0 }
  };

  for (let x = 0; x < data.width; x++) {
    for (let y = 0; y < data.height; y++) {
      // Pixel is sufficiently dark
      if (getPixelSum(data, x, y) > 0) {
        // Expand the bounding box to fit this new pixel
        box.min.x = Math.min(x, box.min.x);
        box.min.y = Math.min(y, box.min.y);

        box.max.x = Math.max(x, box.max.x);
        box.max.y = Math.max(y, box.max.y);

        // Make sufficiently dark pixels red
        data.data[y * (data.width * 4) + x * 4] = 255;
      }
    }
  }

  return { box, data };
}
