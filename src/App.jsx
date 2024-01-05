import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Flex, Row, Typography } from 'antd';
import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { socket } from './socket';

import './App.css';
import SpeechListener from './components/SpeechListener';

const App = () => {
    const [isListening, setListening] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [content, setContent] = useState([]);

    const onChunk = useCallback((data) => {
        socket.emit('audio', data);
    }, []);

    const toggleListening = useCallback(() => {
        setListening((value => !value));
    }, [setListening]);


    useEffect(() => {
        function onConnect() {
            console.info('socket connected');
            setIsConnected(true);
        }

        function onDisconnect() {
            console.info('socket disconnected');
            setIsConnected(false);
        }

        function onRecognized(value) {
            setContent((str) => str.concat(value));
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
            <Flex justify='center' >
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
            <Row>
                <Col span={16}>
                    <Typography.Paragraph>{content}</Typography.Paragraph>
                </Col>
            </Row>
        </>
    );
}

export default App
