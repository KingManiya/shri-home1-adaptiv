export default class MoveDetector {

    dataSet = [];
    currentData = [];
    prevData = [];

    change = [];

    step;
    x;
    y;
    pixel;

    constructor(width, height, frameForAnalise, stepX, stepY, threshold, onCheck) {
        this.width = width;
        this.height = height;
        this.frameForAnalise = frameForAnalise;
        this.stepX = stepX;
        this.stepY = stepY;
        this.threshold = threshold;
        this.onCheck = onCheck;
    }


    addData(data) {
        this.dataSet.push(data);

        this.left = 9999999;
        this.top = 9999999;
        this.right = 0;
        this.bottom = 0;

        this.change = [];
        for (this.step = this.frameForAnalise - 1; this.step--;) {
            //Проверка нужного количества кадров
            this.check(this.step + 2);
        }
        this.onCheck(this.change, [this.left, this.top, this.right - this.left, this.bottom - this.top]);

        //Очистка старых кадров
        if (this.dataSet.length > this.frameForAnalise - 1) {
            this.dataSet.shift();
        }
    }

    check(step) {
        this.currentData = this.dataSet[this.dataSet.length - 1];
        this.prevData = this.dataSet[this.dataSet.length - step] || [];

        this.pixel = 0;

        for (this.y = 0; this.y < this.height; this.y += this.stepY) {
            for (this.x = 0; this.x < this.width; this.x += this.stepX) {
                this.pixel = this.y * this.width * 4 + this.x * 4;

                if (Math.abs(this.prevData[this.pixel] - this.currentData[this.pixel]) > this.threshold) {
                    this.change.push([this.x, this.y]);

                    if (this.x < this.left) this.left = this.x;
                    if (this.x > this.right) this.right = this.x;
                    if (this.y < this.top) this.top = this.y;
                    if (this.y > this.bottom) this.bottom = this.y;
                }
                // if (Math.abs(this.prevData[this.pixel+1] - this.currentData[this.pixel+1]) > this.threshold) {
                //     this.change.push([this.x,this.y]);
                // }
                // if (Math.abs(this.prevData[this.pixel+2] - this.currentData[this.pixel+2]) > this.threshold) {
                //     this.change.push([this.x,this.y]);
                // }
            }
        }

    }
}