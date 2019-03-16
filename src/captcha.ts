declare var grecaptcha: any
export function executeRecaptcha(action: string): Promise<string> {
  if (!action) {
    throw new Error('No action provided for reCaptcha')
  }

  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute('6Lf4t5cUAAAAAAXobYFKKYSQ0MHYIrvaHD1ISGEL', { action })
        .then(resolve)
    })
  })
}
