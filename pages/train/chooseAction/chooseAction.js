var config = require("../../../config.js")
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
  },
  onLoad() {},
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

  onShow() {},
  handleActionClick(e) {
    const actionId = e.currentTarget.dataset.actionid; // 获取按钮上的data-actionid属性值
    const actionName = e.currentTarget.dataset.actionname; // 获取按钮上的data-actionname属性值

    console.log(actionId, actionName)
    // 将actionId和actionName返回给原界面，你可以根据自己的需求处理这些数据
    // 例如，可以通过navigateBack将数据返回给原界面
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    wx.navigateBack({
      delta: 1,
      success: function () {
        prevPage.handleSelectedAction(actionId, actionName); // 调用原页面的方法，将选中的动作ID和名称传递回去
      }
    });
  }
});