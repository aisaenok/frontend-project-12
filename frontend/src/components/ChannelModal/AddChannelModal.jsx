import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { toast } from 'react-toastify'
import { hideModal, resetModal } from '../../app/modalSlice.js'
import { channelAdded, setCurrentChannelId } from '../../app/chatSlice.js'
import { useChatApi } from '../../contexts/useChatApi.js'
import ChannelFormModal from './ChannelFormModal.jsx'

function AddChannelModal() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const chatApi = useChatApi()

  const isOpen = useSelector(state => state.modal.isOpen)
  const channels = useSelector(state => state.chat.channels)

  const closeModal = () => {
    dispatch(hideModal())
  }

  const handleExited = () => {
    dispatch(resetModal())
  }

  const handleSubmit = payload => chatApi.addChannel(payload)
    .then((response) => {
      const createdChannel = response?.data ?? response

      dispatch(channelAdded(createdChannel))
      dispatch(setCurrentChannelId(createdChannel.id))
      toast.success(t('notifications.channelCreated'))
      closeModal()
    })
    .catch((error) => {
      rollbar.error('Channel create failed', error)
      toast.error(t('notifications.networkError'))
    })

  return (
    <ChannelFormModal
      show={isOpen}
      title={t('modals.addChannel')}
      initialName=""
      usedNames={channels.map(({ name }) => name)}
      onHide={closeModal}
      onExited={handleExited}
      onSubmit={handleSubmit}
    />
  )
}

export default AddChannelModal
