import { useRollbar } from '@rollbar/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import cleanProfanity from '../utils/cleanProfanity.js'
import { useAuth } from '../contexts/useAuth.js'
import { useChatApi } from '../contexts/useChatApi.js'
import routes from '../utils/routes.js'
import { fetchChatData, setCurrentChannelId } from '../app/chatSlice.js'
import { showModal } from '../app/modalSlice.js'

function ChatPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [messageBody, setMessageBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState(false)

  const messageInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const username = useSelector(state => state.auth.username)

  const { t } = useTranslation()

  const rollbar = useRollbar()

  const auth = useAuth()

  const chatApi = useChatApi()

  const {
    channels,
    messages,
    currentChannelId,
    status,
    error,
  } = useSelector(state => state.chat)

  const currentChannel = channels.find(channel => channel.id === currentChannelId)
  const currentMessages = messages.filter(message => message.channelId === currentChannelId)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChatData())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (error === 'unauthorized') {
      auth.signOut()
      navigate(routes.loginPath(), { replace: true })
    }
  }, [auth, error, navigate])

  useEffect(() => {
    messageInputRef.current?.focus()
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentChannelId])

  useEffect(() => {
    if (status === 'failed' && error !== 'unauthorized') {
      rollbar.error('Chat data loading failed', { error })

      toast.error(
        error === 'network'
          ? t('notifications.networkError')
          : t('notifications.loadError'),
        { toastId: 'chat-load-error' },
      )
    }
  }, [status, error, t, rollbar])

  const handleMessageSubmit = (event) => {
    event.preventDefault()

    const trimmedBody = messageBody.trim()

    if (!trimmedBody) {
      return
    }

    const sanitizedBody = cleanProfanity(trimmedBody)

    setSendError(false)
    setIsSending(true)

    const payload = {
      body: sanitizedBody,
      channelId: currentChannelId,
      username,
    }

    chatApi.sendMessage(payload)
      .then(() => {
        setMessageBody('')
      })
      .catch((error) => {
        setSendError(true)
        rollbar.error('Message sending failed', error)
        toast.error(t('notifications.sendError'), { toastId: 'send-message-error' })
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  const openAddModal = () => {
    dispatch(showModal({ type: 'add' }))
  }

  const openRenameModal = (channel) => {
    dispatch(showModal({
      type: 'rename',
      extra: { channelId: channel.id },
    }))
  }

  const openRemoveModal = (channel) => {
    dispatch(showModal({
      type: 'remove',
      extra: { channelId: channel.id },
    }))
  }

  if (status === 'loading') {
    return (
      <Container className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  if (status === 'failed' && error !== 'unauthorized') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {t('chat.loadError')}
        </Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="h-100 py-3">
      <Row className="h-100">
        <Col xs={4} md={3} className="border-end h-100">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>{t('chat.channels')}</span>
              <Button variant="outline-primary" size="sm" onClick={openAddModal}>
                +
              </Button>
            </Card.Header>

            <ListGroup variant="flush">
              {channels.map((channel) => {
                if (!channel.removable) {
                  return (
                    <ListGroup.Item key={channel.id} className="p-0 border-0">
                      <Button
                        variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                        className="w-100 text-start rounded-0 border-0"
                        onClick={() => dispatch(setCurrentChannelId(channel.id))}
                      >
                        {`# ${channel.name}`}
                      </Button>
                    </ListGroup.Item>
                  )
                }

                return (
                  <ListGroup.Item key={channel.id} className="p-0 border-0">
                    <Dropdown as={ButtonGroup} className="w-100">
                      <Button
                        variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                        className="w-100 text-start rounded-0 border-0 text-truncate"
                        onClick={() => dispatch(setCurrentChannelId(channel.id))}
                      >
                        {`# ${channel.name}`}
                      </Button>

                      <Dropdown.Toggle
                        split
                        variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                        className="rounded-0 border-0"
                        aria-label={t('modals.channelManagement')}
                      >
                        <span className="visually-hidden">{t('modals.channelManagement')}</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => openRenameModal(channel)}>
                          {t('modals.renameAction')}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => openRemoveModal(channel)}>
                          {t('modals.removeAction')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Card>
        </Col>

        <Col xs={8} md={9} className="h-100">
          <Card className="h-100 d-flex flex-column">
            <Card.Header>
              <b>{currentChannel ? `# ${currentChannel.name}` : t('chat.fallbackTitle')}</b>
              <div className="text-muted small">
                {currentMessages.length}
                {' '}
                {t('chat.messagesCount')}
              </div>
            </Card.Header>

            <Card.Body className="overflow-auto flex-grow-1">
              <ListGroup variant="flush">
                {currentMessages.map(message => (
                  <ListGroup.Item key={message.id} className="border-0 px-0 text-break">
                    <b>{message.username}</b>
                    {': '}
                    {message.body}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div ref={messagesEndRef} />
            </Card.Body>

            <Card.Footer>
              {sendError && (
                <Alert variant="danger" className="mb-2">
                  {t('chat.sendError')}
                </Alert>
              )}

              <Form onSubmit={handleMessageSubmit}>
                <div className="d-flex gap-2">
                  <Form.Control
                    aria-label={t('chat.newMessage')}
                    autoComplete="off"
                    ref={messageInputRef}
                    type="text"
                    placeholder={t('chat.messagePlaceholder')}
                    value={messageBody}
                    onChange={event => setMessageBody(event.target.value)}
                    disabled={isSending}
                  />
                  <Button type="submit" disabled={isSending}>
                    {t('chat.send')}
                  </Button>
                </div>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ChatPage
