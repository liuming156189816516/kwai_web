<!-- 私发任务 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <div class="queryBox">
      <!-- 筛选条件 -->
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input v-model="queryData.name" clearable placeholder="请输入任务名称" @input="changeInput" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryData.time"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            style="width: 380px"
            type="datetimerange"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getDataListFun(null)">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">重置</el-button>
          <el-button :disabled="!selectIdData.length" type="primary" @click="batchCloseDataFun">批量关闭</el-button>
          <el-button :disabled="!selectIdData.length" type="primary" @click="delDataFun">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--  工具栏 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">新建任务</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        ref="serveTable"
        v-loading="loading"
        :data="tableData"
        :height="cliHeight"
        :summary-method="getTableSumFun"
        border
        element-loading-background="rgba(255, 255, 255,1)"
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-summary
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >

        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="任务名称" min-width="120" prop="name">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="账号分组" min-width="120" prop="group_name">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="数据包" min-width="120" prop="data_pack_name">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="发送模式" min-width="100" prop="send_type">
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], sendTypeList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="账号总数" min-width="80" prop="account_num" />
        <el-table-column label="执行中" min-width="120" prop="in_pro_num" />
        <el-table-column label="预计发送" min-width="100" prop="expected_num" />
        <el-table-column label="成功数" min-width="100" prop="sucess_num" />
        <el-table-column label="失败数" min-width="100" prop="fail_num" />
        <el-table-column label="任务状态" min-width="100" prop="status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'status','table')">
              <span :class="[Number(queryData.status) >0?'dropdown_title':'']" style="color:#909399">
                任务状态  <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in statusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-tag
              :type="getLabelByVal(scope.row[scope.column.property], statusList,{ label: 'type', value: 'value' },)"
              size="small"
            >
              {{ getLabelByVal(scope.row[scope.column.property], statusList) || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="触发方式" min-width="100" prop="is_auto">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'is_auto','table')">
              <span :class="[Number(queryData.is_auto) >0?'dropdown_title':'']" style="color:#909399">
                触发方式  <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in isAutoList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.is_auto}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <!--            <el-tag-->
            <!--              :type="getLabelByVal(scope.row[scope.column.property], isAutoList,{ label: 'type', value: 'value' },)"-->
            <!--              size="small"-->
            <!--            >-->
            {{ getLabelByVal(scope.row[scope.column.property], isAutoList) || '-' }}
            <!--            </el-tag>-->
          </template>
        </el-table-column>
        <el-table-column label="原因" min-width="100" prop="reason">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160" prop="itime">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row[scope.column.property]) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          prop="operation"
          show-overflow-tooltip
          width="340"
        >
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.stop="quickSendFun(scope.row,)">快速私发</el-button>
            <el-button size="small" type="primary" @click.stop="openConfigModal(scope.row,'conf_str')">配置</el-button>
            <el-button size="small" type="primary" @click.stop="openDetailListFun(scope.row)">详情</el-button>
            <el-button v-if="scope.row.is_auto==='2'" size="small" type="primary" @click.stop="openCloseFun(scope.row)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="layui_page">
        <el-pagination
          :current-page.sync="queryData.page"
          :page-size="queryData.limit"
          :page-sizes="queryData.pageOption"
          :total="queryData.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize($event,'table')"
          @current-change="changePageCurrent($event,'table')"
        />
      </div>
    </div>

    <!-- 新建 -->
    <actionModal ref="refActionModal" :modal-height:="cliHeight" @saveData="saveData" />
    <!-- 新建 -->
    <detailList ref="refDetailList" :modal-height:="cliHeight" />
    <!-- JSON 配置 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="configData.title"
      :visible.sync="configData.show"
      center
      width="60%"
      @close="closeConfigModal"
    >

      <div class="configContent">
        <el-form label-width="150px">
          <el-form-item
            v-for="(item, index) in configData.formData"
            v-show="item.title"
            :key="index"
            :label="item.title+':'"
          >
            <!-- 数组类型（如 material_list） -->
            <template v-if="Array.isArray(item.value)">
              <div
                v-for="(val, i) in item.value"
                :key="i"
                class="multi-line"
              >
                {{ val }}
              </div>
            </template>

            <!-- 普通字段 -->
            <template v-else>
              <span class="form-text">{{ item.value }}</span>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="configData.show = false">关闭</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import {
  getDataApi, batchDelDataApi, batchCloseDataApi, addDataApi,closeDataApi
} from './api';
import { resetPage, successTips, getLabelByVal, zonedTimeToTimestamp } from '@/utils';
import { formatTimestamp, formatDecimal, formatDateTime } from '@/filters'
import actionModal from './components/actionModal'
import detailList from './components/detailList'

