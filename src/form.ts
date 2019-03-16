import { executeRecaptcha } from './captcha'

export async function handleSubmit(e: Event) {
  e.preventDefault()

  if (currentState.step === 'pending') {
    return
  }

  try {
    setState({ step: 'pending' })
    await sendMail(e.target)
    setState({ step: 'success' })
  } catch (error) {
    setState({ step: 'error', error })
    console.error(error)
  }
}

async function sendMail(target) {
  const from = target.querySelector('#from').value
  const text = target.querySelector('#text').value
  const rToken = await executeRecaptcha('contact')

  return fetch('https://us-central1-suomidev.cloudfunctions.net/sendMail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, text, 'g-recaptcha-response': rToken })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        throw new Error(res.error)
      }
    })
}

function createFlashElFragment(
  templateQuerySelector: string,
  message: string = ''
) {
  if (!('content' in document.createElement('template'))) {
    new Error('Browser does not support HTMLTemplateElement.')
    return
  }

  const template = document.querySelector(
    templateQuerySelector
  ) as HTMLTemplateElement
  template.content.querySelector('span').textContent = message
  return document.importNode(template.content, true)
}

type Step = 'initial' | 'pending' | 'success' | 'error'

interface ICurrentState {
  step: Step
  error?: Error
}

let currentState: ICurrentState = {
  step: 'initial'
}

const formElement = document.querySelector('form#contactForm')
const formStateElement = document.querySelector('.form-state-wrapper')
const submitButton = document.querySelector(
  'button[type="submit"]'
) as HTMLButtonElement

function setState(newState: ICurrentState) {
  currentState = newState
  formStateElement.innerHTML = ''

  try {
    switch (newState.step) {
      case 'initial':
        submitButton.disabled = false
        break
      case 'pending':
        submitButton.disabled = true
        formStateElement.appendChild(
          createFlashElFragment(
            'template.t-pending-flash',
            'Lähetetään viestiä...'
          )
        )
        return 'pending'
      case 'success':
        submitButton.disabled = true

        formStateElement.appendChild(
          createFlashElFragment(
            'template.t-response-flash',
            'Kiitos! Viestisi on lähetetty.'
          )
        )
        return 'success'
      case 'error':
        submitButton.disabled = false
        formStateElement.appendChild(
          createFlashElFragment('.t-response-flash', newState.error.message)
        )
        return 'error'
    }
  } catch (err) {
    console.error(err)
  }
}
