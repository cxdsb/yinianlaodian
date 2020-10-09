// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {env:"test-yun-72e4r"}
)
const db = wx.cloud.database({env:"test-yun-72e4r"})
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection(event.table).where(event.where).remove()
}