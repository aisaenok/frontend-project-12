import { useSelector } from 'react-redux'
import AddChannelModal from './AddChannelModal.jsx'
import RenameChannelModal from './RenameChannelModal.jsx'
import RemoveChannelModal from './RemoveChannelModal.jsx'

function ChannelModal() {
  const { type } = useSelector(state => state.modal)

  if (type === 'add') {
    return <AddChannelModal />
  }

  if (type === 'rename') {
    return <RenameChannelModal />
  }

  if (type === 'remove') {
    return <RemoveChannelModal />
  }

  return null
}

export default ChannelModal
