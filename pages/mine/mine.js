// pages/mine/mine.js
var app = getApp();
var config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '',
    nickname: '',
    sex: '',
    gender: '',
    color: '',
    uuid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.onShareAppMessage(),
    this.onShareTimeline(),
    this.setData({
      image: wx.getStorageSync('avatar'),
      nickname: wx.getStorageSync('nickname'),
      gender: wx.getStorageSync('gender'),
      uuid: wx.getStorageSync('uuid')
    })
    this.getTabBar().init();
    if (this.data.gender == '1') {
      this.setData({
        gender: 'gender-male',
        color: '#ffb446'
      })
    }else if(this.data.gender == '2'){
      this.setData({
        gender: 'gender-female',
        color: 'hotpink'
      })
    }else{
      gender: ''
    }
  },
  share(){
this.onShareAppMessage()
this.onShareTimeline()
  },

  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'FitFlock'
        })
      }, 2000)
    })
    return {
      title: 'FitFlock',
      path: '/pages/index/index',
      promise 
    }
  },
  onShareTimeline() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'FitFlock'
        })
      }, 2000)
    })
    return {
      title: 'FitFlock',
      path: '/pages/index/index',
      promise 
    }
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