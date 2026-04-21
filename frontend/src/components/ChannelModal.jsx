import { useMemo } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

function ChannelModal({
  show,
  type,
  channel,
  channels,
  onHide,
  onSubmit,
}) {
  const { t } = useTranslation()
  const isRemove = type === 'remove'
  const isRename = type === 'rename'
  const title = isRemove
    ? t('modals.removeChannel')
    : isRename
      ? t('modals.renameChannel')
      : t('modals.addChannel')

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

  if (isRemove) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('modals.confirmRemove')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => onSubmit({ id: channel.id })}
          >
            {t('common.remove')}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          const payload = isRename
            ? { id: channel.id, name: values.name.trim() }
            : { name: values.name.trim() }

          Promise.resolve(onSubmit(payload))
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
          handleSubmit,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Control
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
              <Button variant="secondary" onClick={onHide}>
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
