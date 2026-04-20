import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { fetchChatData } from '../slices/chatSlice.js';
import { logOut } from '../slices/authSlice.js';
import { removeToken, removeUsername } from '../utils/auth.js';

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    channels,
    messages,
    currentChannelId,
    status,
    error,
  } = useSelector((state) => state.chat);

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChatData());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (error === 'unauthorized') {
      removeToken();
      removeUsername();
      dispatch(logOut());
      navigate('/login', { replace: true });
    }
  }, [dispatch, error, navigate]);

  if (status === 'loading') {
    return (
      <Container className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (status === 'failed' && error !== 'unauthorized') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Не удалось загрузить данные чата
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="h-100 py-3">
      <Row className="h-100">
        <Col xs={4} md={3} className="border-end">
          <Card className="h-100">
            <Card.Header>Каналы</Card.Header>
            <ListGroup variant="flush">
              {channels.map((channel) => (
                <ListGroup.Item
                  key={channel.id}
                  active={channel.id === currentChannelId}
                >
                  #{channel.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col xs={8} md={9}>
          <Card className="h-100">
            <Card.Header>
              <b>{currentChannel ? `# ${currentChannel.name}` : 'Чат'}</b>
              <div className="text-muted small">
                {currentMessages.length} сообщений
              </div>
            </Card.Header>

            <Card.Body className="overflow-auto">
              <ListGroup variant="flush">
                {currentMessages.map((message) => (
                  <ListGroup.Item key={message.id} className="border-0 px-0">
                    <b>{message.username}</b>
                    {': '}
                    {message.body}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>

            <Card.Footer>
              <Form>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Введите сообщение..."
                    disabled
                  />
                  <Button type="submit" disabled>
                    Отправить
                  </Button>
                </div>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatPage;