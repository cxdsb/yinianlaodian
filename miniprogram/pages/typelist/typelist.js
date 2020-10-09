// pages/typelist/typelist.js
import Api from '../../utils/api'
import Config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recipeTypeLists:[],
    inpVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
this.getrecipeTypeLists()
  },
 async getrecipeTypeLists(){
   let res = await Api.findAll(Config.tables.recipeTypeTable)
   console.log(res.data)
   this.setData({
    recipeTypeLists:res.data
   })
 },
 goreciptlist(e){
  // console.log(e.currentTarget.dataset)
  let {id,tag,title} = e.currentTarget.dataset
  wx.navigateTo({
    url: `../recipelist/recipelist?id=${id}&tag=${tag}&title=${title}`,
  })
    },
//  去菜谱列表
goreciptlist(e){
  // console.log(e.currentTarget.dataset)
  let {id,tag,title} = e.currentTarget.dataset
  wx.navigateTo({
    url: `../recipelist/recipelist?id=${id}&tag=${tag}&title=${title}`,
  })
    },
      // 获取搜索框的值
    _inpVal(e){
      // console.log(e.detail.value)
  this.setData({
    inpVal:e.detail.value
  })
    },
})