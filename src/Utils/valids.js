class Valid {
  constructor() {
    // 手机号

    this.phone = {
        reg: /^1[3456789]\d{9}$/,
        msg: '请输入正确的手机号'
      },
      // 密码
      this.password = {
        reg: /^(?=.*[A-Z]+).{6,16}$/,
        msg: '密码必须含有大写字母'
      },
      // 用户名
      this.userName = {
        reg: /^[A-Za-z0-9\u4e00-\u9fa5]{1,8}$/,
        msg: '输入1~8位字符'
      },
      // 性别
      this.sex = {
        reg: /^(男|女){1}$/,
        msg: '没有第三种性别哦'
      },
      // 生日
      this.birthDate = {
        reg: /^((?:19[2-9]\d{1})|(?:20(?:(?:0[0-9])|(?:1[0-8]))))\-((?:0?[1-9])|(?:1[0-2]))\-((?:0?[1-9])|(?:[1-2][0-9])|30|31)$/,
        msg: '日期格式可能不太正确哦'
      },
      this.email = {
        reg:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        msg:'邮箱格式不正确'
      }
  }

  validForm(o, t) {
    for (let key in o) {
      if (!this[key].reg.test(o[key]) || o[key] == '') {
        t.$toast(this[key].msg)
        // 表单验证不通过
        return false
      }
      
    }
    // 表单通过
    return true
  }
}

export default new Valid()
