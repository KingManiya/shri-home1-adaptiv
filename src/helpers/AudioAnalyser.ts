/////////
/**
 * @type {AudioContext}
 */
let context = null;

export default class AudioAnalyser {

    //Количество полос
    bandsCount = 16;

    constructor(mediaElement) {
        if (!context) {
            let AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
            context = new AudioContext();
        }

        this.source = context.createMediaElementSource(mediaElement);

        this.createAnalyser();

        this.connect();
    }

    createAnalyser() {
        this.analyser = context.createAnalyser();
        this.analyser.fftSize = this.bandsCount * 2;
        this.analyser.smoothingTimeConstant = 0.85;

        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
    }

    connect() {
        //Связываем источник и анализатором
        this.source.connect(this.analyser);

        //Связываем анализатор с аудио выходом
        this.analyser.connect(context.destination);

        let javascriptNode = context.createScriptProcessor(2048, 1, 1);

        this.analyser.connect(javascriptNode);
        javascriptNode.connect(context.destination);
    }

    update() {
        if (this.onUpdate) {
            this.frame = requestAnimationFrame(this.update.bind(this));
            this.analyser.getByteFrequencyData(this.bands);
            this.onUpdate(this.bands);
        }
    }

    addListener(onUpdate) {
        this.onUpdate = onUpdate;
        this.update();
    }

    removeListener() {
        this.onUpdate = null;
        cancelAnimationFrame(this.frame);
    }
}