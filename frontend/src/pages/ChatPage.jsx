import { useEffect, useState } from 'react'
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
import { fetchChatData, messageReceived, setCurrentChannelId, channelAdded, channelRemoved, channelRenamed } from '../slices/chatSlice.js'
import { logOut } from '../slices/authSlice.js'
import { removeToken, removeUsername } from '../utils/auth.js'
import {
  connectSocket,
  subscribeToNewMessages,
  subscribeToNewChannels,
  subscribeToRemovedChannels,
  subscribeToRenamedChannels,
  disconnectSocket,
  sendMessage,
  addChannel,
  removeChannelRequest,
  renameChannelRequest,
} from '../socket.js'
import ChannelModal from '../components/ChannelModal.jsx'
import cleanProfanity from '../utils/cleanProfanity.js'

function ChatPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [messageBody, setMessageBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState(false)

  const [modalType, setModalType] = useState(null)
  const [modalChannel, setModalChannel] = useState(null)

  const username = useSelector(state => state.auth.username)

  const { t } = useTranslation()

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
      removeToken()
      removeUsername()
      dispatch(logOut())
      navigate('/login', { replace: true })
    }
  }, [dispatch, error, navigate])

  useEffect(() => {
    connectSocket()

    const unsubscribeMessages = subscribeToNewMessages((payload) => {
      dispatch(messageReceived(payload))
    })

    const unsubscribeChannels = subscribeToNewChannels((payload) => {
      console.log('newChannel received', payload)
      dispatch(channelAdded(payload))
    })

    const unsubscribeRemoved = subscribeToRemovedChannels((payload) => {
      console.log('removeChannel received', payload)
      dispatch(channelRemoved(payload))
    })

    const unsubscribeRenamed = subscribeToRenamedChannels((payload) => {
      console.log('renameChannel received', payload)
      dispatch(channelRenamed(payload))
    })

    return () => {
      unsubscribeMessages()
      unsubscribeChannels()
      unsubscribeRemoved()
      unsubscribeRenamed()
      disconnectSocket()
    }
  }, [dispatch])

  useEffect(() => {
    if (status === 'failed' && error !== 'unauthorized') {
      toast.error(
        error === 'network'
          ? t('notifications.networkError')
          : t('notifications.loadError'),
        { toastId: 'chat-load-error' },
      )
    }
  }, [status, error, t])

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

    sendMessage(payload)
      .then(() => {
        setMessageBody('')
      })
      .catch(() => {
        setSendError(true)
        toast.error(t('notifications.sendError'), { toastId: 'send-message-error' })
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  const openAddModal = () => {
    setModalType('add')
    setModalChannel(null)
  }

  const openRenameModal = (channel) => {
    setModalType('rename')
    setModalChannel(channel)
  }

  const openRemoveModal = (channel) => {
    setModalType('remove')
    setModalChannel(channel)
  }

  const closeModal = () => {
    setModalType(null)
    setModalChannel(null)
  }

  const handleModalSubmit = (payload) => {
    if (modalType === 'add') {
      return addChannel(payload).then((response) => {
        const createdChannel = response?.data ?? response

        dispatch(channelAdded(createdChannel))
        dispatch(setCurrentChannelId(createdChannel.id))
        toast.success(t('notifications.channelCreated'))
        closeModal()
      }).catch(() => {
        toast.error(t('notifications.networkError'))
      })
    }

    if (modalType === 'rename') {
      return renameChannelRequest(payload).then((response) => {
        const renamedChannel = response?.data ?? response

        dispatch(channelRenamed(renamedChannel))
        toast.success(t('notifications.channelRenamed'))
        closeModal()
      }).catch(() => {
        toast.error(t('notifications.networkError'))
      })
    }

    if (modalType === 'remove') {
      return removeChannelRequest(payload).then(() => {
        dispatch(channelRemoved(payload))
        toast.success(t('notifications.channelRemoved'))
        closeModal()
      }).catch(() => {
        toast.error(t('notifications.networkError'))
      })
    }

    return Promise.resolve()
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
    <>
      <Container fluid className="h-100 py-3">
        <Row className="h-100">
          <Col xs={4} md={3} className="border-end">
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
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => openRenameModal(channel)}>
                            Переименовать
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => openRemoveModal(channel)}>
                            Удалить
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>
            </Card>
          </Col>

          <Col xs={8} md={9}>
            <Card className="h-100">
              <Card.Header>
                <b>{currentChannel ? `# ${currentChannel.name}` : 'Чат'}</b>
                <div className="text-muted small">
                  {currentMessages.length}
                  {' '}
                  сообщений
                </div>
              </Card.Header>

              <Card.Body className="overflow-auto">
                <ListGroup variant="flush">
                  {currentMessages.map(message => (
                    <ListGroup.Item key={message.id} className="border-0 px-0 text-break">
                      <b>{message.username}</b>
                      {': '}
                      {message.body}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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

      <ChannelModal
        show={modalType !== null}
        type={modalType}
        channel={modalChannel}
        channels={channels}
        onHide={closeModal}
        onSubmit={handleModalSubmit}
      />
    </>
  )
}

export default ChatPage
