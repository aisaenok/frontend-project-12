import * as yup from 'yup'

const buildChannelSchema = (t, names) => yup.object({
  name: yup
    .string()
    .trim()
    .required(t('common.required'))
    .min(3, t('modals.channelNameLength'))
    .max(20, t('modals.channelNameLength'))
    .notOneOf(names, t('modals.uniqueChannelName')),
})

export default buildChannelSchema
