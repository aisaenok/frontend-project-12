const hasRollbarToken = Boolean(import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN)

const rollbarConfig = hasRollbarToken
  ? {
      accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: import.meta.env.VITE_APP_ENV || 'development',
    }
  : {
      enabled: false,
      captureUncaught: false,
      captureUnhandledRejections: false,
      payload: {
        environment: 'test',
      },
    }

export default rollbarConfig
