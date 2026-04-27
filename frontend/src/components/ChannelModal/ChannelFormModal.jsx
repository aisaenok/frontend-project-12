import { Modal, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import buildChannelSchema from '../../validation/buildChannelSchema.js'
import cleanProfanity from '../../utils/cleanProfanity.js'

function ChannelFormModal({
  show,
  title,
  initialName,
  usedNames,
  onHide,
  onExited,
  onSubmit,
}) {
  const { t } = useTranslation()

  const validationSchema = buildChannelSchema(t, usedNames)

  return (
    <Modal
      show={show}
      onHide={onHide}
      onExited={onExited}
      centered
    >
      <Formik
        enableReinitialize
        initialValues={{ name: initialName }}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          const payload = {
            name: cleanProfanity(values.name.trim()),
          }

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

export default ChannelFormModal
