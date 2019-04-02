/**
 * Blob Detection implemented in TypeScript
 * This implementation was inspired by Daniel Shiffman's Coding Train Tutorial on Blob Detection
 * https://www.youtube.com/watch?v=ce-2l2wRqO8
 */

export namespace BlobDetection {
  export class Blob {
    // Keeps track of top left and bottom right corners of blob
    min = {
      x: 0,
      y: 0
    };

    center = {
      x: 0,
      y: 0
    };

    max = {
      x: 0,
      y: 0
    };

    constructor(x: number, y: number) {
      // Initalize a blob starting on the first detected pixel
      this.min.x = this.center.x = this.max.x = x;
      this.min.y = this.center.y = this.max.y = y;
    }

    /**
     * Checks if a pixel is "near" to a blob
     * @param tx x coordinate to check
     * @param ty y coordinate to check
     * @param threshold Threshold for comparison
     */
    dist(tx: number, ty: number) {
      return (this.center.x - tx) ** 2 + (this.center.y - ty) ** 2;
    }

    /**
     * Expands the blobs dimensions to accomodate a new pixel
     * @param x x coordinate to add
     * @param y y coordinate to add
     */
    accomodate(x: number, y: number) {
      // Recalculate extremes
      this.min.x = Math.min(x - 8, this.min.x);
      this.min.y = Math.min(y - 8, this.min.y);

      this.max.x = Math.max(x + 8, this.max.x);
      this.max.y = Math.max(y + 8, this.max.y);

      // Recalculate the center
      this.center.x = (this.min.x + this.max.x) / 2;
      this.center.y = (this.min.y + this.max.y) / 2;
    }

    /**
     * "Debug" feature, shows blob area on context
     * @param context context to show blob on
     */
    draw(context: CanvasRenderingContext2D) {
      context.strokeStyle = "green";
      context.lineWidth = 2;
      context.strokeRect(
        this.min.x,
        this.min.x,
        this.max.x - this.min.x,
        this.max.y - this.min.y
      );
    }
  }

  /**
   * Analyzes ImageData for blobs (imagedata can be exported from canvas)
   * Note that, since this module assumes that images are primarily white with black backgrounds, there does
   * not need to be any specific color detection
   * @param image ImageData to search
   */
  export function find(image: ImageData): Blob[] {
    let blobs: Blob[] = [];

    function getColorData(image: ImageData, x: number, y: number) {
      let red = y * (image.width * 4) + x * 4;
      return {
        red: image.data[red],
        green: image.data[red + 1],
        blue: image.data[red + 2],
        alpha: image.data[red + 3]
      };
    }

    // Iterate through all pixels in image
    for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {
        // See if the pixel is relevant (i.e. or at least, darker)
        let { red, green, blue } = getColorData(image, x, y);
        if (red + green + blue > 50) {
          // This pixel is of interest! Now we need to organize them into groups
          let found = false;

          let minDistance = 100 ** 2;
          let selected: Blob;

          // Search through blobs, add this pixel to the nearest one if its close enought
          for (let blob of blobs) {
            const dist = blob.dist(x, y);
            if (dist < minDistance) {
              minDistance = dist;
              found = true;
              selected = blob;
            }
          }

          // No Blob Applies, let's create a new one
          if (found) {
            selected.accomodate(x, y);
          } else {
            blobs.push(new Blob(x, y));
          }
        }
      }
    }

    // Only deal with large blobs, as smaller blobs tend to just get in the way
    return blobs.filter(
      blob => blob.max.x - blob.min.x > 50 && blob.max.y - blob.min.y > 50
    );
  }
}