export default {
  name: 'SendPrivatelyTask',
  components: {
    actionModal,
    detailList,
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
        status: '',
        is_auto: '',
        time: [],
        pageOption: resetPage(),
      },
      formData: {},
      tableData: [],
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      statusList: [
        { label: '全部', value: '0', type: '' },
        { label: '创建成功', value: '1', type: 'info' },
        { label: '执行中', value: '2', type: 'warning' },
        { label: '关闭任务', value: '3', type: 'danger' },
        { label: '停止群发', value: '4', type: 'danger' },
        { label: '已完成', value: '5', type: 'success' },
      ],
      isAutoList: [
        { label: '全部', value: '0', type: '' },
        { label: '手动', value: '1', type: '' },
        { label: '自动', value: '2', type: '' },
      ],
      sendTypeList: [
        { label: '全部', value: '0' },
        { label: '普通文本', value: '1' },
        { label: '超链文本', value: '2' },
        { label: '混合发送', value: '3' },
      ],
      cliHeight: null,
      loading: false,
      total: 0,
      batchOption: [
        { icon: 'delete', label: '批量删除' },
        { icon: 'lock', label: '批量关闭' },
      ],
      videoModal: {
        title: '',
        show: false,
        url: ''
      },
      taskConfigList: [],
      accountGroup: [],
      tagList: [],
      configData: {
        title: '配置',
        show: false,
        formData: {},
        kayData: {
          send_type: '发送模式',
          send_num: '账号每私发条数',
          material_list: '群发话术',
          replace_num: '转换数量',
          min_time: '间隔最小时间',
          max_time: '间隔最大时间',
        },
        value: null
      },
      showSumNum: [8, 9, 10],
    }
  },
  mounted() {
    // const startTime = formatDateTime(new Date(), 'YYYY-MM-DD') + ' 00:00:00'
    // const endTime = formatDateTime(new Date(), 'YYYY-MM-DD') + ' 23:59:59'
    // this.queryData.time = [startTime, endTime]
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
    this.getDataListFun(1); // 获取列表
  },
  updated() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.$refs.serveTable.doLayout();
      });
    }, 200)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表
    getDataListFun(num) {
      this.loading = true;
      const startTime = this.queryData.time && this.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.queryData.time[0]))) / 1000 : ''

      const endTime = this.queryData.time && this.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.queryData.time[1]))) / 1000 : ''

      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        name: this.queryData.name,
        status: Number(this.queryData.status) || -1,
        is_auto: Number(this.queryData.is_auto) || -1,
      }
      if (startTime && endTime) {
        params.start_time = startTime
        params.end_time = endTime
      }

      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.status = item.status ? String(item.status) : ''
            item.is_auto = item.is_auto ? String(item.is_auto) : ''
            item.send_type = item.send_type ? String(item.send_type) : ''
            return item
          });
          this.selectData = []
          this.selectIdData = []
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      })
    },
    // 新建
    addOpenFun() {
      this.$refs.refActionModal.open(null, 'add')
    },
    // 保存
    saveData(data) {
      if (data.type === 'add') {
        this.addDataFun(data.formData)
      }
    },
    // 新建
    addDataFun(form) {
      addDataApi(form).then(res => {
        if (res.msg === 'success') {
          this.$message.success('新建成功！')
          this.$refs.refActionModal.closeModal()
          this.getDataListFun(1)
        }
      })
    },
    // 详情
    openDetailListFun(row) {
      this.$refs.refDetailList.open(row)
    },
    // 关闭
    openCloseFun(form) {
      this.$confirm(`确认关闭吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            closeDataApi({ ids: [form.id] }).then(res => {
              if (res.msg === 'success') {
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
    // 批量删除
    delDataFun() {
      this.$confirm(`确认批量删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ids: this.selectIdData,// 要删除与的id集合
            }
            batchDelDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
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
    // 批量关闭
    batchCloseDataFun() {
      this.$confirm(`确认批量关闭吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ids: this.selectIdData,// 要删除与的id集合
            }
            batchCloseDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                instance.confirmButtonLoading = false;
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
      });
    },
    // 快速私法
    quickSendFun(item) {
      this.$refs.refActionModal.open(item, 'add')
    },
    // 打开配置
    openConfigModal(row, kay) {
      this.configData.show = true
      this.configData.kay = kay
      if (row[kay]) {
        this.configData.value = JSON.parse(row[kay])
        this.configData.formData = Object.keys(this.configData.value).map(key => {
          const item = {
            label: key,
            title: this.configData.kayData[key],
            value: this.configData.value[key]
          }
          if (key === 'send_type') {
            item.value = getLabelByVal(String(item.value), this.sendTypeList)
          }
          return item
        })
      }
    },
    // 关闭配置
    closeConfigModal() {
      this.configData.show = false
      this.configData.value = ''
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 合计
    getTableSumFun(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (index === 0) {
          sums[index] = '统计';
        } else if (this.showSumNum.includes(index)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev + curr);
            } else {
              return prev;
            }
          }, 0);
          sums[index] = formatDecimal(sums[index])
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
    // 单行 点击勾选
    rowSelectChange(row, column, event) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 行内筛选项
    handleRowQuery(val, key, type) {
      this.queryData[key] = val
      this.getDataListFun()
    },
    // 重置
    restQueryBtn() {
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
        status: '',
        time: [],
        pageOption: resetPage(),
      }
      this.getDataListFun(1)
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      }
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    formatTimestamp,
    getLabelByVal

  }
}
</script>

<style lang="scss" scoped>
.addModalName {
  ::v-deep .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

  }

  ::v-deep .el-form-item {
    width: 48%;
  }
}

.file_content {
  cursor: pointer;
  color: #0a76a4;
  text-decoration: underline;
  font-size: 25px;
}

.queryBox {
  margin-bottom: 12px;
}

.stateModal {
  display: flex;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;

  .el-form-item {
    width: calc(100% / 3);
    margin: 10px 0;
  }

}

::v-deep .el-table .danger-row {
  background: rgba(245, 108, 108, 0.5);
}

.is_close_red {
  color: rgba(255, 0, 0, 0.5);
}

.aUnderline {
  color: #00a8ff;
  text-decoration: underline;
  cursor: pointer;
}

.configContent {
  height: 70vh;
  padding: 15px;
  border: #333333 1px solid;
  border-radius: 3px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
