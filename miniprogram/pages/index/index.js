import Api from '../../utils/api'
import Config from '../../utils/config'
Page({
  data:{
recipesList:[],
recipeTypeLists:[],
inpVal:"",
hotbest_img:"",
page:1
  },
  onShow(){
this._getrecipes()
this._getRecipeTypes()
this. gethot_best()
  },
async _getrecipes(){
  let where={
    status:1
  }
  let orderBy={
    field: "time",
    sort: "desc"
  }
  let limit=6
let res = await Api.find(Config.tables.recipeTable,where,limit,this.data.page,orderBy)
// console.log(res)
res.data = this.data.recipesList.concat(res.data)
this.setData({
  recipesList:res.data
})
},
async _getRecipeTypes(){
  let res = await Api.find(Config.tables.recipeTypeTable,{},2)
  // console.log(res.data)
  this.setData({
    recipeTypeLists:res.data
  })
  // console.log(this.data.recipeTypeLists)
   },
  //  去菜谱分类
  gotypelist(){
     wx.navigateTo({
       url: '../typelist/typelist',
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
  // 去详情页
  goDetail(e){
console.log(e)
let id = e.currentTarget.dataset.id;
let title = e.currentTarget.dataset.title;
wx.navigateTo({
  url: `../recipeDetail/recipeDetail?id=${id}&title=${title}`,
})
  },
  // 获取热度最高的菜品
async gethot_best(){
let res = await Api.findAll(Config.tables.recipeTable,{},{field:"views",sort:"desc"})
// console.log(res)
this.setData({
  hotbest_img:res.data[0].pic[0].fileID
})
 },
 onReachBottom(){
  this.data.page++
  // console.log(this.data.page)
  this._getrecipes()
}
})