/**
 * Utilites to analyze image data
 */

// Gets the sum of the red, green, blue and alpha pixel values for a specific pixel
export function getPixelSum(image: ImageData, x: number, y: number) {
  let start = y * (image.width * 4) + x * 4;
  return image.data.slice(start, start + 3).reduce((a, b) => a + b);
}

export function getPixelData(image: ImageData, x: number, y: number) {
  let start = y * (image.width * 4) + x * 4;
  return {
    red: image.data[start],
    green: image.data[start + 1],
    blue: image.data[start + 2],
    alpha: image.data[start + 3]
  };
}

export function augmentImageData(
  image: ImageData,
  x: number,
  y: number,
  {
    red,
    green,
    blue,
    alpha
  }: { red: number; green: number; blue: number; alpha: number }
): ImageData {
  let start = y * (image.width * 4) + x * 4;

  image.data[start] = red;
  image.data[start + 1] = green;
  image.data[start + 2] = blue;
  image.data[start + 3] = alpha;

  return image;
}
