import { Modal, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { toast } from 'react-toastify'
import { hideModal, resetModal } from '../../app/modalSlice.js'
import { channelRenamed } from '../../app/chatSlice.js'
import { useChatApi } from '../../contexts/useChatApi.js'
import buildChannelSchema from '../../validation/buildChannelSchema.js'
import cleanProfanity from '../../utils/cleanProfanity.js'

function RenameChannelModal() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const chatApi = useChatApi()

  const isOpen = useSelector(state => state.modal.isOpen)
  const channelId = useSelector(state => state.modal.extra?.channelId)
  const channels = useSelector(state => state.chat.channels)

  const channel = channels.find(item => item.id === channelId) ?? null
  const channelNames = channels
    .map(({ name }) => name)
    .filter(name => name !== channel?.name)

  const validationSchema = buildChannelSchema(t, channelNames)

  const closeModal = () => {
    dispatch(hideModal())
  }

  const handleExited = () => {
    dispatch(resetModal())
  }

  const handleSubmit = (payload) => {
    return chatApi.renameChannel(payload)
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
  }

  if (!channel) {
    return null
  }

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      onExited={handleExited}
      centered
    >
      <Formik
        enableReinitialize
        initialValues={{ name: channel.name }}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          const payload = {
            id: channel.id,
            name: cleanProfanity(values.name.trim()),
          }

          Promise.resolve(handleSubmit(payload))
            .then(() => {
              formikHelpers.resetForm()
            })
            .finally(() => {
              formikHelpers.setSubmitting(false)
            })
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit: submitForm,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={submitForm}>
            <Modal.Header closeButton>
              <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form.Group>
                <Form.Label htmlFor="channelName">
                  {t('modals.channelName')}
                </Form.Label>
                <Form.Control
                  id="channelName"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={touched.name && !!errors.name}
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {t('common.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
