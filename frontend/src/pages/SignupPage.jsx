import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { Button, Container, Card, Alert } from 'react-bootstrap'
import { signupRequest } from '../api.js'
import { setToken, setUsername } from '../utils/auth.js'
import { logIn } from '../slices/authSlice.js'

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: yup
    .string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmPassword: yup
    .string()
    .required('Обязательное поле')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
})

function SignupPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const [signupFailed, setSignupFailed] = useState(false)

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
          <Card.Title className="text-center mb-4">Регистрация</Card.Title>

          {signupFailed && (
            <Alert variant="danger">
              Пользователь с таким именем уже существует
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
                  <label htmlFor="username" className="form-label">Имя пользователя</label>
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
                  <label htmlFor="password" className="form-label">Пароль</label>
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
                  <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
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
                  Зарегистрироваться
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>

        <Card.Footer className="text-center">
          Уже есть аккаунт?
          {' '}
          <Link to="/login">Войти</Link>
        </Card.Footer>
      </Card>
    </Container>
  )
}

export default SignupPage
