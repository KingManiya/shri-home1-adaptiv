/////////
/**
 * @type {AudioContext}
 */
let context: AudioContext;

export default class AudioAnalyser {

    // Количество полос
    public bandsCount = 16;
    private source: MediaElementAudioSourceNode;
    private readonly analyser: AnalyserNode;
    private readonly bands: Uint8Array;
    private onUpdate?: (bands: Uint8Array) => void;
    private frame: number = 0;

    constructor(mediaElement: HTMLVideoElement) {
        if (!context) {
            // @ts-ignore
            const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
            context = new AudioContext();
        }
        this.source = context.createMediaElementSource(mediaElement);

        this.analyser = context.createAnalyser();
        this.analyser.fftSize = this.bandsCount * 2;
        this.analyser.smoothingTimeConstant = 0.85;

        this.bands = new Uint8Array(this.analyser.frequencyBinCount);

        this.connect();
    }

    private connect() {
        // Связываем источник и анализатором
        this.source.connect(this.analyser);

        // Связываем анализатор с аудио выходом
        this.analyser.connect(context.destination);

        const javascriptNode = context.createScriptProcessor(2048, 1, 1);

        this.analyser.connect(javascriptNode);
        javascriptNode.connect(context.destination);
    }

    public update() {
        if (this.onUpdate) {
            this.frame = requestAnimationFrame(this.update.bind(this));
            this.analyser.getByteFrequencyData(this.bands);
            this.onUpdate(this.bands);
        }
    }

    public addListener(onUpdate: (bands: Uint8Array) => void) {
        this.onUpdate = onUpdate;
        this.update();
    }

    public removeListener() {
        if (this.onUpdate) this.onUpdate = undefined;
        cancelAnimationFrame(this.frame);
    }
}