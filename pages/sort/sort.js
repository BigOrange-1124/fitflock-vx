var config = require("../../config.js")
Page({
  data: {
    sideBarIndex: 0,
    scrollTop: 0,
    categories: wx.getStorageSync('sortActionList'),
    visible: false,
    showIndex: false,
    closeBtn: false,
    deleteBtn: false,
    images: [],
    confirmBtn: {
      content: '知道了',
      variant: 'base'
    },
    showMultiTextAndTitle: false,
    actionImage: '',
    actionDesciption: '',
    actionName: ''
  },
  onLoad() {

  },
  onSideBarChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      sideBarIndex: value,
      scrollTop: 0
    });
  },
  onSwiperChange(event) {
    const {
      current
    } = event.detail;
    this.setData({
      sideBarIndex: current
    });
  },
  onClick(e) {
    console.log(e);
    this.setData({
      images: [
        // 'https://guohaolong.top/avatar/R.gif',
        // 'https://tdesign.gtimg.com/miniprogram/images/swiper2.png',
      ],
      showIndex: true,
      visible: true,
      closeBtn: true,
      // deleteBtn: true,
    });
  },
  onChange(e) {
    const {
      index
    } = e.detail;

    console.log(index);
  },
  onClose(e) {
    const {
      trigger
    } = e.detail;

    console.log(trigger);
    this.setData({
      visible: false,
    });
  },
  showDialog(e) {
    var get = e.currentTarget.dataset;
    console.log(get)
    this.setData({
      showMultiTextAndTitle: true,
      actionName: get.actionname,
      actionDesciption: get.actiondesciption ,
      actionImage: get.actionimage
    });
  },

  closeDialog() {
    this.setData({
      showMultiTextAndTitle: false
    });
  },
  onShow() {
    this.getTabBar().init();
  },
});