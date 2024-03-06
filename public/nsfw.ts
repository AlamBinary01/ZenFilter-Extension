import * as tf from '@tensorflow/tfjs';

tf.enableProdMode();

export class NsfwSpy {
    private imageSize: number;
    private modelPath: string;
    private model: tf.GraphModel | null;

    constructor(modelPath: string) {
        this.imageSize = 224;
        this.modelPath = modelPath;
        this.model = null;
    }

    async load(loadOptions?: tf.io.LoadOptions) {
        this.model = await tf.loadGraphModel(this.modelPath, loadOptions);
    }

    async classifyImage(image: ImageData | HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
        const outputs = tf.tidy(() => {
            if (!this.model) throw new Error("The NsfwSpy model has not been loaded yet.");

            // Convert the image to a tensor
            const decodedImage = tf.browser.fromPixels(image, 3)
                .toFloat()
                .div(tf.scalar(255)); // Normalize the image

            // Resize the image to match the input expectation of the model
            const resizedImage = tf.image.resizeBilinear(decodedImage as tf.Tensor3D, [this.imageSize, this.imageSize], true);
            const tensor = resizedImage.reshape([1, this.imageSize, this.imageSize, 3]); // Add the batch dimension

            // Execute the model
            return this.model.execute(
                { 'import/input': tensor },
                ['Score']
            ) as tf.Tensor2D;
        });

        const data = await outputs.data();
        outputs.dispose();

        return new NsfwSpyResult(data);
    }

    // New method to load an image with CORS compliance and classify it
    async classifyImageUrl(imageUrl: string) {
    // Change the URL to your server's fetchImage endpoint
    const proxyUrl = `http://localhost:5000/fetchImage`;
    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch image through proxy');
    }

    const blob = await response.blob();
    const imageElement = await this.createImageElementFromBlob(blob);
    return this.classifyImage(imageElement);
}

    // Helper method to load an image with CORS settings
    async createImageElementFromBlob(blob: Blob): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Set CORS policy
            const url = URL.createObjectURL(blob);
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img); // TypeScript now knows this resolves to HTMLImageElement
            };
            img.onerror = (e) => reject(e);
            img.src = url;
        });
    }
}

export class NsfwSpyResult {
    hentai: number;
    neutral: number;
    pornography: number;
    sexy: number;
    predictedLabel: ClassificationTypes;

    constructor(results: Float32Array | Int32Array | Uint8Array) {
        this.hentai = results[0];
        this.neutral = results[1];
        this.pornography = results[2];
        this.sexy = results[3];
        // Determine the label with the highest score
        const dictionary = this.toDictionary();
        this.predictedLabel = dictionary[0].key as ClassificationTypes;
    }

    get isNsfw() {
        return this.neutral < 0.5;
    }

    toDictionary() {
        return [
            { key: "hentai", value: this.hentai },
            { key: "neutral", value: this.neutral },
            { key: "pornography", value: this.pornography },
            { key: "sexy", value: this.sexy }
        ].sort((a, b) => b.value - a.value);
    }
}

export type ClassificationTypes = "hentai" | "neutral" | "pornography" | "sexy";
