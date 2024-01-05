import { useEffect, useRef } from 'react';
import hark from 'hark';
import Recorder from '../recorder';

const SpeechListener = ({ isListening, onChunk }) => {
    const recorderRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const func = async (isListening) => {
            if (recorderRef.current === null) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                recorderRef.current = new Recorder(stream);
                timeRef.current = Date.now();

                const speechEvents = hark(stream, {});
                speechEvents.on('speaking', () => {
                    console.info('speech start detected');
                });
                speechEvents.on('stopped_speaking', () => {
                    console.info('speech stop detected');
                    const now = Date.now();
                    if (now - timeRef.current > 2000) {
                        console.info('swap recorders');
                        recorderRef.current.swap();
                        timeRef.current = now;
                    }
                });

                recorderRef.current.ondataavailable = (e) => {
                    console.info(`recorded chunk, ${Math.round(e.timeStamp)/1000}s`);
                    const blob = new Blob([e.data], { type: "audio/webm" });
                    onChunk(blob);
                };
            }

            isListening ? recorderRef.current.start() : recorderRef.current.stop();
        }

        func(isListening);
    }, [isListening, onChunk]);
};

export default SpeechListener;
