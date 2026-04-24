import { Modal, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { toast } from 'react-toastify'
import { hideModal, resetModal } from '../../app/modalSlice.js'
import { channelAdded, setCurrentChannelId } from '../../app/chatSlice.js'
import { useChatApi } from '../../contexts/useChatApi.js'
import buildChannelSchema from '../../validation/buildChannelSchema.js'
import cleanProfanity from '../../utils/cleanProfanity.js'

function AddChannelModal() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const chatApi = useChatApi()

  const isOpen = useSelector(state => state.modal.isOpen)
  const channels = useSelector(state => state.chat.channels)

  const channelNames = channels.map(({ name }) => name)
  const validationSchema = buildChannelSchema(t, channelNames)

  const closeModal = () => {
    dispatch(hideModal())
  }

  const handleExited = () => {
    dispatch(resetModal())
  }

  const handleSubmit = (payload) => {
    return chatApi.addChannel(payload)
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
  }

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      onExited={handleExited}
      centered
    >
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          const payload = {
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
              <Modal.Title>{t('modals.addChannel')}</Modal.Title>
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

export default AddChannelModal
