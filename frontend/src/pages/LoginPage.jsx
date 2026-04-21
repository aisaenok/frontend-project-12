import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { Button, Container, Card, Alert } from 'react-bootstrap'
import { setToken, setUsername } from '../utils/auth.js'
import { logIn } from '../slices/authSlice.js'
import { loginRequest } from '../api.js'

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const [authFailed, setAuthFailed] = useState(false)

  if (token) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (values, { setSubmitting }) => {
    setAuthFailed(false)

    loginRequest(values)
      .then((response) => {
        const { token: authToken } = response.data

        setToken(authToken)
        setUsername(values.username)

        dispatch(logIn({
          token: authToken,
          username: values.username,
        }))

        navigate('/', { replace: true })
      })
      .catch(() => {
        setAuthFailed(true)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Container className="h-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-sm" style={{ width: '24rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Войти</Card.Title>

          {authFailed && (
            <Alert variant="danger">
              Неверные имя пользователя или пароль
            </Alert>
          )}

          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Ваш ник
                  </label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className="form-control"
                    autoComplete="username"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    autoComplete="current-password"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  Войти
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
        <Card.Footer className="text-center">
          Нет аккаунта?
          {' '}
          <Link to="/signup">Регистрация</Link>
        </Card.Footer>
      </Card>
    </Container>
  )
}

export default LoginPage
