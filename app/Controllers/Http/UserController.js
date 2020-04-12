'use strict'

const User = use('App/Models/User')

class UserController {
  // Recebe um objeto ctx: context
  async store({ request, response }) {
    // request.all() pega todos os atributos

    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }
}

module.exports = UserController
