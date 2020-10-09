// pages/pbmenu/pbmenu.js
import Api from '../../utils/api'
import Config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recipeTypeLists:[],
    files:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
this._getRecipeTypes()

  },
 // 1.获取所有的分类
 async _getRecipeTypes(){
let res = await Api.findAll(Config.tables.recipeTypeTable)
// console.log(res)
this.setData({
  recipeTypeLists:res.data
})
 },
   //2.选择图片  
   _bindselectImage(e){
    //  console.log(e)
     let tempFilePaths = e.detail.tempFilePaths;
     let files = tempFilePaths.map((item)=>{
       return {url:item}
     })
     files=this.data.files.concat(files)
     this.setData({
      files
     })
   },
   //  3.删除图片
   _deleteImage(e){
    //  console.log(e)
     let index = e.detail.index;
     let files = this.data.files;
     files.splice(index,1)
     this.setData({
       files
     })
   },
//  发布菜谱
async _doRecipes(e){
// console.log(e)
let {recipeName,recipeTypeid,recipeMakes} = e.detail.value;
if(recipeName==""||recipeTypeid==""||recipeMakes==""||this.data.files.length<=0){
  wx.showToast({
    title: '请补全信息',
    icon:"none"
  })
  return
}
const fileds = await this._uploaderFile(this.data.files);
let file_a=this.data.files[0].url
let file_b= fileds
// console.log(fileds)
let userInfo = wx.getStorageSync('userInfo')
console.log(userInfo)
// 开始添加
let data={
  follows:0,
  views:0,
  status:1,
  tiem:new Date().getTime(),
recipeName,
recipeTypeid,
recipeMakes,
pic:file_b,
userInfo,
}
let res = await Api.add(Config.tables.recipeTable,data)
console.log(res)
if(res._id){
  wx.showToast({
    title: '添加成功',
  })

  setTimeout(()=>{
    wx.switchTab({
      url: '../personal/personal',
      success: function (res) {
        // console.log(res)
        var page = getCurrentPages().pop();  
        if (page == undefined || page == null) return;  
        page.onLoad();
      }
    })
  },1500)
}
},

    //多图文件上传

    async _uploaderFile(files){
      // console.log(files)
      let fileAllpromise=[];// 全部的promise对象
files.forEach((item,index)=>{
  let extName=item.url.split('.').pop();
  let fileName = new Date().getTime()+'_'+index+'.'+extName;
  let promise=wx.cloud.uploadFile({
    // 上传至云端的路径
    cloudPath:"recipes/"+fileName,
    // 小程序临时文件路径
    filePath:item.url
  })
  fileAllpromise.push(promise)
})
// console.log(fileAllpromise)
return await Promise.all(fileAllpromise)
    }
})