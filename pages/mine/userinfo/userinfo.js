// const { VertexBuffer } = require("XrFrame/kanata/lib/index");
var config = require("../../../config.js")
// pages/mine/userinfo/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    gender: '',
    genders: [{
        label: '男',
        value: '1'
      },
      {
        label: '女',
        value: '2'
      },
    ],
    dateVisible: false,
    date: '', // 支持时间戳传入
    dateText: '请选择出生日期',
    // 指定选择区间起始值
    start: '1949-10-01 00:00:00',
    end: '2020-01-01 00:00:00',
  },
  onClickCell_name() {
    wx.navigateTo({
      url: '../userinfo/name/name',
    })
  },
  onClickCell_gender() {
    this.setData({
      genderVisible: true,
      genderTitle: '选择性别',
    });
  },
  onColumnChange(e) {
    console.log('picker pick:', e);
  },
  onPickerChange(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;
    console.log('picker change:', e.detail);
    this.setData({
      'gender': e.detail.label[0],
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      [`${key}Text`]: value.join(' '),
    });
    wx.request({
      url: config.updateUserinfo,
      data: {
        gender: e.detail.value[0]
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          wx.setStorageSync('gender', e.detail.value[0])
          wx.showToast({
            title: '修改成功',
          })
        } else if (res.data == 401) {
          console.log("token过期");
          getApp().regainToken()
        } else {
          console.log("修改失败");
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  },
  onPickerCancel(e) {
    const {
      key
    } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  getGenderText(gender) {
    if (gender == null) {
      return '未知';
    } else {
      return gender.toString() === '1' ? '男' : gender.toString() === '2' ? '女' : '未知';
    }
  },

  onChooseAvatar(e) {
    console.log(e)
    wx.uploadFile({
      filePath: e.detail.avatarUrl,
      name: 'file',
      url: config.uploadAvatarUrl,
      header: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      success: (res) => {
        var json = JSON.parse(res.data)
        if (json.code == 200) {
          console.log("成功")
          wx.showToast({
            title: json.msg,
          })
          this.setData({
            avatarUrl: json.data
          })
          wx.setStorageSync('avatar', json.data)
          wx.startPullDownRefresh()

        } else if (res.data == 401) {
          console.log("token校验未通过")
          wx.showToast({
            title: "用户登录凭据过期，请重新打开小程序",
          })
          app.regainToken()
        } else {
          wx.showToast({
            title: '头像上传失败',
          })
        }
      }
    })
  },
  showPicker(e) {
    console.log(e)
    this.setData({
      dateVisible: true,
    });
  },
  hidePicker() {
    this.setData({
      dateVisible: false,
    });
  },
  onConfirm(e) {
    const {
      value
    } = e.detail;
    console.log('confirm', value);
    wx.request({
      url: config.updateUserinfo,
      data: {
        birthday: value
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      success: (res) => {
        if (res.data.code == 200) {
          console.log("成功")
          wx.showToast({
            title: res.data.msg,
          })
          this.setData({
            dateText: value,
          });
        } else if (res.data == 401) {
          app.regainToken()
        } else {
          wx.showToast({
            title: '出生日期修改失败',
          })
          console.log("失败")
        }
      }
    })

    this.hidePicker();
  },

  onColumnChangeBir(e) {
    const {
      value
    } = e.detail;
    console.log('pick', value);
    this.setData({
      date: value
    });
    this.showPicker();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserinfo()
    var date = new Date('2000-01-01T00:00:00').getTime()
    console.log(date)
    this.setData({
      nickName: wx.getStorageSync('nickname'),
      avatarUrl: wx.getStorageSync('avatar'),
      gender: this.getGenderText(wx.getStorageSync('gender')),
      date: new Date('2000-01-01T00:00:00').getTime(),
    })
  },
  getUserinfo() {
    wx.request({
      url: config.getInfo,
      header: {
        token: wx.getStorageSync('token')
      },
      method: "GET",
      success: (res) => {
        if (res.data.code === 200) {
          console.log(res.data.data)
          if (res.data.data.birthday != null) {
            this.setData({
              dateText: res.data.data.birthday,
              date: res.data.data.birthday
            })
          }
        } else if (res.data == 401) {
          console.log("token过期");
          getApp().regainToken()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})