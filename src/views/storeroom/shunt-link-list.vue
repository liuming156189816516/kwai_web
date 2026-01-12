<template>
  <div>
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item class="select_body">
        <el-input clearable :placeholder="$t('sys_l073')" v-model="model1.file_name" />
      </el-form-item>
      <el-form-item :label="$t('sys_l074')">
        <el-date-picker v-model="model1.ipCtime" type="daterange" range-separator="至" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initDatalist(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
      <el-form-item class="el-item-right">
        <el-button type="warning" plain @click=jumpManage>{{ $t('sys_l075') }}</el-button>
        <el-button type="success" plain @click="creatLintBtn">{{ $t('sys_l076') }}</el-button>
        <el-button type="danger" plain :disabled="checkIdArry.length == 0" @click="batchDel">{{ $t('sys_l048')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="group_main">
      <div class="tab_check_warp">
        <i slot="reference" class="el-icon-info"></i>
        <div> 已选 <span class="check_num">{{ checkIdArry.length || 0 }}</span> 项</div>
      </div>
      <div>
        <el-table :data="dataList" border height="640" v-loading="loading" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" ref="serveTable"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }"
          @selection-change="handleSelectionChange" @row-click="rowSelectChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" :label="$t('sys_l077')" minWidth="140" />
          <el-table-column prop="acc_type" :label="$t('sys_l078')" minWidth="100" />
          <el-table-column prop="account_type" :label="$t('sys_l079')" minWidth="100">
            <template slot-scope="scope">
              {{ deviceOption[scope.row.account_type] }}
            </template>
          </el-table-column>
          <el-table-column prop="success_num" :label="$t('sys_l080')" minWidth="100" />
          <el-table-column prop="fail_num" :label="$t('sys_l081')" minWidth="100" />
          <el-table-column prop="remark" :label="$t('sys_l082')" minWidth="100" />
          <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="148">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c010')" width="220">
            <template slot-scope="scope">
              <el-button :disabled="checkIdArry.length > 0" size="small" type="primary" @click.stop="showDetailbtn(scope.row)">{{ $t('sys_l083') }}</el-button>
              <el-button :disabled="checkIdArry.length > 0" @click.stop type="text" size="mini">
                <el-dropdown @command="(command) => { handleCommand(scope.row, command) }" trigger="click">
                  <span class="el-dropdown-link">
                    <el-button type="success" plain size="mini" :disabled="checkIdArry.length > 0">
                      {{ $t('sys_c083') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item, idx) in moreOption" :key="idx" :command="{ item, idx }" v-show="idx != 0">
                      {{ item }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination background @size-change="homelHandleSize" @current-change="homeHandleCurrent"
            :page-size="model1.limit" :page-sizes="pageOption" layout="total, sizes, prev, pager, next, jumper"
            :total="model1.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增-->
    <el-dialog :title="$t('sys_l086')" center :visible.sync="flowModel" :close-on-click-modal="false" width="600px">
      <el-form ref="shuntForm" size="small" :model="shuntForm" label-width="120px" :rules="shuntRules">
        <template>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('sys_l087') + '：'">
                <div style="line-height: 24px;">
                  {{ shuntForm.shunt_type == 1 ? $t('sys_c084') : shuntForm.shunt_type == 2 ? $t('sys_c086') : $t('sys_c087') }}
                  <span style="color: #f56c6c;" v-if="shuntForm.shunt_type == 1">{{ $t('sys_c085') }}</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('sys_l078') + '：'" prop="shunt_name">
                <el-input v-model="shuntForm.shunt_name" clearable maxlength="15" show-word-limit
                  :placeholder="$t('sys_mat061', { value: $t('sys_l078') })" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('sys_l088') + '：'" prop="shunt_type">
                <el-radio-group v-model="shuntForm.shunt_type">
                  <el-radio v-for="(item, idx) in shuntOption" :key="idx" :label="idx" v-show="item != ''">{{ item}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="shuntForm.shunt_type == 1">
              <el-form-item :label="$t('sys_l099') + '：'" :style="shuntForm.is_custom?'margin-bottom: 0;':''">
                <el-checkbox v-model="shuntForm.is_custom">使用</el-checkbox>
                <!-- <el-radio-group v-model="shuntForm.is_custom" @change="customShunt">
                      <el-radio label="1">使用</el-radio>
                    </el-radio-group> -->
              </el-form-item>
              <el-form-item v-if="shuntForm.is_custom">
                <el-input v-model="shuntForm.custom_number" type="textarea" :placeholder="$t('sys_mat021')" :rows="6" maxlength="200" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="shuntForm.shunt_type == 2">
              <el-form-item :label="$t('sys_l100') + '：'">
                <div class="website_list">
                  <div class="website_item" v-for="(item,idx) in websiteOption" :key="idx">
                    <el-input v-model="item.url" clearable  :placeholder="$t('sys_mat061', { value: $t('sys_l101') })" />
                    <i class="el-icon-circle-plus-outline" v-if="idx==0" @click="addWebsite" />
                    <i class="el-icon-circle-close" v-else @click="delWebsite(idx)" />
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="shuntForm.shunt_type == 3">
              <el-form-item :label="$t('sys_g058') + '：'" prop="seat_id">
                <el-select class="select_ele" v-model="shuntForm.seat_id" :placeholder="$t('sys_c052')">
                  <el-option v-for="(item, idx) in seatOption" :key="idx" :label="item" :value="idx" v-show="item != ''" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('sys_g087') + '：'" prop="short_type">
                <el-radio-group v-model="shuntForm.short_type">
                  <el-radio v-for="(item, idx) in shortOption" :key="idx" :label="idx" v-show="item != ''">
                    <span class="recom_mode" style="position: absolute;top: -10px;right: 0;" v-if="idx==1">推荐</span>
                    {{ item }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="shuntForm.shunt_type != 2">
              <el-form-item>
                <template slot="label">
                  <el-tooltip class="item" effect="dark" :content="$t('sys_c088')" placement="top-start">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                  {{ $t('sys_l090') }}：
                </template>
                <el-input v-model="shuntForm.text_value" type="textarea" :placeholder="$t('sys_mat021')" :rows="6"
                  maxlength="200" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label-width="0" style="text-align:center;">
            <el-button @click="flowModel = false">{{ $t('sys_c023') }}</el-button>
            <el-button type="primary" @click="submitShurtBtn('shuntForm')">{{ $t('sys_c024') }}</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { successTips, resetPage } from '@/utils/index'
import { getaccountfilelist, dobathdelaccountfile } from '@/api/storeroom'
export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 10,
        total: 0,
        ipCtime: "",
        file_name: "",
      },
      pageOption: resetPage(),
      loading: false,
      flowModel: false,
      numModelWidth: "",
      dialog_title: "",
      dataList: [{},{}],
      seatOption: [],
      checkIdArry: [],
      websiteOption:[{url:""}],
      shuntForm: {
        id: "",
        shunt_name: "",
        shunt_type: 1,
        seat_id: "",
        short_type: 1,
        text_value: "",
        is_custom: false,
        custom_number: ""
      }
    }
  },
  computed: {
    moreOption() {
      return ["", this.$t('sys_l084'), this.$t('sys_l085')]
    },
    deviceOption() {
      return ["", this.$t('sys_g085'), this.$t('sys_g093')]
    },
    shuntOption() {
      return ["", this.$t('sys_g084'), this.$t('sys_g085'), this.$t('sys_g086')]
    },
    shortOption() {
      return ["", this.$t('sys_g088'), this.$t('sys_g089'), this.$t('sys_g090')]
    },
    shuntRules() {
      return {
        shunt_name: [{ required: true, message: this.$t('sys_mat061', { value: this.$t('sys_l078') }), trigger: 'blure' }],
        shunt_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        seat_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        short_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        text_value: [{ required: true, message: this.$t('sys_mat020'), trigger: 'blure' }],
      }
    }
  },
  created() {
    //   this.initShuntlist();
  },
  methods: {
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => { return item.id })
    },
    rowSelectChange(row, column, event) {
      let refsElTable = this.$refs.serveTable;
      let findRow = this.checkIdArry.find(item => item == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    restQueryBtn() {

    },
    jumpManage(){
      this.$router.push({path:'/share-link-manage'});
    },
    showDetailbtn(){
      this.$router.push({path:'/shunt-link-detail'});
    },
    initShuntlist(num) {
      this.loading = true;
      const sTime = this.model1.ipCtime;
      this.model1.page = num || this.model1.page;
      let params = {
        page: this.model1.page,
        limit: this.model1.limit,
        name: this.model1.file_name,
        start_time: sTime ? this.$baseFun.resetTime(sTime[0], 1) : -1,
        end_time: sTime ? this.$baseFun.resetTime(sTime[1], 1) : -1
      }
      getaccountfilelist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.dataList = res.data.list || [];
      })
    },
    homelHandleSize(val) {
      this.model1.limit = val;
      this.initShuntlist();
    },
    homeHandleCurrent(val) {
      this.model1.page = val;
      this.initShuntlist();
    },
    creatLintBtn() {
      this.flowModel = true;
      this.$nextTick(()=>{
        this.websiteOption = [{url:""}];
        this.$refs.shuntForm.resetFields();
      })
    },
    batchDel() {
      let that = this;
      that.$confirm(that.$t('sys_c046', { value: that.$t('sys_c028') }), that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function (action, instance, done) {
          if (action === 'confirm') {
            dobathdelaccountfile({ ids: that.checkIdArry }).then(res => {
              that.initDatalist();
              successTips(that)
              done();
            })
          } else {
            done();
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: that.$t('sys_c048') });
      })
    },
    submitShurtBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    customShunt(val) {
      console.log(val);
    },
    addWebsite(){
      this.websiteOption.push({url:""})
    },
    delWebsite(idx){
      for (let k = 0; k < this.websiteOption.length; k++) {
        if (k == idx) {
          this.websiteOption.splice(k,1)
        }
      }
    },
    handleCommand(row,type){
      if (type.idx == 1) {
        this.$router.push({path:'/shunt-link-fans-detail'});
      }
    }
  },
  watch: {
    shuntForm(val) {
      if (!val) {
        this.deviceType = 1;
        this.stepsActive = 1;
        this.accountForm.remark = "";
        this.accountForm.group_id = "";
      }
    }
  }
}
</script>
<style scoped lang="scss">
.custom_dialog {
  ::v-deep .el-dialog {
    background-color: #f2f7fa !important;
  }
}

.storage_tips {
  font-size: 14px;
  line-height: 1.5;
}

.export_type,
.nummber_type {
  border: 0.5px solid #eee;
  padding: 8px;
  margin: 10px;
  background: #fff;
  border-radius: 5px;

  .device_type {
    display: flex;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;

    .device_text {
      color: #333;
      font-weight: 700;
    }

    .el-button {
      padding: 6px;
    }
  }

  .device_desc {
    width: 100%;
    font-size: 14px;
    margin-top: 10px;
    line-height: 1.6;
    padding-right: 40px;
    box-sizing: border-box;
  }
}

.nummber_type {
  .device_type {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
}

.label_radius_title,
.label_title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
  margin-left: 16px;
  position: relative;
  word-break: break-all;
}

.label_title {
  margin-left: 0;
}

.label_radius_title::after {
  content: "";
  width: 4px;
  height: 4px;
  font-size: 20px;
  border-radius: 50%;
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #606266;
}

.upload_img {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 30px;
  margin-top: 10px;

  img {
    width: 280px;
    height: 188px;
    margin: 10px 0;
  }
}
</style>