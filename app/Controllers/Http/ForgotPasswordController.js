'use strict'

const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store({ request, response }) {
    const email = request.input('email')

    try {
      // OrFail retorna mensagem de erro
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?${user.token}`
        },
        (message) => {
          message
            .to(user.email)
            .from('enterprise@gmail.com', 'Enterprise')
            .subject('Recuperação de senha')
        }
      )
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Email not found' } })
    }
  }
}

module.exports = ForgotPasswordController
