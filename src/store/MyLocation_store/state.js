import localData from '../../data/addressList'
export const state = {
  aid:'',
  isShow:false,
  locationData:[],
  //显示默认地址
  isDefault: true,

  //是否显示删除
  isDelete: false,

  //是否显示邮政编码
  isPostal: true,

  //地址选择数据
  localData,
  // 新增(1)或者编辑(0)标识
  isAdd:0,
  title:"新增地址",
  //临时地址数据，用于判断用户是否修改地址数据
  temporaryAddressData: {},
}