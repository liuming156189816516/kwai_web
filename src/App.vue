<template>
  <div id="app">
    <!-- <keep-alive> -->
      <router-view />
    <!-- </keep-alive> -->
    <el-dialog title="📣尊敬的Bees用户" :visible.sync="notictStatus" width="35%" center :close-on-click-modal="false" :show-close="false">
      <div style="line-height: 1.8;font-size: 18px;letter-spacing: 1px;">为了提供更稳定、高效的服务，我们计划在2024年6月4日上午<span style="color: rgb(245, 108, 108);">09:00~10:00</span>进行系统服务升级维护工作。如有其他问题请联系官方客服，感谢您对我们的信任和支持！</div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="clostNotice" :disabled="closeTime">{{closeTime?timer+' 秒之后可关闭':'我知道了'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  data(){
    return{
      timer:10,
      closeTime:true,
      updateEvent:false
    }
  },
  computed: {
    notictStatus(){
      const status = this.$store.state.app.updateEvent;
      if(status){
        this.startTime();
      }
      return status;
    }
  },
  mounted() {
    if (getToken()) {
      //this.$store.dispatch('app/showNotice',true);
      this.$store.dispatch('user/getMenuInfo');
    }
  },
  methods:{
    clostNotice(){
      this.$store.dispatch('app/showNotice',false);
    },
    startTime() {
      let auth_timer = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          this.timer = 10;
          this.closeTime = false;
          clearInterval(auth_timer);
        }
      },1000);
    }
  }
}
</script>
