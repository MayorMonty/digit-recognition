/**
 * Inspirations:
 * https://github.com/GoogleChromeLabs/squoosh/blob/master/codecs/resize/src/lib.rs
 * https://github.com/arahaya/ImageFilters.js/
 */

import { getPixelSum, augmentImageData } from "../lib/imagedata";

/**
 * Implements k-nearest neighbor resampling
 * @param image ImageData to manipulate
 * @param scale Scale to perform on
 */
export default function resize(
  image: ImageData,
  dimensions: { width: number; height: number }
): ImageData {
  let output = new ImageData(dimensions.width, dimensions.height);

  // Get rescale factors
  let xfactor = image.width / dimensions.width,
    yfactor = image.height / dimensions.height;

  // Our place in the output UInt8Array
  let outputPointer = 0;

  // Go through each pixel in the output space
  for (let y = 0; y < dimensions.height; y++) {
    // Offset in the image's UInt8Array
    let offset = ((y * yfactor) | 0) * image.width;
    for (let x = 0; x < dimensions.width; x++) {
      // Pick the first pixel in the area
      let start = (offset + x * xfactor) << 2;

      output.data[outputPointer] = image.data[start];
      output.data[outputPointer + 1] = image.data[start + 1];
      output.data[outputPointer + 2] = image.data[start + 2];
      output.data[outputPointer + 3] = image.data[start + 3];

      // Advance the pointer to the next pixel
      outputPointer += 4;
    }
  }

  return output;
}

/**
 * Gets the scale to resize an image to given a specific maximum dimension
 * @param image
 * @param maxDimension
 */
export function newDimensions(
  image: ImageData,
  maxDimension: number
): { width: number; height: number; scale: number } {
  const scale = maxDimension / Math.max(image.height, image.width);

  return {
    width: image.width * scale,
    height: image.height * scale,
    scale
  };
}
