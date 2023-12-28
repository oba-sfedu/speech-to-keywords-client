import { useCallback, useEffect, useState } from 'react'
import { Col, Row, Button, Card, Typography } from 'antd';
import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import sr from './speechRecognition';

import './App.css'

const ROW_GUTTER = [32, 32];

const App = () => {
    const [isListening, setListening] = useState(false);
    const [content, setContent] = useState('');
    const [currentLine, setCurrentLine] = useState('');

    useEffect(() => {
        sr.onresult = onSRResult;
    }, []);

    const toggleListening = useCallback(() => {
        isListening ? sr.stop() : sr.start();
        setListening(!isListening);
    }, [isListening, setListening]);

    const onSRResult = useCallback((result) => {
        const { transcript } = result.results[result.resultIndex][0];
        if (result.results[result.resultIndex].isFinal) {
            setContent((data) => data.concat(transcript))
            setCurrentLine('');
        } else {
            setCurrentLine(transcript);
        }
    }, [setContent]);

    return (
        <>
            <Row gutter={ROW_GUTTER}>
                <Col span={24}>
                    <Button
                        type="primary"
                        danger={isListening}
                        icon={isListening ? <PauseOutlined /> : <CaretRightOutlined /> }
                        onClick={toggleListening}
                    >
                        {isListening ? 'Прекратить' : 'Начать'} слушать
                    </Button>
                </Col>
            </Row>
            <br/>
            <Row gutter={ROW_GUTTER}>
                <Col span={16}>
                    <Card title="Текст" bordered={false}>
                        <Typography.Text>{content}</Typography.Text>
                        <Typography.Text>{currentLine}</Typography.Text>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Ключевые слова" bordered={false}>
                        Слово, Слоооово?
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default App
