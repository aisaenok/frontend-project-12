import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { Button, Container, Card, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/useAuth.js'
import { loginRequest } from '../api.js'
import routes from '../utils/routes.js'
import buildLoginSchema from '../validation/buildLoginSchema.js'

function LoginPage() {
  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token)
  const [authFailed, setAuthFailed] = useState(false)
  const { t } = useTranslation()
  const auth = useAuth()

  const validationSchema = useMemo(() => buildLoginSchema(t), [t])

  if (token) {
    return <Navigate to={routes.chatPath()} replace />
  }

  const handleSubmit = (values, { setSubmitting }) => {
    setAuthFailed(false)

    loginRequest(values)
      .then((response) => {
        const { token: authToken } = response.data

        auth.signIn({
          token: authToken,
          username: values.username,
        })

        navigate(routes.chatPath(), { replace: true })
      })
      .catch(() => {
        setAuthFailed(true)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Container fluid className="h-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">{t('auth.login')}</Card.Title>

            {authFailed && (
              <Alert variant="danger">
                {t('auth.loginError')}
              </Alert>
            )}

            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      {t('auth.username')}
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                      autoComplete="off"
                    />
                    {touched.username && errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      {t('auth.password')}
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      autoComplete="off"
                    />
                    {touched.password && errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={isSubmitting}
                  >
                    {t('auth.login')}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>

          <Card.Footer className="text-center">
            {t('auth.noAccount')}
            {' '}
            <Link to={routes.signupPath()}>{t('auth.signup')}</Link>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  )
}

export default LoginPage
