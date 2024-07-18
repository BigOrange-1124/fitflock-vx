// var host= "https://guohaolong.top/orange/"
var host= "http://127.0.0.1:8888/orange/"
var config={
  host,
  loginUrl: host+"user/login",
  checkToken: host+"user/checkToken",
  getInfo: host+"userinfo/getInfo",
  uploadAvatarUrl: host+"userinfo/uploadAvatar",
  updateUserinfo: host+"userinfo/update",
  getActionData: host+"action/list",
  saveTraningRecord: host+"trainingRecord/save",
  getBackground: host+"images/getBackground",
  getUserRecordDate: host+"trainingRecord/getUserRecordDate",
  getUserRecordByDate: host+"trainingRecord/getUserRecordByDate",
  createGroup: host+"userGroup/save",
  joinGroup: host+"userGroup/join",
  getJoinGroup: host+"userGroup/joinGroupList",
  getGroupRecordDate: host+"trainingRecord/getGroupRecordDate",
  removeUserGroup: host+"userGroup/remove",
  getGroupRecordByDate: host+"trainingRecord/getGroupRecordByDate"
}
module.exports=config;