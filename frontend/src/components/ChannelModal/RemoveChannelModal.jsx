import { useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { toast } from 'react-toastify'
import { hideModal, resetModal } from '../../app/modalSlice.js'
import { channelRemoved } from '../../app/chatSlice.js'
import { useChatApi } from '../../contexts/useChatApi.js'

function RemoveChannelModal() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const chatApi = useChatApi()

  const isOpen = useSelector(state => state.modal.isOpen)
  const channelId = useSelector(state => state.modal.extra?.channelId)
  const channels = useSelector(state => state.chat.channels)

  const channel = channels.find(item => item.id === channelId) ?? null

  const [isRemoving, setIsRemoving] = useState(false)
  const removeSubmitButtonRef = useRef(null)

  const closeModal = () => {
    dispatch(hideModal())
  }

  const handleExited = () => {
    dispatch(resetModal())
  }

  const handleSubmit = (payload) => {
    return chatApi.removeChannel(payload)
      .then(() => {
        dispatch(channelRemoved(payload))
        toast.success(t('notifications.channelRemoved'))
        closeModal()
      })
      .catch((error) => {
        rollbar.error('Channel remove failed', error)
        toast.error(t('notifications.networkError'))
      })
  }

  if (!channel) {
    return null
  }

  const handleRemoveSubmit = (event) => {
    event.preventDefault()
    setIsRemoving(true)

    Promise.resolve(handleSubmit({ id: channel.id }))
      .finally(() => {
        setIsRemoving(false)
      })
  }

  return (
    <Modal
      show={isOpen}
      onHide={isRemoving ? undefined : closeModal}
      onEntered={() => {
        removeSubmitButtonRef.current?.focus()
      }}
      onExited={handleExited}
      centered
    >
      <Form onSubmit={handleRemoveSubmit}>
        <Modal.Header closeButton={!isRemoving}>
          <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{t('modals.confirmRemove')}</Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeModal}
            disabled={isRemoving}
          >
            {t('common.cancel')}
          </Button>
          <Button
            ref={removeSubmitButtonRef}
            type="submit"
            variant="danger"
            disabled={isRemoving}
          >
            {t('common.remove')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RemoveChannelModal
