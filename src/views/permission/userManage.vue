<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="userName" size="small" clearable :placeholder="$t('sys_c001')" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="initAccount(1)">{{ $t('sys_c002') }}</el-button>
      </el-form-item>
      <el-form-item class="el-item-right">
        <el-button size="small" type="primary" @click="addUser(0,1)">{{ $t('sys_c011') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="userList"
      :height="cliHeight"
      border
      style="width: 100%;margin: 20px 0;"
      :header-cell-style="{color:'#909399',textAlign:'center'}"
      :cell-style="{textAlign:'center'}"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255,1)"
    >
      <el-table-column prop="account" :label="$t('sys_c003')" min-width="100" />
      <el-table-column prop="pwd_str" :label="$t('sys_c016')" min-width="80" />
      <el-table-column prop="role_name" :label="$t('sys_c004')" min-width="100" />
      <el-table-column prop="status" :label="$t('sys_c005')" min-width="100">
        <template slot="header">
          <el-dropdown trigger="click" @command="(command) => handleNewwork(command)">
            <span style="color:#909399" :class="[status?'dropdown_title':'']"> {{ $t('sys_c005') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,idx) in statusOption" :key="idx" :class="{'dropdown_selected':idx===status}" :command="idx">{{ item===''?$t('sys_l053'):item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.status===1?'success':'warning'"> {{ statusOption[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="country_code" label="投放国家" min-width="100">
        <template slot-scope="scope">
          {{ getLabelByVal(scope.row.country_code, countryList) || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.remark ? scope.row.remark : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="account" :label="$t('sys_c003')" min-width="100" />
      <el-table-column prop="valid_time" :label="$t('sys_c020')" min-width="100">
        <template slot-scope="scope">
          {{ $baseFun.resetTime(scope.row.valid_time*1000) }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('sys_c010')" min-width="100">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="addUser(scope.row,2)">{{ $t('sys_c027') }}</el-button>
          <el-button size="small" type="danger" plain @click="baseHandle(scope.row)">{{ $t('sys_c028') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="layui_page">
      <el-pagination
        background
        :page-sizes="pageOption"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="setPageSize"
        @current-change="switchPage"
      />
    </div>

    <!-- 新增-->
    <el-dialog :title="userForm.type===1?'新增用户':'编辑用户'" center :visible.sync="userModel" :close-on-click-modal="false" width="500px">
      <el-form ref="userForm" size="small" :model="userForm" label-width="120px" :rules="userRules">
        <el-form-item :label="$t('sys_c009')+':'" prop="account">
          <el-input v-model="userForm.account" :placeholder="$t('sys_l006')" />
        </el-form-item>
        <el-form-item :label="$t('sys_c014')+':'" prop="role_id">
          <el-select v-model="userForm.role_id" clearable :placeholder="$t('sys_c015')" style="width:100%;">
            <el-option v-for="item in roleOption" :key="item.role_id" :label="item.name" :value="item.role_id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sys_c016')+':'" prop="password">
          <el-input v-model="userForm.password" :placeholder="$t('sys_l007')" :type="showEye?'password':''">
            <template #suffix>
              <div class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="showEye ? 'eye' : 'eye-open'" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="userForm.type===1" label="确认密码:'" prop="surePwd">
          <el-input v-model="userForm.surePwd" placeholder="请输入确认密码" :type="showEye?'password':''">
            <template #suffix>
              <div class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="showEye ? 'eye' : 'eye-open'" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="投放国家：" prop="country_code">
          <el-select v-model="userForm.country_code" clearable placeholder="请输入投放国家" style="width:100%;" :disabled="userForm.type===2">
            <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="userForm.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item :label="$t('sys_c020')+':'" prop="sureTime">
          <el-date-picker v-model="userForm.sureTime" type="datetime" :placeholder="$t('sys_c021')" />
        </el-form-item>
        <el-form-item :label="$t('sys_c022')+':'" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio v-for="(item,idx) in statusOption" v-show="item!==''" :key="idx" :label="idx">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="userModel=false">{{ $t('sys_c023') }}</el-button>
          <el-button :loading="isLoading" type="primary" @click="creatBtn('userForm')">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5';
import { resetPage,successTips ,getLabelByVal } from '@/utils/index'
import { adminuser,rolelist,doadminuser } from '@/api/permission'
export default {
  data() {
    return {
      userName: '',
      limit: 10,
      offest: 1,
      total: 0,
      status: '',
      userList: [],
      roleOption: [],
      showEye: true,
      loading: false,
      isLoading: false,
      userModel: false,
      pageOption: resetPage(),

      userForm: {
        type: 0,
        account: '',
        role_id: '',
        password: '',
        surePwd: '',
        country_code: '',
        sureTime: '',
        status: 1,
        remark:''
      },
      countryList: [
        { label: '巴西',value: 'BR' },
        { label: '泰国',value: 'TH' },
        { label: '越南',value: 'VN' },
        { label: '巴基斯坦',value: 'PK' },
        { label: '美国',value: 'US' },
        { label: '英国',value: 'GB' },
        { label: '马来西亚',value: 'MY' },
      ],
      cliHeight: 0
    }
  },
  computed: {
    userRules() {
      return {
        account: [{ required: true, message: this.$t('sys_l006'), trigger: 'blur' }],
        role_id: [{ required: true, message: this.$t('sys_c015'), trigger: 'change' }],
        password: [{ required: true, message: this.$t('sys_l007'), trigger: 'blur' }],
        surePwd: [{ required: true, message: this.$t('sys_c018'), trigger: 'blur' }],
        country_code: [{ required: true, message: '请选择投放国家', trigger: 'change' }],
        sureTime: [{ required: true, message: this.$t('sys_c021'), trigger: 'change' }],
        status: [{ required: true, message: this.$t('sys_c029'), trigger: 'change' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'change' }],

      }
    },
    statusOption() {
      return ['',this.$t('sys_c043'),this.$t('sys_c044')]
    },
  },
  mounted() {

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  created() {
    this.getRoleList();
    this.initAccount()
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);

  },
  methods: {
    setPageSize(val) {
      this.limit = val;
      this.initAccount()
    },
    switchPage(val) {
      this.offest = val;
      this.initAccount()
    },
    showPwd() {
      this.showEye = !this.showEye;
    },
    getRoleList() {
      rolelist({ page: -1,limit: 200 }).then(res => {
        this.roleOption = res.data.list || [];
      })
    },
    handleNewwork(type) {
      this.status = type;
      this.initAccount(1)
    },
    initAccount(num) {
      this.offest = num || this.offest;
      const params = {
        account_type: 2,
        page: this.offest,
        limit: this.limit,
        status: this.status || -1,
        account: this.userName,
      }
      this.loading = true;
      adminuser(params).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.userList = res.data.list || [];
      })
    },
    baseHandle(row,type) {
			const that = this;
			that.$confirm(that.$t('sys_c046',{ value: that.$t('sys_c028') }),that.$t('sys_l013'), {
				type: 'warning',
				confirmButtonText: that.$t('sys_c024'),
				cancelButtonText: that.$t('sys_c023'),
				beforeClose: function(action, instance,done) {
					if (action === 'confirm') {
						doadminuser({ ptype: 3,del_id: [row.uid] }).then(res => {
							that.initAccount();
              successTips(that)
							done();
						})
					} else {
						done();
					}
				}
      }).catch(() => {
        that.$message({ type: 'info',message: that.$t('sys_c048') });
      })
		},
    addUser(row = {},idx) {
      this.userModel = true;
      this.userForm.type = idx;
      this.$nextTick(() => {
        this.$refs.userForm.resetFields();
        if (idx === 1) return;
        this.userForm.uid = row.uid;
        this.userForm.status = row.status;
        this.userForm.account = row.account;
        this.userForm.role_id = row.role_id;
        this.userForm.country_code = row.country_code;
        this.userForm.password = row.pwd_str;
        this.userForm.sureTime = row.valid_time > 0 ? row.valid_time * 1000 : '';
      })
    },
    creatBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            account_type: 2,
            ptype: this.userForm.type,
            uid: this.userForm.uid,
            account: this.userForm.account,
            role_id: this.userForm.role_id,
            pwd: md5(this.userForm.password),
            pwd_str: this.userForm.password,
            valid_time: Date.parse(this.userForm.sureTime) / 1000,
            country_code: this.userForm.country_code,
            status: this.userForm.status,
            remark:this.userForm.remark,
          }
          this.userForm.type === 0 ? delete params.uid : '';
          this.isLoading = true;
          doadminuser(params).then(res => {
            successTips(this)
            this.isLoading = false;
            if (!res || res.code === 100005) return;
            this.userModel = false;
            this.initAccount()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    getLabelByVal
  }
}
</script>

<style scoped lang="scss">

</style>
