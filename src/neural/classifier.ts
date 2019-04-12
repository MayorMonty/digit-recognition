import * as tf from "@tensorflow/tfjs";

export default class MNISTClassier {
  model: tf.Sequential;

  async loadModel() {
    this.model = (await tf.loadLayersModel(
      "/src/neural/model.json"
    )) as tf.Sequential;

    return this.model;
  }

  predict(image: number[][]) {
    const tensor = tf.tensor(image);

    return tf.tidy(() => {
      let output = this.model.predict(tensor);

      if (output instanceof Array) {
        output = output[0];
      }

      const axis = 1;
      const predictions = Array.from(output.argMax(axis).dataSync());

      return predictions;
    });
  }
}
