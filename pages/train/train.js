// pages/train/train.js
var config = require("../../config.js")
import Toast from 'tdesign-miniprogram/toast/index';
Page({
  properties: {
    scrollTop: {
      type: Number,
      value: 0
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    actionList: [], // 动作列表
    backTopTheme: 'half-round',
    backTopText: '顶部',
    totalCapacity: 0,
    loading: false,
    visible: false
  },
  handleClick() {
    // 假设这里已经拿到了选中的动作，包含动作ID和名称
    wx.navigateTo({
      url: '/pages/train/chooseAction/chooseAction',
    })
  },
  // 选择动作后的处理函数
  handleSelectedAction(actionId, actionName) {
    const actionExists = this.data.actionList.some(action => action.actionId === actionId);
    if (actionExists) {
      // 如果动作已存在，则不执行添加操作
      Toast({
        context: this,
        selector: '#t-toast',
        message: '当前动作已存在',
        theme: 'warning',
        direction: 'column',
      });
      return;
    }
    // 新增动作的初始数据
    const newAction = {
      actionId: actionId,
      actionName: actionName,
      actionCapacity: '',
      inputs: [{
        id: '',
        weight: '',
        reps: ''
      }]
    };
    newAction.inputs[0].id = 1;

    // 将新动作添加到动作列表中
    const updatedActionList = this.data.actionList.concat(newAction);
    this.setData({
      actionList: updatedActionList
    });
    // this.calculateTotalCapacity();
    wx.setStorageSync('actionList', this.data.actionList)
  },
  // 点击新增一行输入框按钮触发的事件
  addRow(e) {
    const panelIndex = e.currentTarget.dataset.panelIndex;
    const actionList = this.data.actionList.map(action => ({
      ...action
    })); // 复制动作列表数据
    const targetAction = actionList[panelIndex];
    if (targetAction) {
      const newItem = {
        id: '',
        weight: '',
        reps: ''
      }; // 新的一行数据
      const lastItemId = targetAction.inputs[targetAction.inputs.length - 1].id;
      newItem.id = parseInt(lastItemId) + 1; // 计算自增id的值
      newItem.weight = targetAction.inputs[targetAction.inputs.length - 1].weight;
      newItem.reps = targetAction.inputs[targetAction.inputs.length - 1].reps;
      targetAction.inputs.push(newItem); // 将新的一行数据添加到对应动作的输入列表中
      this.setData({
        actionList: actionList // 更新动作列表数据
      });
      this.calculateTotalCapacity();
      wx.setStorageSync('actionList', this.data.actionList)
    }
  },
  onInputChange(e) {
    const {
      actionIndex,
      inputIndex,
      panelIndex
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;
    const actionList = this.data.actionList.map(action => ({
      ...action
    }));
    if (parseInt(inputIndex) === 1) {
      actionList[panelIndex].inputs[actionIndex].weight = value;
    } else {
      actionList[panelIndex].inputs[actionIndex].reps = value;
    }
    this.setData({
      actionList: actionList
    });
    this.calculateTotalCapacity();
    wx.setStorageSync('actionList', this.data.actionList)
  },
  deleteRow(e) {
    console.log(e.currentTarget.dataset)
    const panelIndex = e.currentTarget.dataset.panelIndex;
    const actionIndex = e.currentTarget.dataset.actionIndex;
    const actionList = this.data.actionList.map(action => ({
      ...action
    })); // 复制动作列表数据
    const inputs = actionList[panelIndex].inputs;
    if (inputs.length === 1) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '至少保留一行数据',
        theme: 'warning',
        direction: 'column',
      });
      return; // 不允许删除
    }
    inputs.splice(actionIndex, 1); // 使用 splice() 方法删除指定行
    inputs.forEach((input, index) => {
      input.id = index + 1; // 重新分配 id
    });
    this.setData({
      actionList: actionList // 更新动作列表数据
    });
    this.calculateTotalCapacity();
    wx.setStorageSync('actionList', this.data.actionList)
  },
  deletePanel(e) {
    const panelIndex = e.currentTarget.dataset.panelIndex;
    const actionList = this.data.actionList.map(action => ({
      ...action
    }));
    wx.showModal({
      title: '提示',
      content: '确认删除当前动作？',
      success: (res) => {
        if (res.confirm) {
          actionList.splice(panelIndex, 1);
          this.setData({
            actionList: actionList // 更新动作列表数据
          });
          this.calculateTotalCapacity();
          wx.setStorageSync('actionList', this.data.actionList)
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  submitData() {
    const actionList = this.data.actionList;
    console.log(actionList);
    if (actionList.length == 0) {
      wx.showToast({
        title: '您还没有记录哦~',
      })
      return;
    }
    this.setData({
      loading: true,
      visible: true
    })
    wx.request({
      url: config.saveTraningRecord,
      data: {
        recordList: actionList,
        date: new Date()
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      success: (res) => {
        if (res.data.code === 200) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '提交成功',
            theme: 'success',
            direction: 'column',
          });
          setTimeout(() => {
            wx.removeStorageSync('actionList')
            wx.redirectTo({
              url: '/pages/index/recordCalendar/recordCalendar',
            })
            this.setData({
              actionList: [],
              totalCapacity: 0,
            })
            // 在这里执行你想要延迟执行的代码
          }, 1000);
        } else if (res.data === 401) {
          this.setData({
            loading: false,
            visible: false
          })
          console.log("token过期");
          getApp().regainToken()
        } else if (res.data.code === 400) {
          this.setData({
            loading: false,
            visible: false
          })
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.msg,
            theme: 'error',
            direction: 'column',
          });
        } else {
          this.setData({
            loading: false,
            visible: false
          })
          console.log("修改失败");
          Toast({
            context: this,
            selector: '#t-toast',
            message: '提交失败,请重试',
            theme: 'error',
            direction: 'column',
          });
        }
      },
      fail: (res) => {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '服务器连接超时',
          theme: 'error',
          direction: 'column',
        });
        this.setData({
          loading: false,
          visible: false
        })
      }
    })
  },
  calculateTotalCapacity() {
    let totalCapacity = 0;
    const actionList = this.data.actionList;

    actionList.forEach(action => {
      // 检查每个动作对象是否包含 inputs 属性，并且 inputs 是一个数组
      if (
        typeof action === 'object' &&
        Array.isArray(action.inputs)
      ) {
        let actionCapacity = 0;
        action.inputs.forEach(input => {
          // 检查每个 input 对象是否包含 weight 和 reps 属性，并且它们的值是有效的数字
          actionCapacity += input.weight * input.reps;
          console.log(totalCapacity)
        });
        totalCapacity += actionCapacity;
        action.actionCapacity = actionCapacity;
      }
    });
    // 更新页面数据，将计算结果绑定到 totalCapacity 变量上
    this.setData({
      actionList: actionList,
      totalCapacity: totalCapacity
    });
  },
  onToTop(e) {
    console.log('backToTop', e);
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {},
  // 生命周期函数--监听页面初次渲染完成
  onReady() {},
  // 生命周期函数--监听页面显示
  onShow() {
    if (wx.getStorageSync('actionList').length != 0) {
      this.setData({
        actionList: wx.getStorageSync('actionList')
      })
      this.calculateTotalCapacity()
    }
  },
  // 生命周期函数--监听页面隐藏
  onHide() {},
  // 生命周期函数--监听页面卸载
  onUnload() {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {},
  // 页面上拉触底事件的处理函数
  onReachBottom() {},
  // 用户点击右上角分享
  onShareAppMessage() {}
})