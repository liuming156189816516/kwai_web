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
          <el-select v-model="queryData.status" clearable filterable placeholder="请输入任务状态" style="width:100%;">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">重置</el-button>
          <el-button type="primary" :disabled="!selectIdData.length" @click="delDataFun">批量关闭</el-button>
          <el-button type="primary" :disabled="!selectIdData.length" @click="batchCloseDataFun">批量删除</el-button>
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
        border
        element-loading-spinner="el-icon-loading"
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >

        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="任务名称" min-width="120" prop="task_name">
          <template slot-scope="scope">
            {{ scope.row.task_name ? scope.row.task_name : '-' }}
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
        <el-table-column label="执行中" min-width="120" prop="in_pro_num">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="预计发送" min-width="120" prop="expected_num">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="成功数" min-width="120" prop="sucess_num">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="失败数" min-width="120" prop="fail_num">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" min-width="100" prop="status">
          <!--
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
          -->
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], statusList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="原因" min-width="100" prop="reason">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="配置" min-width="150" prop="conf_str" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          prop="operation"
          show-overflow-tooltip
          width="220"
        >
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.stop="openDetailListFun(scope.row,'任务详情')">任务详情</el-button>
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
          @size-change="changePageSize($event,'table')"
          @current-change="changePageCurrent($event,'table')"
        />
      </div>
    </div>

    <!-- 新建 -->
    <actionModal ref="refActionModal" :modal-height:="cliHeight" @saveData="saveData" />
  </div>
</template>

<script>
import {
  getDataApi, batchDelDataApi, batchCloseDataApi, addDataApi,
} from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import actionModal from './components/actionModal'
export default {
  name: 'SendPrivatelyTask',
  components: {
    actionModal
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
        status: '',
      },
      formData: {},
      tableData: [],
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      pageOption: resetPage(),
      statusList: [
        { label: '全部', value: '0' },
        { label: '创建成功', value: '1' },
        { label: '执行中', value: '2' },
        { label: '停止群发', value: '3' },
        { label: '已完成', value: '4' },
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

    }
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
    this.getDataListFun(1); // 获取列表
  },
  updated() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.$refs.serveTable.doLayout();
      });
    }, 150)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表
    getDataListFun(num) {
      this.loading = true;
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        task_name: this.queryData.task_name,
        status: Number(this.queryData.status) || -1,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.status = item.status ? String(item.status) : ''
            item.gender = item.gender ? String(item.gender) : ''
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
      this.$refs.refActionModal.open(null,'add')
    },
    // 保存
    saveData(data) {
      console.log('saveData',data)
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
    openDetailListFun(row, title) {
      this.detailModal.show = true
      this.detailModal.title = title
      this.detailModal.cloneRow = deepClone(row)
      if (title === '任务详情') {
        this.detailModal.width = '85%'
        this.getDetailListFun(1)
      } else if (title === '任务状态') {
        this.detailModal.width = '50%'
        this.getDetailObjFun(row)
      } else if (title === '查看') {
        this.detailModal.width = '40%'
      }
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      setTimeout(() => {
        this.addModal.formData = {
          amount: 19,
          material_group_id: '',
          material_group_name: '',
          link: '',
          task_config_id: '',
          group_id: '',
          tags: []
        }
        this.$refs.refAddModal.resetFields();
      }, 500);
    },

    // 批量删除
    delDataFun() {
      this.$confirm(`确认删除吗？`, '提示', {
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
      this.$confirm(`确认关闭吗？`, '提示', {
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
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
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
      }
      this.getDataListFun(1)
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.limit = val;
        this.getDetailListFun();
      }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.page = val;
        this.getDetailListFun();
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
  margin-bottom:12px;
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
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
</style>
