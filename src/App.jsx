import { useCallback, useState } from 'react';
import { Button } from 'antd';
import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons';

import './App.css';
import SpeechListener from './components/SpeechListener';

const App = () => {
    const [isListening, setListening] = useState(false);

    const onChunk = useCallback((data) => {
        console.log({ data });
    }, []);

    const toggleListening = useCallback(() => {
        setListening((value => !value));
    }, [setListening]);

    return (
        <>
            <Button
                type="primary"
                danger={isListening}
                icon={isListening ? <PauseOutlined /> : <CaretRightOutlined /> }
                onClick={toggleListening}
            >
                {isListening ? 'Прекратить' : 'Начать'} слушать
            </Button>
        <SpeechListener isListening={isListening} onChunk={onChunk} />
        </>
    );
}

export default App
