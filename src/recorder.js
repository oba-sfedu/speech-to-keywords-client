class Recorder {
    constructor(stream) {
        this.stream = stream;
        this.activeRecorder = new MediaRecorder(stream);
        this.activeRecorder.id = 1;
        this.spareRecorder = new MediaRecorder(stream);
        this.spareRecorder.id = 2;
        this.recorders = [this.activeRecorder, this.spareRecorder];
        this.recorders.forEach((recorder) => {
            recorder.ondataavailable = (e) => {
                if (this.ondataavailable)
                    this.ondataavailable(e)
            };
        });
    }

    start() {
        if (this.activeRecorder.state !== 'recording')
            this.activeRecorder.start();
    }

    swap() {
        this.activeRecorder.stop();
        this.recorders.push(this.recorders.shift());
        this.activeRecorder = this.recorders[0];
        this.spareRecorder = this.recorders[1];
        this.activeRecorder.start();
    }

    stop() {
        this.recorders.forEach((recorder) => {
            if (recorder.state === 'recording')
                recorder.stop();

            this.stream.getTracks().forEach((track) => {
                track.stop();
            });
        });
    }
}

export default Recorder;
