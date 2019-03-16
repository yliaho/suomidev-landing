const cors = require('cors')
const Isemail = require('isemail')
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')
const rp = require('request-promise')

const mailTransport = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SG_PASSWORD
    }
  })
)

exports.sendMail = (req, res) => {
  const corsMiddleware = cors()
  corsMiddleware(req, res, async function() {
    try {
      // Validate email
      if (!Isemail.validate(req.body.from)) {
        res.status(500).send({ error: 'Sähköposti on virheellinen.' })
        return
      }

      // If the text is 500 letters or over, send error.
      if (req.body.text.length > 500) {
        res
          .status(500)
          .send({ error: 'Viestin pituus ei voi ylittää 500 kirjainta.' })
        return
      }

      //Do recapthca check (Returns promise)
      const recaptcha = await rp({
        uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
        method: 'POST',
        formData: {
          secret: process.env.RC_SECRET_KEY,
          response: req.body['g-recaptcha-response']
        },
        json: true
      })

      if (!recaptcha.success) {
        res
          .status(500)
          .send({
            error: 'Recaptcha ei täyttänyt vaatimuksia. Yritä uudelleen.'
          })
        return
      }

      await mailTransport.sendMail({
        from: 'suomidev contact form <joonas.yliaho@gmail.com>',
        to: `joonas.yliaho@gmail.com`,
        subject: 'suomidev contact form',
        html: `<p><b>Email</b> ${req.body.from}</p><br>` + `${req.body.text}`
      })

      res.status(200).send(true)
    } catch (err) {
      res.status(500).send({ error: err, data: req.body })
    }
  })
}
