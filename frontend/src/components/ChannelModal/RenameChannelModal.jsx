import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { toast } from 'react-toastify'
import { hideModal, resetModal } from '../../app/modalSlice.js'
import { channelRenamed } from '../../app/chatSlice.js'
import { useChatApi } from '../../contexts/useChatApi.js'
import ChannelFormModal from './ChannelFormModal.jsx'

function RenameChannelModal() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const chatApi = useChatApi()

  const isOpen = useSelector(state => state.modal.isOpen)
  const channelId = useSelector(state => state.modal.extra?.channelId)
  const channels = useSelector(state => state.chat.channels)

  const channel = channels.find(item => item.id === channelId) ?? null

  const closeModal = () => {
    dispatch(hideModal())
  }

  const handleExited = () => {
    dispatch(resetModal())
  }

  if (!channel) {
    return null
  }

  const usedNames = channels
    .map(({ name }) => name)
    .filter(name => name !== channel.name)

  const handleSubmit = payload => chatApi.renameChannel({
    id: channel.id,
    name: payload.name,
  })
    .then((response) => {
      const renamedChannel = response?.data ?? response

      dispatch(channelRenamed(renamedChannel))
      toast.success(t('notifications.channelRenamed'))
      closeModal()
    })
    .catch((error) => {
      rollbar.error('Channel rename failed', error)
      toast.error(t('notifications.networkError'))
    })

  return (
    <ChannelFormModal
      show={isOpen}
      title={t('modals.renameChannel')}
      initialName={channel.name}
      usedNames={usedNames}
      onHide={closeModal}
      onExited={handleExited}
      onSubmit={handleSubmit}
    />
  )
}

export default RenameChannelModal
