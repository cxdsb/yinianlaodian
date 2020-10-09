// pages/personal/personal.js
import Api from '../../utils/api'
import Config from '../../utils/config'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {},
    isAdmin: false,
    recipesList:[],
    changeIndex:0,
    getrecipesType:[],
    getfollowsList:[]
  },

  onShow() {
    this._checkSession()
    // 遍历菜品
this._getrecipes()
this._getrecipesType()
this._getuserfollows()
  },

  _checkSession() {
    let that = this;
    // console.log("111111")
   
    wx.checkSession({
      success() {
        wx.getUserInfo({
          
          success:res=>{
            console.log(res.userInfo)
        
        // let userInfo = wx.getStorageSync('userInfo')
        let _openid =wx.getStorageSync('_openid');
        let isAdmin = Config.isAdminOpenid == _openid ? true : false;
// console.log(userInfo)
        that.setData({
          isLogin: true,
          userInfo:res.userInfo,
          isAdmin,
        })
       }
    })
      },
      fail() {
        wx.showToast({
          title: '未登录',
          icon: "none"
        })
        that.setData({
          isLogin: false
        })
      },

    })

  },

  _login(e) {
    // console.log(e)
    let that = this;
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return
    }
    // 用户同意授权
    // 1。获取到当前的用户信息 ， 2. _openid 
    wx.login({
      success() {
        //云端提取
        wx.cloud.callFunction({
          name: "login",
          async success(res) {
            // console.log(res)
            let _openid = res.result.openid
            let userInfo = e.detail.userInfo
            // 4.查询当前用户是否在用户表中，如果在，直接什么都不做
            let allUsers = await Api.findAll(Config.tables.userTable, {
              _openid
            }) //根据open_id查询
            if (allUsers.data.length <= 0) {
              // 没有
              // 3.添加用户
              const addres = await Api.add(Config.tables.userTable, {
                userInfo
              })
             

            }
            // console.log(userInfo)
            // 5.判断管理员为登录
            let isAdmin = Config.isAdminOpenid == _openid ? true : false;
            wx.setStorageSync('_openid', _openid)
            wx.setStorageSync('userInfo', userInfo)
            wx.showToast({
              title: '登录成功',
            })
            that.setData({
              isLogin: true,
              userInfo,
              isAdmin
            })

          }
        })
      },
      fail(){
        wx.showToast({
          title: '由于网络原因，登录失败',
          icon:"none"
        })
      }
    })
  },
// 跳转分类
  _goRecipeTypePage(){
    console.log(this.data.isAdmin)
   
    // if(this.data.isAdmin){
    //      wx.navigateTo({
    //       url: '../pbmenutype/pbmenutype',
    //     })
    //   }
if(!this.data.isAdmin)return;
wx.navigateTo({
  url: '../pbmenutype/pbmenutype',
})
  },
  //跳转菜单添加
  gopbmenu(){
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },
  // 选项卡
  changedindex(e){
this.setData({
  changeIndex:e.currentTarget.dataset.id
},function(){
this.getIndexpage()
})
  },
  getIndexpage(){
let changeIndex=this.data.changeIndex
    switch(changeIndex){
      case "0":
       this._getrecipes()
      break;
      case "1":
        this._getrecipesType()
       break;
       case "2":
       this._getuserfollows()
       break;
    }
  },
  // 获取菜谱
  async _getrecipes(){
    let where={
      _openid:wx.getStorageSync('_openid'),
      status:1
    }
    // console.log(where)
    let orderBy={
      field:"time",
      sort:"desc"
    }
    let res = await Api.findAll(Config.tables.recipeTable,where,orderBy)
    // console.log(res.data)
    this.setData({
      recipesList:res.data
    })
    // console.log(this.data.recipesList)
    },
    // 获取菜单分类
    async _getrecipesType(){

 let allid = this.data.recipesList.map((item)=>{
  return item.recipeTypeid
})
let newallid = Array.from(new Set(allid))
console.log(newallid)
let promise =[]
newallid.forEach((item,index)=>{
  let typepro = Api.findId(Config.tables.recipeTypeTable,item)
  promise.push(typepro)
})
let allpromise = await Promise.all(promise)
console.log(allpromise)
this.setData({
  getrecipesType:allpromise
})
    },
    // 获取关注
   async _getuserfollows(){
let where={
  _openid:wx.getStorageSync('_openid')
}
let res = await Api.findAll(Config.tables.followsTable,where)
// console.log(res.data)
let followsIdArr = res.data.map((item,index)=>{
  return item.recipeid
})
// console.log(followsIdArr)
let recipetFollor=[];
//foreach是同步方法
followsIdArr.forEach((item)=>{
  // console.log(item)
  let result = Api.findId(Config.tables.recipeTable,item)
  // console.log(result)
  recipetFollor.push(result)
})
let resfollows = await Promise.all(recipetFollor)
// console.log(resfollows)
this.setData({
  getfollowsList:resfollows
})
// console.log(this.data.getfollowsList[0].data.pic[0].fileID)
    },
    // 删除菜单列表
    delRecipe(e){
console.log(e)
let id = e.currentTarget.dataset.id
let index = e.currentTarget.dataset.index
let recipesList = this.data.recipesList

let that = this;
wx.showModal({
  title: '危险提示',
  content:"确定要删除吗",
 async success(res){
console.log(res)
if(!res.confirm)return
console.log("111")
let result = await Api.removeId(Config.tables.recipeTable,id)
console.log(result)
if(result.stats.removed == 1){
// recipesList.splice(index,1)
// that.setData({
//   recipesList,
// })
_this._getrecipes()
}


  }

})
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
      goreciptlist(e){
        console.log("111")
        let {id,tag,title} = e.currentTarget.dataset
        wx.navigateTo({
          url: `../recipelist/recipelist?id=${id}&tag=${tag}&title=${title}`,
        })
      }
})