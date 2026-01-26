<!-- 数据管理 -->
<template>
  <div style="width:100%;height: 100%; float: left;">
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-button :disabled="checkIdArry.length==0" type="danger" @click="changeIpBtn">{{ $t('sys_g047') }}</el-button>
        <el-button type="primary" @click="pushDatabtn(0,1)">{{ $t('sys_c135') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.task_name" :placeholder="$t('sys_mat061',{value:$t('sys_mat027')})" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="initDatalist(1)">{{ $t('sys_c002') }}</el-button>
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
          :cell-style="{ textAlign: 'center' }"
          :data="dataList"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          :height="cliHeight"
          :summary-method="getSummaries"
          border
          element-loading-background="rgba(255, 255, 255,1)"
          element-loading-spinner="el-icon-loading"
          show-summary
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          @row-click="rowSelectChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$t('sys_mat027')" min-width="140" prop="name" />
          <el-table-column :label="$t('sys_mat042')" min-width="100" prop="invalid_num" />
          <el-table-column :label="$t('sys_mat028')" min-width="100" prop="up_num" />
          <el-table-column :label="$t('sys_mat029')" min-width="100" prop="source_repeat_num" />
          <el-table-column :label="$t('sys_mat030')" min-width="100" prop="repeat_num" />
          <el-table-column :label="$t('sys_mat031')" min-width="100" prop="into_num" />
          <el-table-column :label="$t('sys_mat032')" min-width="100" prop="residue_num" />
          <el-table-column :label="$t('sys_mat106')" min-width="100" prop="err_num" />
          <el-table-column :label="$t('sys_l059')" min-width="100" prop="up_status">
            <template slot-scope="scope">
              <el-tag :type="scope.row.up_status==1?'warning':'success'" size="small">
                {{ taskOption[scope.row.up_status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c008')" min-width="148" prop="expire_time">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c010')" width="268">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="click" width="200">
                <div>{{ $t('sys_mat037') }}</div>
                <div style="display: flex;justify-content: flex-end;">
                  {{ $t('sys_mat038', {value: residueList.length}) }}
                </div>
                <div>
                  <template v-if="residueList.length>0">
                    <div ref="lazyEle" class="residue_less" @scroll="lazyScroll">
                      <el-button
                        v-if="moreLoading"
                        :loading="true"
                        class="loading_icon"
                        style="margin-top: 10px;"
                        type="primary"
                      />
                      <template v-else>
                        <div v-for="(item,idx) in residueList" :key="idx">{{ item }}</div>
                        <div v-if="isMore" style="font-size: 12px;margin-top: 5px;">{{ $t('sys_mat014') }}</div>
                      </template>
                    </div>
                  </template>
                  <p v-else>{{ $t('sys_mat013') }}</p>
                </div>
                <el-button
                  slot="reference"
                  :disabled="checkIdArry.length>0"
                  size="small"
                  type="warning"
                  @click.stop="showLeaveNum(scope.row)"
                >{{ $t('sys_mat032') }}
                </el-button>
              </el-popover>
              <el-button
                :disabled="checkIdArry.length>0"
                size="small"
                style="margin:0 10px;"
                type="primary"
                @click.stop="pushDatabtn(scope.row,2)"
              >{{ $t('sys_mat107') }}
              </el-button>
              <el-button :border="false" :disabled="checkIdArry.length>0" size="small" style="padding: 0;" @click.stop>
                <el-dropdown @command="(command)=>{handleCommand(scope.row,command)}">
                  <el-button :disabled="checkIdArry.length>0" size="small" type="primary">更多
                    <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item,idx) in moreOption"
                      v-show="item"
                      :key="idx"
                      :command="{title:item,index:idx}"
                    >
                      {{ item }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="queryData.page"
            :page-size="queryData.limit"
            :page-sizes="pageOption"
            :total="queryData.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="setPageSize"
            @current-change="switchPage"
          />
        </div>
      </div>
    </div>

    <!-- 新增-->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('sys_mat034')"
      :visible.sync="ipModel"
      :width="ipModelWidth"
      center
    >
      <el-form ref="ipForm" :model="ipForm" :rules="ipRules" label-width="0" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-steps :active="stepsActive">
                <el-step :description="$t('sys_m056')" :title="$t('sys_c058')" />
                <el-step :description="$t('sys_m057')" :title="$t('sys_m055')" />
                <el-step :description="$t('sys_m058')" :title="$t('sys_mat034')" />
              </el-steps>
            </el-form-item>
          </el-col>
          <template v-if="stepsActive==1">
            <el-col v-if="!ipForm.id" :span="12">
              <el-form-item prop="file_name">
                <div class="label_title">{{ $t('sys_m059') }}</div>
                <el-input v-model="ipForm.file_name" :placeholder="$t('sys_mat024')" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="data_way">
                <div class="label_title">{{ $t('sys_g130') }}</div>
                <el-radio-group v-model="ipForm.data_way">
                  <el-radio v-for="(item,idx) in dataOption" v-show="item!=''" :key="idx" :label="idx">{{
                    item
                  }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div class="label_title">{{ $t('sys_c058') }}</div>
                <div>{{ $t('sys_c136') }}</div>
                <div class="submit_btn">
                  <el-button v-if="ipForm.file_name" class="custom_file1" style="margin-top: 0;">{{ $t('sys_c059') }}
                    <input id="uploadFile" ref="uploadclear" title=" " type="file" @change="checkDataIsUse">
                  </el-button>
                  <el-button v-else class="custom_file1" style="margin-top: 0;" @click="submitWayBtn('ipForm')">
                    {{ $t('sys_c059') }}
                  </el-button>
                  <span class="export_tips" @click="downLoadTemp">
                    <i class="el-icon-download" />{{ $t('sys_l066') }}
                  </span>
                </div>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="20">
                <el-form-item style="margin-bottom: 0;">
                    <div class="label_title">选择使用数据的席位</div>
                    <div>添加席位(若最终生效席位中存在则不会重复添加)</div>
                    <div style="display: flex;justify-content: space-between;">
                        <el-input v-model="input" :placeholder="$t('sys_mat025')"></el-input>
                        <el-button type="primary" style="margin-left: 20px;">主要按钮</el-button>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="20">
                <el-form-item prop="group_id">
                    <div>最终生效席位</div>
                    <el-select clearable filterable v-model="ipForm.group_id" :placeholder="$t('sys_mat025')"
                        style="width:100%;">
                        <el-option v-for="item in ipGroupList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-col> -->
          </template>
          <el-col :span="24">
            <el-form-item label-width="0">
              <template v-if="stepsActive==2">
                <el-progress :percentage="percentage" :stroke-width="14" :text-inside="true" />
                <div class="upload_img" style="margin-top: 10px;">
                  <img alt="" src="@/assets/upload_ing.png" srcset="">
                </div>
              </template>
              <template v-if="stepsActive==3">
                <div class="upload_img">
                  <img alt="" src="@/assets/success.png" srcset="">
                  <div style="font-weight: 600;">{{ $t('sys_c119') }}</div>
                  <div v-html="$t('sys_c118',{s_number:success_number,f_number:fail_number})" />
                </div>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="stepsActive==3">
          <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
            <el-button @click="restUpload">{{ $t('sys_c076') }}</el-button>
            <el-button type="primary" @click="ipModel = false">{{ $t('sys_c075') }}</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import { successTips, resetPage } from '@/utils/index'
import { getdatapacklist, bathdel, uploadfile, getschedule, dooutputdata, getresiduenum } from '@/api/datamanage'

export default {
  name: 'DataPage',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        task_name: ''
      },
      percentage: 0,
      stepsActive: 1,
      ipModelType: '',
      ipModelWidth: '',
      dataList: [],
      downModel: false,
      loading: false,
      ipModel: false,
      isLoading: false,
      moreLoading: false,
      fail_number: 0,
      setIpType: '',
      waitTimer: null,
      setInter: 1000,
      success_number: 0,
      countryList: [],
      checkIdArry: [],
      residueList: [],
      showNum: [7, 8],
      randomNum: [1, 2, 4, 8, 3, 8, 4, 6, 3, 8],
      pageOption: resetPage(),
      ipForm: {
        id: '',
        file_name: '',
        data_way: 1,
        ip_file: ''
      },
      model2: {
        page: 1,
        limit: 10,
        total: 0
      },
      dataForm: {
        ver_pwd: '',
        data_id: '',
        data_type: null,
        title: null,
        downLoading: false,
      },
      timer: null,
      isTime: null,
      isMore: false,
      cliHeight: null
    }
  },
  computed: {
    ipRules() {
      return {
        data_way: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        file_name: [{ required: true, message: this.$t('sys_mat024'), trigger: 'blur' }]
      }
    },
    dataRules() {
      return {
        ver_pwd: [{ required: true, message: this.$t('sys_mat061', { value: this.$t('sys_q126') }), trigger: 'blur' }]
      }
    },
    dataOption() {
      return ['', this.$t('sys_mat022'), this.$t('sys_mat023')]
    },
    taskOption() {
      return ['', this.$t('sys_q015'), this.$t('sys_mat047')]
    },
    stopOptions() {
      return ['', this.$t('sys_c025'), this.$t('sys_c026')]
    },
    // 更多
    moreOption() {
      return ['', '导出全部数据', '导出剩余数据', '导出异常数据']
    }
  },
  watch: {
    ipModel(val) {
      if (val === false) {
        this.ipForm.data_way = 1;
        this.ipForm.file_name = '';
        this.ipForm.ip_file = '';
        this.$refs.ipForm.resetFields();
      }
    }
  },
  mounted() {
    this.initDatalist(1); // 获取列表
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  destroyed() {
    clearInterval(this.waitTimer);
    clearTimeout(this.heartTimer);
    this.waitTimer = null;
    this.heartTimer = null;
  },
  methods: {
    showLeaveNum(row) {
      this.model2.page = 1;
      this.model2.id = row.id;
      this.getLeaveNum()
    },
    getLeaveNum() {
      this.moreLoading = true;
      getresiduenum({ id: this.model2.id, page: this.model2.page, limit: this.model2.limit }).then(res => {
        this.moreLoading = false;
        if (res.code !== 0) return;
        this.model2.total = res.data.total;
        this.residueList = res.data.list || []
      })
    },
    lazyScroll() {
      const scrollEle = this.$refs.lazyEle;
      const scrollbtn = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight;
      clearTimeout(this.timer);
      if (scrollbtn < 20 && this.residueList.length < this.model2.total) {
        this.timer = setTimeout(() => {
          this.isMore = false;
          this.model2.page += 1;
          getresiduenum({ id: this.model2.id, page: this.model2.page, limit: this.model2.limit }).then(res => {
            this.moreLoading = false;
            if (res.code !== 0) return;
            this.residueList = this.residueList.concat(res.data.list)
          })
        }, 500);
      } else {
        this.timer = setTimeout(() => {
          this.isMore = true;
        }, 500);
      }
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => {
        return item.id
      })
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.checkIdArry.find(item => item === row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    initDatalist(num) {
      this.loading = true;
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        name: this.queryData.task_name
      }
      getdatapacklist(params).then(res => {
        this.loading = false;
        this.queryData.total = res.data.total;
        this.dataList = res.data.list || [];
        this.$nextTick(() => {
          if (this.$refs.serveTable) {
            this.$refs.serveTable.doLayout();
          }
        })
      })
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (index === 0) {
          sums[index] = this.$t('sys_c125');
          return;
        } else if (this.showNum.indexOf(index) > -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
    pushDatabtn(row, idx) {
      this.ipModel = true;
      this.stepsActive = 1;
      this.ipForm.id = row.id;
      // this.ipModelType = 2;
      this.ipModelType = idx;
      this.startPercent();
      this.ipModelWidth = '700px';
      if (idx === 1) return;
      this.ipForm.id = row.id;
      this.ipForm.file_name = row.name;
    },
    async checkDataIsUse(e) {
      const files = this.$refs.uploadclear.files[0];
      const formData = new FormData();
      formData.append('file', files);
      formData.append('ptype', this.ipModelType);
      formData.append('name', this.ipForm.file_name);
      formData.append('into_type', this.ipForm.data_way);
      if (this.ipModelType === 2) {
        formData.append('id', this.ipForm.id);
      }
      this.stepsActive = 2;
      this.$refs.uploadclear.value = null;
      const result = await uploadfile(formData);
      if (result.code !== 0) return;
      this.waitTimer = setInterval(async() => {
        const getResult = await getschedule({ id: result.data.id })
        if (getResult.code !== 0) return;
        if (getResult.data.up_status === 2) {
          clearInterval(this.waitTimer);
          this.initDatalist();
          this.stepsActive = 3
          this.fail_number = getResult.data.fail;
          this.success_number = getResult.data.success;
        }
      }, this.setInter)
    },
    submitWayBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('123')
        }
      })
    },
    startPercent() {
      this.percentage = 0;
      this.progrTimer = setInterval(() => {
        const curPercent = Number(this.randomNum[Math.floor(Math.random() * this.randomNum.length)]);
        if (this.percentage >= 35) {
          if (this.percentage < 96) {
            this.percentage++
          } else {
            this.percentage = 99
            clearInterval(this.progrTimer)
          }
        } else {
          this.percentage = this.percentage + curPercent
        }
      }, 800)
    },
    restUpload() {
      this.stepsActive = 1
      this.ipModelType = 1;
    },
    setPageSize(val) {
      this.queryData.limit = val;
      this.initDatalist();
    },
    switchPage(val) {
      this.queryData.page = val;
      this.initDatalist();
    },
    submitSetBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('111')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    downLoadTemp() {
      var blob = new Blob(['每行一个手机号'], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'example-import-was-data-zh.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    },
    changeIpBtn() {
      const that = this;
      that.$confirm(that.$t('sys_rai046', { value: that.$t('sys_c024') }), that.$t('sys_c028'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            bathdel({ ids: that.checkIdArry }).then(res => {
              if (res.code !== 0) return;
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
    // 更多
    handleCommand(row, item) {
      console.log('row', row)
      console.log('item', item)
      // this.dataForm.title = item.title
      // this.dataForm.data_type = item.index;
      // this.dataForm.data_id = row.id;
      this.$confirm(`确认${item.title}吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            dooutputdata({
              type: item.index,
              id: row.id,
            }).then(res => {
              if (res.msg === 'success') {
                instance.confirmButtonLoading = false;
                window.location.href = res.data.url;
                successTips(this)
                done();
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
    },

    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 260;
    },
  }
}
</script>
<style lang="scss" scoped>
.group_main {
  display: flex;
  width: 100%;
  flex-direction: column;

  .tab_check_warp {
    width: 100%;
    display: flex;
    color: #909399;
    font-size: 14px;
    margin-bottom: 10px;
    align-items: center;

    i {
      margin-right: 4px;
    }

    .el-checkbox {
      margin-right: 10px;
    }

    .check_num {
      color: #606266;
    }
  }
}

.text_number {
  color: #209cdf;
}

.label_title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}

.residue_less {
  width: 100%;
  max-height: 100px;
  overflow: hidden;
  overflow-y: auto;
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

.submit_btn {
  height: 100%;
  display: flex;
  align-items: center;
  margin-top: 0;

  .export_tips {
    display: flex;
    font-size: 12px;
    cursor: pointer;
    align-items: center;
    color: #209cdf;
    margin-left: 20px;
  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}</style>
