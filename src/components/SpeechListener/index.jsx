import { useEffect, useRef } from 'react';
import hark from 'hark';

const SpeechListener = ({ isListening, onChunk }) => {
    const mediaRecorderRef = useRef(null);

    useEffect(() => {
        if (mediaRecorderRef.current) {
            if (isListening && mediaRecorderRef.current.state !== 'recording') {
                mediaRecorderRef.current.start();
            } else if (!isListening && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        }
    }, [isListening])

    useEffect(() => {
        navigator.getUserMedia({ audio: true }, (stream) => {
            const speechEvents = hark(stream, {});

            mediaRecorderRef.current = new MediaRecorder(stream);

            speechEvents.on('stopped_speaking', () => {
                console.log('stopped_speaking', mediaRecorderRef.current.state)
                if (mediaRecorderRef.current.state === 'recording')
                    mediaRecorderRef.current.requestData();
            });

            mediaRecorderRef.current.ondataavailable = (e) => {
                console.log('ondataavailable')
                onChunk(e.data)
            };

        }, function(error) {
            console.error(JSON.stringify(error));
        });
    }, [onChunk]);
};

export default SpeechListener;
