<!-- 详情列表 -->
<template>
  <div class="actionPage">
    <el-dialog
      :close-on-click-modal="false"
      title="详情"
      :visible.sync="modal.show"
      center
      width="80%"
      @close="closeModal"
    >
      <div :style="{'max-height':modalHeight+300+'px'}" class="content">
        <div class="queryBox">
          <!-- 筛选条件 -->
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input v-model="queryData.account" clearable placeholder="请输入账号" @input="changeInput" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryData.account_id" clearable placeholder="请输入账号ID" @input="changeInput" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryData.device_id" clearable placeholder="请输入设备ID" @input="changeInput" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryData.phones" clearable placeholder="请输入发送数据" @input="changeInput" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryData.reason" clearable placeholder="请输入原因" @input="changeInput" />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="resetTableFun(1)">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 列表 -->
        <div class="tableContent">
          <el-table
            ref="serveTable"
            v-loading="loading"
            :data="tableData"
            :height="modalHeight+120"
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
            <el-table-column label="账号" min-width="180" prop="account">
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="账号ID" min-width="180" prop="account_id">
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="设备ID" min-width="120" prop="device_id">
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="预计发送" min-width="120" prop="expected_num">
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="发送数据" min-width="180" prop="phones" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="成功数" min-width="120" prop="sucess_num">
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] }}
              </template>
            </el-table-column>
            <el-table-column label="失败数" min-width="120" prop="fail_num">
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] }}
              </template>
            </el-table-column>
            <el-table-column label="任务状态" min-width="100" prop="status">
              <template slot="header">
                <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'status')">
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
                <el-tag :type="getLabelByVal(scope.row[scope.column.property], statusList,{ label: 'type', value: 'value' },)" size="small">
                  {{ getLabelByVal(scope.row[scope.column.property], statusList) || '-' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="原因" min-width="150" prop="reason">
              <template slot-scope="scope">
                {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="创建时间" min-width="150" prop="itime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ formatTimestamp(scope.row[scope.column.property]) }}
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
              @size-change="changePageSize($event)"
              @current-change="changePageCurrent($event)"
            />
          </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getDetailListApi } from '../api';
import { resetPage, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters';

export default {
  name: 'DetailList',
  props: {
    modalHeight: {
      type: Number,
      default: 400
    },
  },
  data() {
    return {
      modal: {
        show: false,
      },
      formData: {},
      queryData: {
        task_id: '',
        account: '',
        status: '',
        account_id: '',
        device_id: '',
        phones: '',
        reason: '',
        page: 1,
        limit: 10,
        total: 0,
        pageOption: resetPage(),
      },
      statusList: [
        { label: '全部', value: '0',type: '' },
        { label: '创建成功', value: '1',type: 'info' },
        { label: '执行中', value: '2',type: 'warning' },
        { label: '关闭任务', value: '3',type: 'danger' },
        { label: '停止群发', value: '4',type: 'danger' },
        { label: '已完成', value: '5',type: 'success' },
      ],
      selectData: [],
      selectIdData: [],
      tableData: [],
      loading: false
    }
  },
  mounted() {
  },
  methods: {
    open(form) {
      this.modal.show = true
      this.formData = form
      this.getDataListFun(1)
    },
    getDataListFun(num) {
      this.loading = true;
      const params = {
        task_id: this.formData.id,
        account: this.queryData.account,
        account_id: this.queryData.account_id,
        device_id: this.queryData.device_id,
        phones: this.queryData.phones,
        reason: this.queryData.reason,
        status: Number(this.queryData.status) || -1,
        page: num || this.queryData.page,
        limit: this.queryData.limit,
      }
      getDetailListApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.status = item.status ? String(item.status) : ''
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
    // 行内筛选项
    handleRowQuery(val, key, type) {
      this.queryData[key] = val
      this.getDataListFun()
    },
    // 重置
    resetTableFun() {
      this.queryData = {
        task_id: '',
        account: '',
        status: '',
        account_id: '',
        device_id: '',
        phones: '',
        reason: '',
        page: 1,
        limit: 10,
        total: 0,
        pageOption: resetPage(),
      }
      this.getDataListFun()
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
    // 分页 切换
    changePageSize(val) {
      this.queryData.limit = val;
      this.getDataListFun();
    },
    // 页码
    changePageCurrent(val) {
      this.queryData.page = val;
      this.getDataListFun();
    },
    // 关闭弹窗
    closeModal() {
      this.modal.show = false
      this.modal.loading = false
      this.tableData = []
     this.resetTableFun()
    },

    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp,
    getLabelByVal
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}

.content {
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-sizing: border-box;

}

</style>
