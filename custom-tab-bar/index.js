Component({
  data: {
      value:0,
      tabBar: [{
       url:'/pages/index/index',
        icon: 'home',
        label: '首页',
      },{
        url:'/pages/sort/sort',
        icon: 'app',
        label: '动作',
      },{
          url:'/pages/group/group',
          icon: 'usergroup',
          label: '小组',
        }, {
       url:'/pages/mine/mine',
        icon: 'user',
        label: '我的'
        }]
    },
  
      methods: {
        onChange(e) {
            //console.log(e)
          this.setData({ value: e.detail.value });
          wx.switchTab({
              url: this.data.tabBar[e.detail.value].url
           });
        },
        init() {
            const page = getCurrentPages().pop();
            this.setData({
           　  value: this.data.tabBar.findIndex(item => item.url === `/${page.route}`)
            });
           }
        },
})