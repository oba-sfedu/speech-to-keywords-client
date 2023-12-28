const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = 'ru-RU';
recognition.interimResults = true;

recognition.onaudioend = () => {
    console.log("Audio capturing ended");
};

recognition.onaudiostart = () => {
    console.log("Audio capturing started");
  };

recognition.onend = () => {
    console.log("Speech recognition service disconnected");
};

recognition.onerror = (event) => {
    console.error(`Speech recognition error detected: ${event.error}`);
};

recognition.onnomatch = () => {
    console.error("Speech not recognized");
};

recognition.onsoundend = () => {
    console.log("Sound has stopped being received");
};

recognition.onsoundstart = () => {
    console.log("Some sound is being received");
};

recognition.onspeechend = () => {
    console.log("Speech has stopped being detected");
};

recognition.onspeechstart = () => {
    console.log("Speech has been detected");
};

recognition.onstart = () => {
    console.log("Speech recognition service has started");
};

export default recognition;
