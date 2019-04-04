import { BoundingBox } from "./locate";
import resize, { newDimensions } from "./resize";

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
  const focus = (document.querySelector(
    "canvas#focus"
  ) as HTMLCanvasElement).getContext("2d");

  const boxData = getBoxData({ box, data });
  const newSize = newDimensions(boxData, 20);

  console.log(
    `Scale image from ${boxData.width}x${boxData.height} to ${newSize.width}x${
      newSize.height
    } (${newSize.scale * 100}%)`
  );

  const rescaled = resize(boxData, newSize);

  // Update canvas size to rescaled size
  focus.canvas.height = newSize.height;
  focus.canvas.width = newSize.width;

  // Zoom in a little
  focus.canvas.style.width = (newSize.width * 10).toString();
  focus.canvas.style.height = (newSize.height * 10).toString();

  focus.putImageData(rescaled, 0, 0);

  return [];
}
