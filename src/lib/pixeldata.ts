/**
 * Utilites to analyze image data
 */

// Gets the sum of the red, green, blue and alpha pixel values for a specific pixel
export function getPixelSum(data: ImageData, x: number, y: number) {
  let start = y * (data.width * 4) + x * 4;
  return data.data.slice(start, start + 3).reduce((a, b) => a + b);
}

export function getPixelData(data: ImageData, x: number, y: number) {
  let start = y * (data.width * 4) + x * 4;
  return {
    red: data.data[start],
    green: data.data[start + 1],
    blue: data.data[start + 2],
    alpha: data.data[start + 3]
  };
}
