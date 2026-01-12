<template>
  <div class="custom_model" v-if="showModel">
    <div class="custom_mian">
      <div class="custom_header">
        <span>{{ title }}</span>
        <span class="custom_icon">
          <i class="el-icon-delete"></i>
        </span>
      </div>
      <div class="customl_content">{{ content  }}</div>
      <div class="customl_footer">
        <i class="el-icon-delete"></i>
        <el-button type="success">成功按钮</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { elButton, Select } from 'element-ui';
import ElementUI from 'element-ui'
export default {
  component:{ElementUI},
  props:{
    radio:1,
    showModel:{
      type:Boolean,
      default:true
    },
    title:{
      type:String,
      default:"提示"
    },
    content:{
      type:String,
      default:"你好，我是全局组件~"
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.custom_model{
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .5);
  .custom_mian{
    min-width: 450px;
    height: max-content;
    padding: 20px;
    border-radius: 2px;
    box-sizing: border-box;
    background-color: #fff;
    // border: 1px solid #dcdfe6;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    .custom_header{
      display: flex;
      color: salmon;
      justify-content: space-between;
      .custom_icon{
        cursor: pointer;
      }
    }
    .customl_content{
      margin: 20px 0;
    }
  }
  .customl_footer{
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>