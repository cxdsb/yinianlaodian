// pages/recipeDetail/recipeDetail.js
import Api from '../../utils/api'
import Config from '../../utils/config'
// const _ = Api.db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recipeInfo: {},
    isfollows: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let {
      id,
      title
    } = options
    this.data.id = id
    wx.setNavigationBarTitle({
      title,
    })
    this.getrecipeInfo(id)
  },

  async getrecipeInfo(id) {
    let res = await Api.findId(Config.tables.recipeTable, id)
    // console.log(res.data.views)
    
    //增加浏览
    let updataviews = await Api.updataById(Config.tables.recipeTable, id, {
      views: res.data.views+1
    })
    // console.log(updataviews)
this.setData({
      recipeInfo: res.data,
    })
    // 显示关注或者未关注
    // 查询关注状态
    let _openid = wx.getStorageSync('_openid') || null
     let where = {
      recipeid: id,
      _openid: _openid
    }
    if(_openid == null)return

let stufollow = await Api.find(Config.tables.followsTable, where)
// console.log(stufollow)
 this.setData({
      recipeInfo: res.data,
      isfollows: stufollow.data.length <= 0 ? false : true
    })


  },
  // 点击关注或者取消关注
  async clickfollow() {
    
    let _openid = wx.getStorageSync('_openid')

    if (_openid) {
      // console.log(this.data.isfollows)
      if (this.data.isfollows) {
        // console.log("点击取消关注")
        // 调用云函数
        wx.cloud.callFunction({
          name:"removeWhere",
          data:{
            tables:Config.tables.followsTable,
            where:{
              recipeid: this.data.id,
      _openid: wx.getStorageSync('_openid')
            }
          },
          success: async (res)=>{
            // console.log("请求成功！", res)
            if(res.result.stats.removed == 1){
              this.setData({
                isfollows:false
              })
              let updatafollows = await Api.updataById(Config.tables.recipeTable, this.data.id, {
                follows:this.data.recipeInfo.follows-1
              })
            }
            },
            fail(res){
            console.log("请求失败！",res)
            }
        })

 
      } else {
         console.log("点击关注")
        let data = {
          recipeid: this.data.id,
          // isAdmin:wx.getStorageSync('isAdmin'),
        }
        let clicktu = await Api.add(Config.tables.followsTable, data)
        // console.log(clicktu)
      
        let updatafollows = await Api.updataById(Config.tables.recipeTable, this.data.id, {
          follows:this.data.recipeInfo.follows+1
        })
        // console.log(updatafollows)
        wx.showToast({
          title: '关注成功',
        })
        // console.log(this.data.isfollows)
        this.setData({
          isfollows:true
        })
        
      }
    } else {
      
      wx.showToast({
        title: '请登录再操作',
        icon: "none"
      })
      setTimeout(()=>{
wx.switchTab({
  url: '../personal/personal',
})
      },1500)
    }
    
  },


})