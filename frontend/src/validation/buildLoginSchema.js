import * as yup from 'yup'

const buildLoginSchema = t => yup.object({
  username: yup
    .string()
    .required(t('common.required')),
  password: yup
    .string()
    .required(t('common.required')),
})

export default buildLoginSchema
