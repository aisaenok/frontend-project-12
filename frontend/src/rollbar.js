import Rollbar from 'rollbar'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: import.meta.env.VITE_APP_ENV || 'development',
}

const rollbar = new Rollbar(rollbarConfig)

export default rollbar
export { rollbarConfig }
