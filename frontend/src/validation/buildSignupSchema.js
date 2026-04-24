import * as yup from 'yup'

const buildSignupSchema = t => yup.object({
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
})

export default buildSignupSchema
