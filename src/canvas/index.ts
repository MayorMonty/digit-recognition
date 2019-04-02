export default class DrawableCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  settings = {
    brush: 5,
    painting: false
  };

  events = {
    pointerDown: (event: MouseEvent) => {
      let x = event.pageX - this.canvas.offsetLeft;
      let y = event.pageY - this.canvas.offsetTop;

      this.settings.painting = true;
      this.context.beginPath();
      this.context.moveTo(x, y);
    },
    pointerMove: (event: MouseEvent | TouchEvent) => {
      if (!this.settings.painting) return;

      if (event instanceof MouseEvent) {
        let x = event.pageX - this.canvas.offsetLeft;
        let y = event.pageY - this.canvas.offsetTop;
        this.strokedown(x, y);
      } else {
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          let touch = touches.item(i);
          this.strokedown(
            touch.pageX - this.canvas.offsetLeft,
            touch.pageY - this.canvas.offsetHeight
          );
        }
      }
    },
    pointerUp: (event: MouseEvent) => {
      console.log("pointerUp");
      this.strokeup();
    }
  };

  constructor(
    canvas: HTMLCanvasElement,
    { width, height }: { width: number; height: number }
  ) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    // Set dimensions
    this.canvas.width = width;
    this.canvas.height = height;

    // Add drawing listeners
    this.canvas.addEventListener("mousedown", this.events.pointerDown);
    this.canvas.addEventListener("touchstart", this.events.pointerDown);

    this.canvas.addEventListener("mouseup", this.events.pointerUp);
    this.canvas.addEventListener("touchup", this.events.pointerUp);

    this.canvas.addEventListener("mousemove", this.events.pointerMove);
    this.canvas.addEventListener("touchend", this.events.pointerMove);
  }

  strokedown(x: number, y: number) {
    this.settings.painting = true;

    this.context.strokeStyle = "#1a1a1a";
    this.context.lineJoin = "round";
    this.context.lineWidth = 5;

    this.context.lineTo(x, y);

    this.context.stroke();
  }

  strokeup() {
    this.context.closePath();
    this.settings.painting = false;
  }

  // Buttons
  clear() {
    this.context.strokeStyle = "white";
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Export ImageData
  export(): ImageData {
    return this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}
