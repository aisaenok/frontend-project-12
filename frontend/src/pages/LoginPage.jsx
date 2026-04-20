import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { Button, Container, Card, Alert } from 'react-bootstrap';
import { isAuthenticated, setToken } from '../utils/auth.js';

function LoginPage() {
  const navigate = useNavigate();
  const [authFailed, setAuthFailed] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (values, { setSubmitting }) => {
    setAuthFailed(false);

    axios.post('/api/v1/login', values)
      .then((response) => {
        const { token } = response.data;
        setToken(token);
        navigate('/', { replace: true });
      })
      .catch(() => {
        setAuthFailed(true);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

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
      </Card>
    </Container>
  );
}

export default LoginPage;