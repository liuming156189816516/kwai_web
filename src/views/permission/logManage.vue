<template>
    <div>
      <el-form :inline="true">
        <el-form-item >
          <el-input size="small" v-model="userUid" :placeholder="$t('sys_g001')" />
        </el-form-item>
        <el-form-item >
          <el-button size="small" icon="el-icon-search" type="primary">{{ $t('sys_c002') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="userList" height="656" border style="width: 100%;margin: 20px 0;" :header-cell-style="{color:'#909399',textAlign:'center'}" :cell-style="{textAlign:'center'}">
        <el-table-column prop="account" :label="$t('sys_g001')" minWidth="100" />
        <el-table-column prop="userName" :label="$t('sys_g002')" minWidth="100" />
        <el-table-column prop="desc" :label="$t('sys_g003')" minWidth="100" />
        <el-table-column prop="fun" :label="$t('sys_g004')" minWidth="100" />
        <el-table-column prop="userIp" :label="$t('sys_g005')" minWidth="100" />
        <el-table-column prop="cTime" :label="$t('sys_c008')" minWidth="100" />
      </el-table>
      <div class="layui_page">
        <el-pagination background @size-change="setPageSize" @current-change="switchPage" :page-sizes="pageOption"
          :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </template>
  
  <script>
  import {resetPage} from "../../utils/index"
  export default {
    data() {
      return {
        userUid:"",
        limit:10,
        total:0,
        userList:[
          {
            account:"ceshi001",
            userName:"测试人员",
            desc:"添加菜单",
            fun:"AdminMemberControllerDoMenu",
            userIp:"129.158.52.45",
            cTime:"2024-01-10 20:23:59",
          }
        ],
        roleOption:[],
        userModel:false,
        pageOption:resetPage(),
  
        userForm:{
          type:0,
          account:"",
          group_id:"",
          password:"",
          surePwd:"",
          portNum:"",
          sureTime:"",
          status:1,
        }
      }
    },
    computed:{
      userRules(){
        return {
          account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
          group_id: [{ required: true, message: '请选择权限', trigger: 'change' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          surePwd: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
          portNum: [{ required: true, message: '请输入端口数量', trigger: 'blur' }],
          sureTime: [{ required: true, message: '请选择失效时间', trigger: 'change' }],
          status: [{ required: true, message: '请选择账号状态', trigger: 'change' }],
        }
      },
      statusOption(){
        return ["启用","禁用"]
      }
    },
    methods:{
      setPageSize(){
      },
      switchPage(){
    
      },
      addUser(row={},idx){
        this.userModel=true;
        this.userForm.type=idx;
        this.$nextTick(()=>{
          idx==1?this.userForm={...row}:"";
          this.$refs.userForm.resetFields();
        })
      },
      creatBtn(formName){
        console.log(this.userForm);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    }
  }
  </script>