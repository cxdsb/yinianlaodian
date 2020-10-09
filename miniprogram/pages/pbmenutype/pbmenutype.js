// pages/pbmenutype/pbmenutype.js
import Api from '../../utils/api'
import Config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addVal:"",
    recipeTypeLists:[], //  所有的类别
    updateVal:"",//要修改的类名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this._getRecipeTypes()
  },
  // 0.获取所有的菜谱分类
async _getRecipeTypes(){
  let res = await Api.findAll(Config.tables.recipeTypeTable)
  // console.log(res)
  this.setData({
    recipeTypeLists:res.data
  })
},
  // 1.获取用户输入添加分类的内容
  _addVal(e){
// console.log(e)
this.setData({
  addVal:e.detail.value
})
  },
  // 2。执行分类添加操作
  async _doAddRecipeType(){
    let typeName = this.data.addVal;
    let types=this.data.recipeTypeLists;//获取所有的类别

  //   let findIndex = types.findIndex((item)=>{
  //     return  item.typeName == typeName;
  // })
  // if( findIndex != -1 ){
  //     // 存在了
  //     wx.showToast({
  //       title: '当前类别已经存在了',
  //       icon:"none",
  //     })
  //     return;
  // }

    let findtf = types.every((item)=>{
      return item.typeName != typeName
    })
    // console.log(findtf)
    if(!findtf){
wx.showToast({
  title: '当前类别存在',
  icon:"none"
})
return
    }
    // 执行添加
    let addres = await Api.add(Config.tables.recipeTypeTable,{typeName})
    this._getRecipeTypes();
    if(addres._id){
      wx.showToast({
      title: '添加成功',
    })
    this.setData({
      addVal:""
    })
    }
    
  },
  // 3.执行删除操作
 async _removeRecipeType(e){
  let id = e.currentTarget.dataset.id;
  console.log(id)
  let res = await Api.removeId(Config.tables.recipeTypeTable,id)
  if(res.stats.removed == 1){
    wx.showToast({
      title: '删除成功',
    })
    this._getRecipeTypes();
  }
 },
// 4.获取要修改的内容
async _getUpdateRecipeType(e){

let id = e.currentTarget.dataset.id;
// console.log(id)
let allTypes = this.data.recipeTypeLists;
// console.log(allTypes)
let types = allTypes.find((item,index)=>{
  return item._id == id
})
// console.log(types)
this.setData({
  updateVal:types.typeName,
  updateId:types._id // 要修改的条件
})

},
 // 获取要修改的新内容
 _updateVal(e){
   this.setData({
     updateVal:e.detail.value
   })
 },
  // 执行修改
 async _doUpdateRecipeType(){
   let id = this.data.updateId;
   let typeName = this.data.updateVal;
  //  console.log(id,typeName)
   let res = await Api.updataById(Config.tables.recipeTypeTable,id,{typeName})
   if(res.stats.updated == 1){
     wx.showToast({
       title: '修改成功',
     })
     this._getRecipeTypes()
   }
 }
})