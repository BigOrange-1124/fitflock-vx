const config = require("../../../../config");

var app = getApp();
Page({
  data: {
    nameValue: '',
  },
  
  onLoad(options) {
    const { name } = options;
    this.setData({
      nameValue: name,
    });
  },
  onShow() {
    this.setData({
      nameValue: wx.getStorageSync('nickname')
    })
  },
  nameinput(e){
    console.log(e.detail);
    wx.request({
      url: config.updateUserinfo,
      data: {
        nickName: e.detail.value.nickname
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      success: (res) => {
        if (res.data.code==200) {
          wx.setStorageSync('nickname', e.detail.value.nickname)
          console.log("修改成功");
          wx.navigateBack()
          wx.showToast({
            title: '修改成功',
          })
        }else if(res.data==401){
          console.log("token过期");
          getApp().regainToken()
        }else{
          console.log("修改失败");
          wx.showToast({
            title: '修改失败',
          })
        }
      }
    })
  },
  clearContent() {
    this.setData({
      nameValue: '',
    });
  },
  onShareAppMessage() {

  }
});
