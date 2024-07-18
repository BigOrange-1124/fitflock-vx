// app.js
var config = require("./config.js")
App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    this.toLogin();
  },
  onSaveExitState() {
    wx.removeStorageSync('recordDate')
  },
  toLogin(e) {
    console.log("初始化方法执行成功");
    wx.showLoading({
      title: '登录中',
    });
    var token = wx.getStorageSync('token')
    if (token.length != 0) {
      wx.request({
        url: config.checkToken,
        header: {
          token: token
        },
        method: "GET",
        success: (res) => {
          if (res.data.code === 200) {
            wx.showToast({
              title: '登录成功',
            })
          } else {
            this.login()
          }
        },
        fail: (res) => {
          wx.showToast({
            title: '登陆出错，请重试',
          })
        }
      })
    } else {
      this.login()
    }
  },
  login(){
    wx.login({
      success: res => {
        wx.request({
          url: config.loginUrl,
          data: {
            code: res.code,
            // ip: res.data.ip,
            brand: wx.getSystemInfoSync().brand,
            model: wx.getSystemInfoSync().model,
            system: wx.getSystemInfoSync().system,
            platform: wx.getSystemInfoSync().platform,
            version: wx.getSystemInfoSync().version
          },
          method: "POST",
          success: res => {
            console.log(res);
            if (res.data.code == 200) {
              wx.hideLoading()
              wx.showToast({
                title: res.data.msg,
              })
              console.log("token获取成功");
              wx.setStorageSync('token', res.data.data)
              //获取用户姓名，性别，头像，uuid
              this.getAvatarNickname()
              //获取动作列表
              this.getSortActionList()
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '登录失败',
              })
            }
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: res => {
        console.log("登录失败");
        wx.hideLoading()
        wx.showToast({
          title: '登录出错，请重试',
        })
      }
    })
  },
  regainToken() {
    wx.showModal({
      title: '授权错误',
      content: '小程序停留时间过长，点击确定进行登录',
      complete: (res) => {
        if (res.cancel) {}
        if (res.confirm) {
          this.toLogin()
        }
      }
    })
  },
  getAvatarNickname() {
    wx.request({
      url: config.getInfo,
      method: "GET",
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res),
          wx.setStorageSync('avatar', res.data.data.avatarUrl),
          wx.setStorageSync('nickname', res.data.data.nickName),
          wx.setStorageSync('gender', res.data.data.gender),
          wx.setStorageSync('uuid', res.data.data.uuid)
      },
      fail: res => {
        wx.showToast({
          title: '获取基础信息失败',
        })
      }
    })
  },
  getSortActionList(){
    wx.request({
      url: config.getActionData,
      method: "GET",
      success: (res) => {
        wx.setStorageSync('sortActionList', res.data.data.actionList)
      }
    })
  },

  // getCity() {
  //   wx.authorize({
  //     scope: 'scope.userFuzzyLocation',
  //     success(res) {
  //         console.log(res)
  //         if(res.errMsg == 'authorize:ok'){
  //             wx.getFuzzyLocation({
  //                 type: 'wgs84',
  //                 success(res) {
  //                     console.log(res)  //此时里面有经纬度
  //                 }
  //             })
  //         }
  //     },
  //     fail(err) {
  //         console.log(err)   
  //     }                    
  // })
  // }
})