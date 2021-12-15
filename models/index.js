// @create-index this file is created by create-index.js.
import article from './article'
import base from './base'
import contact from './contact'
import images from './images'
import mongoose from './mongoose'
import password from './password'
import permission from './permission'
import user from './user'
import validators from './validators'

export { article, base, contact, images, mongoose, password, permission, user, validators }

const moduleList = {
  article,
  base,
  contact,
  images,
  mongoose,
  password,
  permission,
  user,
  validators
}

export default moduleList
