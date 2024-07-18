// index.js
// 获取应用实例
var config = require("../../config.js")
const swiperList = [];
Page({
  data: {
    current: 1,
    autoplay: true,
    duration: 500,
    interval: 5000,
    swiperList,
    navigation: { type: 'dots-bar' },
    paginationPosition: 'right',
  },
  // 事件处理函数
  gotoTrain(){
    wx.navigateTo({
      url: '/pages/train/train',
    })
  },
  gotoRecordCalendar(){
    wx.navigateTo({
      url: '/pages/index/recordCalendar/recordCalendar',
    })
  },
  handleCalendar() {    
      this.setData({
        visible: true
      });
  },
  handleConfirm(e) {
    console.log(e.detail.value);
  },
  onChange(e) {
    const {
      detail: { current, source },
    } = e;
    console.log(current, source);
  },
  onAutoplayChange(e) {
    this.setData({
      autoplay: e.detail.value,
    });
  },
  onIntervalChange(e) {
    this.setData({
      interval: e.detail.value,
    });
  },
  onDurationChange(e) {
    this.setData({
      duration: e.detail.value,
    });
  },
  onShow() {
    this.getTabBar().init();
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
  onLoad(){
    wx.request({
      url: config.getBackground,
      success: (res) => {
        this.setData({
          swiperList: res.data.data
        })
      }
    })
  }
})
