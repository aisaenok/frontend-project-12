import { useMemo, useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { Button, Container, Card, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { signupRequest } from '../api.js'
import { useAuth } from '../contexts/useAuth.js'
import routes from '../utils/routes.js'
import buildSignupSchema from '../validation/buildSignupSchema.js'

function SignupPage() {
  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token)
  const [signupFailed, setSignupFailed] = useState(false)
  const { t } = useTranslation()
  const auth = useAuth()

  const validationSchema = useMemo(() => buildSignupSchema(t), [t])

  if (token) {
    return <Navigate to={routes.chatPath()} replace />
  }

  const handleSubmit = (values, { setSubmitting }) => {
    setSignupFailed(false)

    signupRequest({
      username: values.username,
      password: values.password,
    })
      .then((response) => {
        const { token: authToken, username } = response.data

        auth.signIn({
          token: authToken,
          username,
        })

        navigate(routes.chatPath(), { replace: true })
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          setSignupFailed(true)
        }
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
            <Card.Title className="text-center mb-4">{t('auth.signup')}</Card.Title>

            {signupFailed && (
              <Alert variant="danger">
                {t('auth.signupError')}
              </Alert>
            )}

            <Formik
              initialValues={{ username: '', password: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      {t('auth.usernameFull')}
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                      autoComplete="username"
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
                      autoComplete="new-password"
                    />
                    {touched.password && errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      {t('auth.confirmPassword')}
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                      autoComplete="new-password"
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                    {t('auth.signupSubmit')}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>

          <Card.Footer className="text-center">
            {t('auth.hasAccount')}
            {' '}
            <Link to={routes.loginPath()}>{t('auth.login')}</Link>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  )
}

export default SignupPage
