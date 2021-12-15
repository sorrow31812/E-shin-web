const routes = {
  // 首頁
  'get /homepage': 'homePage.find',
  'post /homepage': 'homePage.add',
  'put /homepage': 'homePage.update',
  'delete /homepage': 'homePage.delete',

  // 文字通告
  'get /notify': 'notify.find',
  'post /notify': 'notify.add',
  'put /notify': 'notify.update',
  'delete /notify/:id': 'notify.delete',

  // 關於我們
  'get /aboutus': 'aboutus.find',
  'post /aboutus': 'aboutus.add',
  'put /aboutus': 'aboutus.update',
  'delete /aboutus': 'aboutus.delete',

  // 活動預告上方文字
  'get /title': 'title.find',
  'post /title': 'title.add',
  'put /title': 'title.update',
  'delete /title': 'title.delete',

  // 活動預告
  'get /notice': 'notice.find',
  'get /notice/expired': 'notice.expired',
  'post /notice': 'notice.add',
  'put /notice': 'notice.update',
  'delete /notice/:id': 'notice.delete',

  // 聯絡我們
  'get /contact': 'contact.find',
  'post /contact': 'contact.add',
  'put /contact': 'contact.update',
  'delete /contact/:id': 'contact.delete',

  // 新增或修改使用者
  'get /user': 'user.find',
  'get /user/:id': 'user.findOne',
  'post /user': 'user.add',
  'put /user': 'user.update',
  'delete /user/:id': 'user.delete',

  // 圖片相關api
  'get /images': 'images.find',
  'post /images': 'images.add',
  // 'put /images': 'images.update',
  'delete /images/:id': 'images.delete',

  // 登入、登出
  'post /login': {
    controller: 'signin',
    action: 'in',
    middleware: []
  },
  'post /logout': {
    controller: 'signin',
    action: 'out',
    middleware: []
  }

  // 'post /signin/:type': {
  //   controller: 'signin',
  //   action: 'signin',
  //   middleware: []
  // }
}

export default routes
