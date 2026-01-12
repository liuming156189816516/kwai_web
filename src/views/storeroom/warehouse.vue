<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item class="select_body">
        <el-input v-model="model1.file_name" clearable placeholder="请输入文件名" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="model1.ipCtime"
          type="daterange"
          :range-separator="$t('sys_c108')"
          :start-placeholder="$t('sys_c109')"
          :end-placeholder="$t('sys_c110')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initDatalist(1)">{{ $t('sys_c002') }}</el-button>
      </el-form-item>
      <el-form-item class="el-item-right">
        <el-button type="primary" :disabled="checkIdArry.length==0" @click="batchDel">{{ $t('sys_l048') }}</el-button>
        <el-button type="primary" :disabled="checkIdArry.length==0" @click="exportModel=true">{{
          $t('sys_mat050')
        }}
        </el-button>

        <el-button type="success" style="margin-left: 10px;" @click="nextbtn">批量入库</el-button>
      </el-form-item>
    </el-form>
    <div class="group_main">
      <div class="tab_check_warp">
        <i slot="reference" class="el-icon-info" />
        <div v-html="$t('sys_mat007',{value:checkIdArry.length})" />
      </div>
      <div>
        <el-table
          ref="serveTable"
          v-loading="loading"
          :data="dataList"
          border
          :height="autoHeight"
          row-key="id"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255,1)"
          style="width: 100%;"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          @selection-change="handleSelectionChange"
          @row-click="rowSelectChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" show-overflow-tooltip :label="$t('sys_l056')" min-width="140" />
          <el-table-column prop="acc_type" :label="$t('sys_l057')" min-width="100" />
          <el-table-column prop="status" :label="$t('sys_l059')" min-width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==1?'warning':'success'" size="small"> {{
                taskOption[scope.row.status]
              }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="success_num" :label="$t('sys_l060')" min-width="100" />
          <el-table-column prop="fail_num" :label="$t('sys_l061')" min-width="100" />
          <el-table-column prop="faccount" show-overflow-tooltip label="所属用户" min-width="100" />
          <el-table-column prop="remark" show-overflow-tooltip label="备注" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.remark ? scope.row.remark : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="itime" :label="$t('sys_l063')" min-width="148">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c010')" width="120">
            <template slot-scope="scope">
              <!-- <el-button size="small" type="primary" @click="moveTable(scope.$index)">
                <i class="el-icon-sort"></i>
              </el-button> -->
              <el-button
                :disabled="checkIdArry.length > 0"
                size="small"
                type="primary"
                @click.stop="showDetailbtn(scope.row)"
              >{{ $t('sys_l064') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination
            background
            :page-size="model1.limit"
            :page-sizes="pageOption"
            :current-page.sync="model1.page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="model1.total"
            @size-change="homelHandleSize"
            @current-change="homeHandleCurrent"
          />
        </div>
      </div>
    </div>
    <!-- 新增-->
    <el-dialog
      :class="{'custom_dialog':storeIdx==1}"
      :title="dialog_title"
      center
      :visible.sync="storeModel"
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form ref="accountForm" size="small" :model="accountForm" label-width="0" :rules="accountRules">
        <template v-if="storeIdx==1">
          <el-row>
            <el-col :span="12">
              <div class="export_type">
                <div class="device_type">
                  <h3 class="device_text">{{ $t('sys_l065') }}</h3>
                  <el-button type="primary" icon="el-icon-check" circle />
                </div>
                <div class="device_desc">
                  {{ $t('sys_m054') }}
                </div>
              </div>
            </el-col>
            <el-col :span="12" />
          </el-row>
          <el-row>
            <el-col v-for="(item,idx) in deviceOption" v-show="item" :key="idx" :span="12">
              <div class="nummber_type" @click="changeType(idx)">
                <div class="device_type">
                  <h3 class="device_text">{{ item }}</h3>
                  <el-button :type="deviceType==idx?'primary':''" icon="el-icon-check" circle />
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button class="el-item-right" size="small" type="primary" style="margin-top: 10px;" @click="nextbtn">
                {{ $t('sys_l069') }}
              </el-button>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="24" />
            <el-col :span="24">
              <el-form-item>
                <el-steps :active="stepsActive">
                  <el-step :title="$t('sys_c058')" :description="$t('sys_m056')" />
                  <el-step :title="$t('sys_m055')" :description="$t('sys_m057')" />
                  <el-step :title="$t('sys_mat034')" :description="$t('sys_m058')" />
                </el-steps>
              </el-form-item>
            </el-col>
            <template v-if="stepsActive==1">
              <el-col :span="12">
                <el-form-item prop="group_id">
                  <div class="label_radius_title">{{ $t('sys_c053') }}</div>
                  <el-select
                    v-model="accountForm.group_id"
                    clearable
                    filterable
                    :placeholder="$t('sys_c053')"
                    style="width:100%;"
                  >
                    <el-option v-for="item in groupOption" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 22px;">
                <el-form-item label-width="0">
                  <div class="label_radius_title" style="opacity: 0;">?????</div>
                  <el-popover v-model="visible" placement="top" width="260">
                    <p>
                      <el-input
                        v-model="accountForm.group_name"
                        size="small"
                        maxlength="10"
                        show-word-limit
                        :placeholder="$t('sys_c112')"
                      />
                    </p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="visible = false">{{ $t('sys_c023') }}</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        :loading="groupLoading"
                        :disabled="!accountForm.group_name.trim()"
                        @click="addGroup"
                      >{{ $t('sys_c024') }}
                      </el-button>
                    </div>
                    <el-button slot="reference" type="success">{{ $t('sys_c113') }}</el-button>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="fuid">
                  <div class="label_radius_title">选择用户</div>
                  <el-select v-model="accountForm.fuid" clearable filterable placeholder="请选择用户" style="width:50%;">
                    <el-option v-for="item in userData" :key="item.uid" :label="item.account" :value="item.uid" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <div class="label_radius_title">{{ $t('sys_c058') }}</div>
                  <div>{{ $t('sys_c114') }}</div>
                  <div class="submit_btn">
                    <el-button v-if="accountForm.group_id" class="custom_file1" style="margin-top: 0;">{{ $t('sys_c059') }}
                      <input id="uploadFile" ref="uploadclear" type="file" title=" " @change="checkDataIsUse">
                    </el-button>
                    <el-button v-else class="custom_file1" style="margin-top: 0;" @click="submitWayBtn('accountForm')">
                      {{ $t('sys_c059') }}
                    </el-button>
                    <span class="export_tips" @click="downLoadTemp">
                      <i class="el-icon-download" />{{ $t('sys_l066') }}
                    </span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item prop="file_name">
                  <div class="label_title">{{ $t('sys_l062') }}</div>
                  <el-input
                    v-model="accountForm.remark"
                    type="text"
                    :placeholder="$t('sys_c037')"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </template>
            <el-col v-if="stepsActive==2&&!checkLoading" :span="24">
              <el-form-item label-width="0" style="margin-bottom: 14px;">
                <div class="upload_img">
                  <img
                    style="width: 140px;height: 140px;margin-bottom: 10px;"
                    src="../../assets/upload_03.png"
                    alt=""
                    srcset=""
                  >
                  <template v-if="success_number>0||fail_number>0">
                    <div>{{ $t('sys_c115') }}</div>
                    <div v-html="$t('sys_c116',{s_number:success_number,f_number:fail_number})" />
                    <span
                      v-if="success_number==0&&stepsHide"
                      class=""
                      style="display: flex;cursor: pointer; font-size: 12px; align-items: center;color: #209cdf; margin-left: 20px;"
                      @click="exportErrFile"
                    >
                      <i class="el-icon-download" />
                      {{ $t('sys_c117') }}
                    </span>
                  </template>
                  <template v-else>
                    <div style="display: flex;align-items: center;">
                      检测中... <img
                        style="width: 20px; height: 20px;margin-left: 10px;"
                        src="../../assets/loading_icon.gif"
                        alt=""
                        srcset=""
                      >
                    </div>
                  </template>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="0">
                <template v-if="checkLoading">
                  <el-progress :text-inside="true" :stroke-width="14" :percentage="percentage" />
                  <div class="upload_img">
                    <img src="../../assets/upload_ing.png" alt="" srcset="">
                  </div>
                </template>
                <div v-if="stepsActive==3&&!checkLoading" class="upload_img">
                  <img src="../../assets/success.png" alt="" srcset="">
                  <div style="font-weight: 600;">{{ $t('sys_c119') }}</div>
                  <div v-html="$t('sys_c118',{s_number:success_number,f_number:fail_number})" />
                  <!-- <div>成功导入账号数量{{success_number}}条，失败数据{{fail_number}}条,点击完成或继续上传</div> -->
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="stepsHide" label-width="0" style="text-align:center;" class="el-item-bottom">
            <el-button v-if="stepsActive==2" @click="storeModel=false">{{ $t('sys_c073') }}</el-button>
            <el-button v-if="stepsActive==3" @click="restUpload">{{ $t('sys_c076') }}</el-button>
            <el-button v-if="stepsActive==2&&success_number>0" type="primary" @click="exportDataBtn('ipForm')">
              {{ $t('sys_c121') }}
            </el-button>
            <el-button v-if="stepsActive==3" type="primary" @click="storeModel=false">{{ $t('sys_c075') }}</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>

    <!-- 详情-->
    <el-dialog title="入库详情" center :visible.sync="detailModel" :close-on-click-modal="false" width="450">
      <el-table
        :data="model2.data"
        border
        height="540"
        style="width: 100%;"
        :header-cell-style="{ color: '#909399', textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column prop="account" :label="$t('sys_g027')" min-width="140" />
        <el-table-column prop="status" :label="$t('sys_l059')" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==1?'danger':'success'" size="small"> {{
              detailTaskOption[scope.row.status]
            }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" show-overflow-tooltip :label="$t('sys_c071')" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.reason ? scope.row.reason : '-' }}
          </template>
        </el-table-column>
      </el-table>
      <div class="layui_page">
        <el-pagination
          background
          :page-sizes="pageOption"
          :page-size="model2.limit"
          :current-page.sync="model2.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.model2.total"
          @size-change="detailHandleSize"
          @current-change="detailHandleCurrent"
        />
      </div>
    </el-dialog>

    <!-- 导出-->
    <el-dialog :title="$t('sys_mat050')" center :visible.sync="exportModel" :close-on-click-modal="false" width="360px">
      <el-form ref="accountForm" size="small" :model="accountForm" label-width="80px" :rules="accountRules">
        <el-form-item :label="$t('sys_mat055')" prop="export_type">
          <el-select v-model="accountForm.export_type" :placeholder=" $t('sys_c052')">
            <el-option v-for="(item,idx) in exportOption" v-show="item!=''" :key="idx" :label="item" :value="idx" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" style="text-align:center;margin-top:40px;" class="el-item-bottom">
          <el-button @click="exportModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" :loading="isDownLoading" @click="exportBtn('accountForm')">{{
            $t('sys_c024')
          }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import {
  getaccountfilelist,
  getaccountgrouplist,
  doaccountgroup,
  checkaccountfile,
  addaccount,
  getaccountschedule,
  getaccountloglist,
  dooutputaccountlog,
  dobathdelaccountfile
} from '@/api/storeroom'
import { resetTime } from '../../utils'
import { adminuser } from '@/api/permission.js'

export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 10,
        total: 0,
        ipCtime: '',
        file_time: '',
        file_name: '',
      },
      visible: false,
      loading: false,
      stepsHide: true,
      storeModel: false,
      groupLoading: false,
      checkLoading: false,
      isDownLoading: false,
      fail_number: 0,
      dialog_title: '',
      dataList: [],
      success_number: 0,
      checkIdArry: [],
      groupOption: [],
      userData: [],
      success_list: [],
      success_name: '',
      storeIdx: 1,
      percentage: 0,
      deviceType: 2,
      stepsActive: 1,
      errFileUrl: '',
      setInter: 2000,
      waitTimer: null,
      autoHeight: null,
      accountForm: {
        id: '',
        remark: '',
        ip_file: '',
        file_name: '',
        group_id: '',
        group_name: '',
        data_way: 1,
        device_type: 1,
        export_type: '',
        protocol_type: 0,
        fuid: ''
      },
      pageOption: resetPage(),
      randomNum: [1, 2, 4, 8, 3, 8, 4, 6, 3, 8],
      detailModel: false,
      exportModel: false,
      model2: {
        id: '',
        page: 1,
        limit: 10,
        total: 0,
        data: []
      }
    }
  },
  computed: {
    taskOption() {
      return ['', this.$t('sys_mat046'), this.$t('sys_mat047')]
    },
    deviceOption() {
      return ['', this.$t('sys_l067'), this.$t('sys_l068')]
    },
    detailTaskOption() {
      return ['', this.$t('sys_mat048'), this.$t('sys_mat049')]
    },
    exportOption() {
      return ['', this.$t('sys_mat051'), this.$t('sys_mat052'), this.$t('sys_mat053')]
    },
    accountRules() {
      return {
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        fuid: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        export_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
      }
    },

  },
  watch: {
    storeModel(val) {
      if (!val) {
        this.deviceType = 2;
        this.stepsActive = 1;
        this.errFileUrl = '';
        this.success_name = 0;
        this.success_list = [];
        this.fail_number = 0;
        this.accountForm.remark = '';
        this.accountForm.group_id = '';
        this.accountForm.fuid = '';
      }
    },
    exportModel(val) {
      if (!val) {
        this.$refs.accountForm.resetFields();
        this.accountForm.export_type = '';
      }
    }
  },
  created() {
    this.initGroup();
    this.initDatalist();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
    this.getAdminUserFun()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    setFullHeight() {
      this.autoHeight = document.documentElement.clientHeight - 260;
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => {
        return item.id
      })
    },
    moveTable(index) {
      // if (index > 0) {
      //   const upDate = this.data[index - 1];
      //   this.data.splice(index - 1, 1);
      //   this.data.splice(index, 0, upDate);
      // } else {
      //   alert("已经是第一条，不可上移");
      // }

      // if (index + 1 === this.data.length) {
      //   alert("已经是最后一条，不可下移");
      // } else {
      //   const downDate = this.data[index + 1];
      //   this.data.splice(index + 1, 1);
      //   this.data.splice(index, 0, downDate);
      // }
    },
    rowSelectChange(row, column, event) {
      const tableCell = this.$refs.serveTable;
      if (this.checkIdArry.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    initDatalist(num) {
      this.loading = true;
      const sTime = this.model1.ipCtime;
      this.model1.page = num || this.model1.page;
      const params = {
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
        this.$nextTick(() => {
          const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
          tableBodyWrapper.scrollTop = 0
        })
      })
    },
    async initGroup() {
      const { data } = await getaccountgrouplist({ page: 1, limit: 100 });
      this.groupOption = data.list || [];
    },
    async addGroup() {
      this.groupLoading = true;
      const result = await doaccountgroup({ ptype: 1, name: this.accountForm.group_name });
      this.groupLoading = false;
      if (result.code !== 0) return;
      this.visible = false;
      this.initGroup();
      successTips(this)
      setTimeout(() => {
        this.accountForm.group_id = this.groupOption.filter(item => item.name == this.accountForm.group_name)[0].id;
      }, 600)
    },
    batchExport() {
      this.storeModel = true;
      this.$nextTick(() => {
        this.storeIdx = 1;
        this.dialog_title = this.$t('sys_mat043');
      })
    },
    nextbtn() {
      this.storeModel = true;
      this.$nextTick(() => {
        this.storeIdx = 2;
        this.dialog_title = `${this.$t('sys_mat045')}`;
      })
    },
    changeType(idx) {
      this.deviceType = idx;
    },
    submitWayBtn(formName) {
      this.$refs[formName].validate(valid => {
      })
    },
    async checkDataIsUse() {
      this.errFileUrl = '';
      this.success_list = [];
      this.fail_number = 0;
      this.success_number = 0;
      const files = this.$refs.uploadclear.files[0];
      const formData = new FormData();
      formData.append('file', files);
      this.stepsHide = false;
      this.stepsActive = 2;
      this.$refs.uploadclear.value = null;
      const result = await checkaccountfile(formData);
      this.stepsHide = true;
      if (result.code != 0) return;
      this.errFileUrl = result.data.url;
      this.success_name = result.data.name;
      this.success_list = result.data.success_list;
      this.fail_number = result.data.fail_number;
      this.success_number = result.data.success_number || 0;
    },
    async exportDataBtn() {
      const params = {
        name: this.success_name,
        account_type: this.deviceType,
        success_list: this.success_list,
        remark: this.accountForm.remark,
        group_id: this.accountForm.group_id,
        fuid: this.accountForm.fuid,
      }
      this.startPercent();
      this.fail_number = 0;
      this.success_number = 0;
      this.stepsHide = false;
      this.checkLoading = true;
      const result = await addaccount(params);
      if (result.code != 0) return;
      this.waitTimer = setInterval(async() => {
        const getResult = await getaccountschedule({ id: result.data.id })
        if (getResult.code != 0) return;
        if (getResult.data.up_status == 2) {
          this.checkLoading = false;
          this.stepsActive = 3,
            this.stepsHide = true;
          clearInterval(this.waitTimer);
          this.initDatalist();
          this.fail_number = getResult.data.fail;
          this.success_number = getResult.data.success;
        }
      }, this.setInter)
    },
    restUpload() {
      this.storeIdx = 2;
      this.stepsActive = 1;
      this.accountForm.remark = '';
      this.accountForm.group_id = '';
    },
    startPercent() {
      this.percentage = 0;
      this.progrTimer = setInterval(() => {
        const curPercent = Number(this.randomNum[Math.floor(Math.random() * this.randomNum.length)]);
        if (this.percentage >= 55) {
          if (this.percentage < 96) {
            this.percentage++
          } else {
            this.percentage = 99
            clearInterval(this.progrTimer)
          }
        } else {
          this.percentage = this.percentage + curPercent
        }
      }, 500)
    },
    exportErrFile() {
      window.location.href = this.errFileUrl;
    },
    homelHandleSize(val) {
      this.model1.limit = val;
      this.initDatalist();
    },
    homeHandleCurrent(val) {
      this.model1.page = val;
      this.initDatalist();
    },
    showDetailbtn(row) {
      this.model2.data = [];
      this.model2.file_id = row.id;
      this.detailModel = true;
      this.getDetail();
    },
    getDetail() {
      const params = {
        page: this.model2.page,
        limit: this.model2.limit,
        file_id: this.model2.file_id
      }
      getaccountloglist(params).then(res => {
        this.model2.total = res.data.total;
        this.model2.data = res.data.list || [];
      })
    },
    detailHandleSize(val) {
      this.model2.limit = val;
      this.getDetail();
    },
    detailHandleCurrent(val) {
      this.model2.page = val;
      this.getDetail();
    },
    exportBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDownLoading = true;
          dooutputaccountlog({ ptype: this.accountForm.export_type, ids: this.checkIdArry }).then(res => {
            this.isDownLoading = false;
            if (res.code != 0) return;
            this.exportModel = false;
            location.href = res.data.url;
          })
        }
      })
    },
    batchDel() {
      const that = this;
      that.$confirm(that.$t('sys_c046', { value: that.$t('sys_c028') }), that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            dobathdelaccountfile({ ids: that.checkIdArry }).then(res => {
              instance.confirmButtonLoading = false;
              that.initDatalist();
              successTips(that)
              done();
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: that.$t('sys_c048') });
      })
    },
    downLoadTemp() {
      const txt = '{"cookies":{" store-country-code-src":"uid"," tt-target-idc":"useast5"," sid_guard":"c9c2fb797bd319413d92c7f0910d748e%7C1743471305%7C15552000%7CSun%2C+28-Sep-2025+01%3A35%3A05+GMT"," store-country-code":"us"," uid_tt_ss":"40cefe14a1422d444d7ea194aa7bd071b4edadd1b3b1401787c6daad2f935a47"," store-idc":"useast5"," sid_tt":"c9c2fb797bd319413d92c7f0910d748e"," ttreq":"1$b6e17eec2f4e34b65ed5ffa6d71924b0f29442cc"," uid_tt":"40cefe14a1422d444d7ea194aa7bd071b4edadd1b3b1401787c6daad2f935a47"," msToken":"QWrR-1vXk8DkWIo7qyE9s3isGUQcSQFCF6vcKkJ7WFowO9oEDuvRW72i2xTu-hw9-S5aVP47efOU4UymPknrC-QcgTu6jtpQ6ZqnqVpUnRSwrZhQOnB0WnotUYD4Zo0k8KsrFr88FuLL2YTfXLRA1I37Zt1q"," sessionid_ss":"c9c2fb797bd319413d92c7f0910d748e","passport_csrf_token":"8448f375767375bf8fe4f25c323a374a"," tt_ticket_guard_has_set_public_key":"1"," passport_csrf_token_default":"8448f375767375bf8fe4f25c323a374a"," cmpl_token":"AgQQAPNSF-RP_bHdPee6ed0_YrbZBJcf6nZYNj7yw"," store-country-sign":"MEIEDENqsYCBbgTpKaC8IQQgsWHYdzE-h5MK7Sv_MrETfMT7w3Pcy96g9YPonRE6aEEELYAevNHRqk5K9kqeLP_NTE"," sessionid":"c9c2fb797bd319413d92c7f0910d748e"," multi_sids":"7053713714067473414%3Ac9c2fb797bd319413d92c7f0910d748e"," d_ticket":"47521507d8c1fe93f78d9028d431b5c619e33"," odin_tt":"bb2581866ff4685841d94ff229546d06283e90eab072a63a3b7d4fe2c7d77c0e069133c229b8e6e351f65135345136a0b376d6f40dcd6ce597cfe82aaab176223ac6ad4fb0679729b2545439b8378a92"," install_id":"7488151925856388910"},"params":{"ab_version":"37.6.3","ac":"wifi","ac2":"wifi5g","aid":"1180","app_language":"en","app_name":"trill","app_type":"normal","build_number":"37.6.3","carrier_region":"BR","carrier_region_v2":"724","cdid":"06718ee9-d293-45d3-aefc-c560aceef3d3","channel":"googleplay","current_region":"JP","device_brand":"google","device_id":"7488151750046860843","device_platform":"android","device_type":"Pixel 6","dpi":"420","host_abi":"arm64-v8a","iid":"7488151925856388910","is_pad":"0","language":"en","locale":"en-GB","manifest_version_code":"370603","op_region":"BR","openudid":"50cf244aa2bd14b7","os":"android","os_api":"34","os_version":"14","region":"TH","residence":"BR","resolution":"1080*2146","ssmix":"a","sys_region":"TH","timezone_name":"Asia/Shanghai","timezone_offset":"28800","uoo":"1","update_version_code":"370603","version_code":"370603","version_name":"37.6.3"},"userSession":{"appVersion":"37.6.3","deviceType":"Pixel 6","did":"7488151750046860843","iid":"7488151925856388910","lanusk":"#H4TG3veDPc7QpupHdNEETQ85NK13d9RREFRu7XspmdTZmlN4zWjIe5oFwUlkcd0qPM/etLTB+j5aWDXJ","osVersion":"14","privateKey":"572BB19613B82C865BA27F2E4D0BACAD44FFE269E86BE57FCC7BE135BB9DA69E","publicKey":"04E29B280E224441414C9E8A9AFC6706AAD84A1970E2562A58A6347B2E54E425C00938E0B4C1E0EAB234DC70F4C7EB6B86A0D1AB49682BEB313F2A1BB5C167ACCD","secUid":"MS4wLjABAAAArvYUISpxjJo7g34Z4PBAgwXt9q6ZXD8wXR4WKe33E_Ir85H3OE8ZJ09zg1rxVGj5","seedId":0,"tsSign":"{\\"ts_sign_ree\\":\\"ts.1.12257a38e6fb68aa97c425d96abb1836445b029b30260a9ea3be2e7a9190c5bc7a50e8a417df069df9a555bd16c66ef8b3639a56b642d7d8f9c881f42b9329ec\\"}","uid":"7053713714067473414","xtToken":"04c9c2fb797bd319413d92c7f0910d748e0550d8eaa726cc51dd7f1198bdcd62527c5acd380542f338ae5e24ed38b635223f7ce989c50eb839d361b456f506af47063a10aec602f73e48fdeb61fc4d804b31249134a46b5d1c8f03bc6e4f98033aba0--0a4e0a20468fb46a5751e4bd4cca9eb8e9211dd2cd657b7b1e9ebfcc0750c23dfa6b31811220feed2ca1cd3b35e021bc9f6922113cc5e0d1fa7a745fca43e6748ecb13164ed21801220674696b746f6b-3.0.0"}}'
      var blob = new Blob([txt], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'example-wa_export-channe.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    },
    // 获取用户
    getAdminUserFun() {
      const params = {
        account_type: 2,
        page: 1,
        limit: 10000,
        status: -1,
      }
      adminuser(params).then(res => {
        if (res.msg === 'success') {
          this.userData = res.data.list
        }
      })
    },
    resetTime
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

.export_type, .nummber_type {
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

.label_radius_title, .label_title {
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
