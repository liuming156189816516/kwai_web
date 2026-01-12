<template>
  <div class="user_info">
    <div class="info_item">
        <div class="l_title">
          <i class="el-icon-user"></i>
          <span>{{ $t('sys_c003') }}</span>
        </div>
        <div class="r_right">{{ userInfo.account }}</div>
    </div>
    <div class="info_item">
        <div class="l_title">
          <i class="el-icon-date"></i>
          <span>{{ $t('sys_l019') }}</span>
        </div>
        <div class="r_right">{{ userInfo.valid_time>0?$baseFun.resetTime(userInfo.valid_time*1000):userInfo.valid_time }}</div>
    </div>
    <div class="info_item">
        <div class="l_title">
          <i class="el-icon-date"></i>
          <span>{{ $t('sys_l020') }}</span>
        </div>
        <div class="r_right">{{ userInfo.last_time }}</div>
    </div>
    <div class="info_item">
        <div class="l_title">
          <i class="el-icon-user"></i>
          <span>{{ $t('sys_l021') }}</span>
        </div>
        <div class="r_right">{{ userInfo.port_num }}</div>
    </div>
    <div class="info_item">
        <div class="l_title">
          <i class="el-icon-monitor"></i>
          <span>{{ $t('sys_l022') }}</span>
        </div>
        <div class="r_right">{{ userStatus[userInfo.status]||'-' }}</div>
    </div>
  </div>
</template>

<script>
import { getuserinfo } from "@/api/login"
import { getUserInfo } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'
export default {
  data() {
    return {
      userInfo:[
        // {icon:"el-icon-user", title:"用户名", value:"admin"},
        // {icon:"el-icon-date", title:"到期时间", value:"admin"},
        // {icon:"el-icon-date", title:"剩余时间", value:"admin"},
        // {icon:"el-icon-s-platform", title:"WS端口", value:"admin"},
        // {icon:"el-icon-user", title:"账号风控状态", value:"admin"}
      ]
    }
  },
  computed:{
    userStatus(){
      return ["",this.$t('sys_c025'),this.$t('sys_c026')]
    }
  },
  created(){
    this.getUserInfo()
    // MessageBox.confirm(this.$t('sys_l105'), this.$t('sys_l013'), {
    //   confirmButtonText:this.$t('sys_c024'),
    //   closeOnClickModal:false, 
    //   showCancelButton:false, 
    //   showClose:false,
    //   type: 'warning'
    // }).then(() => {
    // })
  },
  methods:{
    getUserInfo(){
      getuserinfo({uid:getUserInfo().uid}).then(res=>{
        this.userInfo = res.data||"";
      })
    }
  }
}
</script>

<style scoped lang="scss">
.user_info{
    width: 100%;
    height: 100%;
    display: flex;
    // padding-top: 10px;
    align-items: center;
    flex-direction: column;
    // justify-content: center;
    .info_item{
      display: flex;
      min-width: 700px;
      flex-shrink: 0;
      border-left: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      justify-content: center;
      &>div{
        display: flex;
        height: 62px;
        font-size: 16px;
        padding-left: 10px;
        box-sizing: border-box;
        align-items: center;
      }
      .l_title{
        width: 40%;
        color: #909399;
        font-weight: 500;
        border-right: 1px solid #ebeef5;
        background-color: #fafafa;
        i{
          color: #909399;
          margin-right: 4px;
        }
      }
      .r_right{
        width: 60%;
      }
    }
    .info_item:last-child{
      border-bottom: 1px solid #ebeef5;
    }
}
</style>