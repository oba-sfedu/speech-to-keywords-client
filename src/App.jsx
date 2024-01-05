import { useCallback, useEffect, useState } from 'react';
import { Button, Flex } from 'antd';
import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { socket } from './socket';
import { nanoid } from 'nanoid';
import Highlighter from 'react-highlight-words';

import './App.css';
import SpeechListener from './components/SpeechListener';

const App = () => {
    const [isListening, setListening] = useState(false);
    const [sessionId, setSessionId] = useState();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [content, setContent] = useState('');
    const [keywords, setKeywords] = useState([]);

    const onChunk = useCallback((data) => {
        socket.emit('audio', { sessionId, data });
    }, [sessionId]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            setListening(false);
            setSessionId(null);
        } else {
            setListening(true);
            setSessionId(nanoid());
            setContent('');
            setKeywords([]);
        }
    }, [isListening, setSessionId, setListening]);


    useEffect(() => {
        function onConnect() {
            console.info('socket connected');
            setIsConnected(true);
        }

        function onDisconnect() {
            console.info('socket disconnected');
            setIsConnected(false);
        }

        function onRecognized(message) {
            setContent((str) => str.concat(message.recognized));
            setKeywords(message.keywords);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('recognized', onRecognized);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('recognized', onRecognized);
        };
    }, []);

    return (
        <>
            <SpeechListener isListening={isListening} onChunk={onChunk} />
            <Flex justify='center'>
                <Button
                    type="primary"
                    danger={isListening}
                    disabled={!isConnected && !isListening}
                    icon={isListening ? <PauseOutlined /> : <CaretRightOutlined /> }
                    onClick={toggleListening}
                >
                    {isListening ? 'Прекратить' : 'Начать'} слушать
                </Button>
            </Flex>
            <br/>
            <Flex justify='center'>
                <Highlighter
                    className='highlighted-content'
                    searchWords={keywords}
                    textToHighlight={content}
                >
                </Highlighter>
            </Flex>
        </>
    );
}

export default App
