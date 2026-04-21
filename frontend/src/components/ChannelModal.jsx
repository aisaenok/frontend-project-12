import { useMemo, useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useRollbar } from '@rollbar/react'
import { toast } from 'react-toastify'
import cleanProfanity from '../utils/cleanProfanity.js'
import { hideModal, resetModal } from '../slices/modalSlice.js'
import { channelAdded, channelRemoved, channelRenamed, setCurrentChannelId } from '../slices/chatSlice.js'
import { useChatApi } from '../contexts/ChatApiContext.jsx'

function ChannelModal() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const chatApi = useChatApi()

  const { isOpen, type, extra } = useSelector(state => state.modal)
  const channels = useSelector(state => state.chat.channels)

  const removeSubmitButtonRef = useRef(null)
  const [isRemoving, setIsRemoving] = useState(false)

  const channelId = extra?.channelId ?? null
  const channel = channels.find(item => item.id === channelId) ?? null

  const isRemove = type === 'remove'
  const isRename = type === 'rename'

  const title = isRemove
    ? t('modals.removeChannel')
    : isRename
      ? t('modals.renameChannel')
      : t('modals.addChannel')

  const closeModal = () => {
    dispatch(hideModal())
  }

  const handleExited = () => {
    dispatch(resetModal())
  }

  const channelNames = channels.map(({ name }) => name)
  const filteredNames = isRename
    ? channelNames.filter(name => name !== channel?.name)
    : channelNames

  const validationSchema = useMemo(() => yup.object({
    name: yup
      .string()
      .trim()
      .required(t('common.required'))
      .min(3, t('modals.channelNameLength'))
      .max(20, t('modals.channelNameLength'))
      .notOneOf(filteredNames, t('modals.uniqueChannelName')),
  }), [filteredNames, t])

  const initialValues = {
    name: isRename ? channel?.name ?? '' : '',
  }

  const handleSubmit = (payload) => {
    if (type === 'add') {
      return chatApi.addChannel(payload).then((response) => {
        const createdChannel = response?.data ?? response

        dispatch(channelAdded(createdChannel))
        dispatch(setCurrentChannelId(createdChannel.id))
        toast.success(t('notifications.channelCreated'))
        closeModal()
      }).catch((error) => {
        rollbar.error('Channel create failed', error)
        toast.error(t('notifications.networkError'))
      })
    }

    if (type === 'rename') {
      return chatApi.renameChannel(payload).then((response) => {
        const renamedChannel = response?.data ?? response

        dispatch(channelRenamed(renamedChannel))
        toast.success(t('notifications.channelRenamed'))
        closeModal()
      }).catch((error) => {
        rollbar.error('Channel rename failed', error)
        toast.error(t('notifications.networkError'))
      })
    }

    if (type === 'remove') {
      return chatApi.removeChannel(payload).then(() => {
        dispatch(channelRemoved(payload))
        toast.success(t('notifications.channelRemoved'))
        closeModal()
      }).catch((error) => {
        rollbar.error('Channel remove failed', error)
        toast.error(t('notifications.networkError'))
      })
    }

    return Promise.resolve()
  }

  if (isRemove) {
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
            <Modal.Title>{title}</Modal.Title>
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

  return (
    <Modal show={isOpen} onHide={closeModal} centered>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          const sanitizedName = cleanProfanity(values.name.trim())

          const payload = isRename
            ? { id: channel.id, name: sanitizedName }
            : { name: sanitizedName }

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
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label htmlFor="channelName">{t('modals.channelName')}</Form.Label>
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

export default ChannelModal
