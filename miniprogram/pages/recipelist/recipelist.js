// pages/recipelist/recipelist.js
import Api from '../../utils/api'
import Config from '../../utils/config'
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
getreciprlist:[],
page:1,//当前页
tips:true,
gettips:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 // 接收参数
//  console.log(options)
 let {id,tag,title} = options
 wx.setNavigationBarTitle({
   title,
 })
 this.data.id = id;
 this.data.tag=tag
 this.data.title=title
// console.log(this.data.id)
this.getreciprlist(tag,id,title)

  },
async getreciprlist(tag,id,title){
  // console.log("3333")
  let where,orderBy,limit,page;
switch(tag){
  //分类菜谱
  case "IndexNav":
 where={recipeTypeid:id,status:1}
 orderBy={field:"time",sort:"desc"}
limit = 5
page=this.data.page
    break;
    //推荐菜谱
    case "recommend":
// console.log("recommend")
where={status:1}
orderBy={field:"time",sort:"desc"}
limit = 10
page=this.data.page
    break;
    //热门菜谱
    case "hotcai":
// console.log("recommend")
where={status:1}
orderBy={field:"views",sort:"desc"}
limit = 8
page=this.data.page
    break;
    //搜索
    case "search":
// console.log(title)
where={status:1,recipeName:db.RegExp({regexp:title,options:'i'})}
orderBy={field:"time",sort:"desc"}
page=this.data.page
    break;
     //个人菜谱
     case "onec":
      // console.log(title)
      where={
        _openid:wx.getStorageSync('_openid'),
        recipeTypeid:id
      }
      orderBy={field:"time",sort:"desc"}
      page=this.data.page
          break;
}
let res = await Api.find(Config.tables.recipeTable,where,limit,page,orderBy)
//获取用户信息
let promiseAllusers = [];
res.data.forEach((item,index)=>{
  let promiseusers = Api.find(Config.tables.userTable,{_openid:item._openid})
  promiseAllusers.push(promiseusers);
})
// console.log(promiseAllusers)
let users = await Promise.all(promiseAllusers)
// console.log(users)
res.data.map((item,index)=>{
  return item.userinfo=users[index].data[0].userInfo
})
if(res.data.length < limit){
  this.setData({
      gettips:true
    })
}
    res.data = this.data.getreciprlist.concat(res.data)

this.setData({
  getreciprlist:res.data
})
// console.log(this.data.getreciprlist)

if(this.data.getreciprlist.length>0){
  // 显示数据状态
  this.setData({
    tips : false
  })
}

},
  // 去详情页
  goDetail(e){
    // console.log(e)
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}&title=${title}`,
    })
      },
      onReachBottom(){
        this.data.page++
        this.getreciprlist(this.data.tag,this.data.id,this.data.title)
      }
     
})