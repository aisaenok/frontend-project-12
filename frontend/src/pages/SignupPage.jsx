import { useMemo, useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { Button, Container, Card, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { signupRequest } from '../api.js'
import { setToken, setUsername } from '../utils/auth.js'
import { logIn } from '../slices/authSlice.js'

function SignupPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const [signupFailed, setSignupFailed] = useState(false)
  const { t } = useTranslation()

  const validationSchema = useMemo(() => yup.object({
    username: yup
      .string()
      .required(t('common.required'))
      .min(3, t('auth.usernameLength'))
      .max(20, t('auth.usernameLength')),
    password: yup
      .string()
      .required(t('common.required'))
      .min(6, t('auth.passwordLength')),
    confirmPassword: yup
      .string()
      .required(t('common.required'))
      .oneOf([yup.ref('password')], t('auth.passwordsMustMatch')),
  }), [t])

  if (token) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (values, { setSubmitting }) => {
    setSignupFailed(false)

    signupRequest({
      username: values.username,
      password: values.password,
    })
      .then((response) => {
        const { token: authToken, username } = response.data

        setToken(authToken)
        setUsername(username)

        dispatch(logIn({
          token: authToken,
          username,
        }))

        navigate('/', { replace: true })
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
    <Container className="h-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-sm" style={{ width: '24rem' }}>
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
                  {t('auth.signup')}
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>

        <Card.Footer className="text-center">
          {t('auth.hasAccount')}
          {' '}
          <Link to="/login">{t('auth.login')}</Link>
        </Card.Footer>
      </Card>
    </Container>
  )
}

export default SignupPage
