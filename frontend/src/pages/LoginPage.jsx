import { Formik, Form, Field } from 'formik';

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>

      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field id="username" name="username" type="text" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field id="password" name="password" type="password" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default LoginPage;