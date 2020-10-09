// pages/search/search.js
import Api from '../../utils/api'
import Config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inpVal:"",
    arrsearch:[],
latelysearcharr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.gethot_best()
this.getstorge()
  },
  //  去菜谱列表
  goreciptlist(e){
    console.log(e.currentTarget.dataset)
    let {id,tag,title} = e.currentTarget.dataset
    // wx.removeStorageSync('hotsearch')
// 近期搜索列表
    let hotsearch = wx.getStorageSync('latelysearcharr') || []
    // 插入到数组最前面
   
    if(title == null || title == "")return
        hotsearch.unshift(title)
    let latelysearcharr = Array.from(new Set(hotsearch))

   wx.setStorageSync('latelysearcharr', latelysearcharr)

    
  
    wx.navigateTo({
      url: `../recipelist/recipelist?id=${id}&tag=${tag}&title=${title}`,
    })
     
      },
      // 获取缓存内的近期搜索
      getstorge(){
        let latelysearcharr = wx.getStorageSync('latelysearcharr') || []

  this.setData({
      latelysearcharr,
    })
console.log(this.data.latelysearcharr)
    
      },

 // 获取搜索框的值
 _inpVal(e){
  // console.log(e.detail.value)
this.setData({
inpVal:e.detail.value
})
},
 // 获取热度排名
 async gethot_best(){
  let res = await Api.find(Config.tables.recipeTable,{status:1},9,1,{field:"views",sort:"desc"})
  // console.log(res.data)
 
  this.setData({
    arrsearch:res.data
  })
   },
  
})