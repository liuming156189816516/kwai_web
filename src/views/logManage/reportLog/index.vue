<!-- 上报日志 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.req_id" clearable placeholder="请输入请求ID" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.kw_account" clearable placeholder="请输入账号" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.account_id" clearable placeholder="请输入账号ID" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  工具栏 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in batchOption" v-show="item.label" :key="idx" :command="{item,idx}">
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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

        <el-table-column :selectable="selectable" type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="请求ID" min-width="120" prop="req_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="120" prop="ptype">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'ptype','table')">
              <span :class="[Number(queryData.ptype) > 0?'dropdown_title':'']" style="color:#909399">类型
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in pTypeList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.ptype}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], pTypeList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="账号" min-width="120" prop="kw_account" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="账号ID" min-width="120" prop="account_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="提交状态" min-width="120" prop="code" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property]===0 ? '成功' : '失败' }}
          </template>
        </el-table-column>

        <el-table-column label="上报数据" min-width="120" prop="data" show-overflow-tooltip>
          <template slot-scope="scope">
            <spana class="dataText" @click="openConfigModal">{{ scope.row[scope.column.property] }}</spana>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
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

    <!-- JSON 配置 -->
    <el-dialog
      :title="configData.title"
      center
      :visible.sync="configData.show"
      :close-on-click-modal="false"
      width="80%"
      @close="closeConfigModal"
    >
      <div style="height: 75vh">
        <jsonEditorTool ref="refJsonEditorToo" v-model="configData.value" :show-footer="false" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi,delDataApi } from './api';
import { resetPage, successTips, getLabelByVal,deepClone } from '@/utils';
import { formatTimestamp } from '@/filters'
import jsonEditorTool from '@/components/jsonEditorTool'

export default {
  name: 'ReportLog',
  components: {
    jsonEditorTool
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        req_id: '',
        kw_account: '',
        account_id: '',
        ptype: ''
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: null,
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      pTypeList: [
        { label: '全部', value: '0' },
        { label: '注册', value: '1' },
        { label: '清洗开通', value: '2' },
        { label: '清洗活跃', value: '3' },
        { label: '私发', value: '4' },

      ],
      batchOption: [
        {
          icon: 'delete',
          label: '批量删除'
        },
      ],
      configData: {
        title: '上报数据',
        show: false,
        formData: {},
        value: null
      },
    }
  },
  mounted() {
    this.getDataListFun(1); // 获取列表
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
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
        req_id: this.queryData.req_id,
        kw_account: this.queryData.kw_account,
        account_id: this.queryData.account_id,
        ptype: Number(this.queryData.ptype) || -1,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total
          this.tableData = res.data.list.map(item => {
            item.ptype = item.ptype ? String(item.ptype) : ''
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

    // 打开配置
    openConfigModal(row,kay) {
      this.configData.show = true
      this.configData.kay = kay
      this.configData.formData = deepClone(row)
      if (row[kay]) {
        this.configData.value = JSON.parse(row[kay])
      }
    },

    // 关闭配置
    closeConfigModal() {
      this.configData.show = false
      this.configData.formData = {}
      this.configData.value = null
      this.$refs.refJsonEditorToo.closeClearFun()
    },
    // 对数据 禁用选择
    selectable(row, index) {
      return true// row.status === '4'
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      if (command.item.label === '批量删除') {
        this.delDataFun()
      }
    },
    // 删除
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
            delDataApi(formData).then(res => {
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
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },

    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 行内筛选项
    handleRowQuery(val, key, type) {
      if (type === 'table') {
        this.queryData[key] = val
        this.getDataListFun()
      }
    },
    // 重置
    restQueryBtn() {
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        req_id: '',
        kw_account: '',
        account_id: '',
        ptype: ''
      }
      this.getDataListFun(1)
      this.$refs.serveTable.clearSort()
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
    formatTimestamp,
    getLabelByVal

  }
}
</script>

<style lang="scss" scoped>
.dataText {
  cursor: pointer;
  color: #1890ff;
  text-decoration: underline;
}
</style>
