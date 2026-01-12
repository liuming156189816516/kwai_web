<!-- 域名列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.do_main_url" clearable placeholder="请输入域名" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.server_id" clearable placeholder="请输入服务器" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="postExpireTimeFun">同步到期时间</el-button>
      </el-form-item>
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
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="域名" min-width="120" prop="do_main_url" />
        <el-table-column label="Ssl证书" min-width="120" prop="ssl" />
        <el-table-column label="状态" min-width="100" prop="status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'status')">
              <span :class="[Number(queryData.status) >0?'dropdown_title':'']" style="color:#909399">
                状态  <i class="el-icon-arrow-down el-icon--right" />
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
            <el-tag :type="getLabelByVal(scope.row.status, statusList,{label:'type',value:'value'})" size="small">
              {{ getLabelByVal(scope.row.status, statusList) || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" min-width="100" prop="use_status">
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'use_status')">
              <span :class="[Number(queryData.use_status) >-1?'dropdown_title':'']" style="color:#909399">
                使用状态 <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in useStatusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.use_status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <template slot-scope="scope">
            <el-tag :type="getLabelByVal(scope.row.use_status, useStatusList,{label:'type',value:'value'})" size="small">
              {{ getLabelByVal(scope.row.use_status, useStatusList) || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="服务器" min-width="120" prop="server_id">
          <template slot-scope="scope">
            {{ scope.row.server_id ? scope.row.server_id : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="到期时间" min-width="100" prop="expiration_time" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="失效原因" min-width="120" prop="reason">
          <template slot-scope="scope">
            {{ scope.row.reason ? scope.row.reason : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="120" prop="ps">
          <template slot-scope="scope">
            {{ scope.row.ps ? scope.row.ps : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Tk账号" min-width="120" prop="tk_account">
          <template slot-scope="scope">
            {{ scope.row.tk_account ? scope.row.tk_account : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
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
  </div>
</template>

<script>
import { getDataApi ,postExpireTimeApi ,exportDataApi } from './api';
import { resetPage, getLabelByVal, successTips } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'GroupServer',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        do_main_url: '',
        use_status: '-1',
        status: '0',
        server_id: ''
      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        formData: {},
        rules: {}
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          name: '',
          host: '',
          database_name: '',
          port: '',
          database_user: '',
          database_pwd: '',
          api_key: '',
        },
        rules: {
          name: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          host: [{ required: true, message: '请输入服务器ip！', trigger: 'change' }],
          database_name: [{ required: true, message: '请输入数据库名称！', trigger: 'change' }],
          port: [{ required: true, message: '请输入数据库端口！', trigger: 'change' }],
          database_user: [{ required: true, message: '请输入数据库用户！', trigger: 'change' }],
          database_pwd: [{ required: true, message: '请输入数据库密码！', trigger: 'change' }],
          api_key: [{ required: false, message: '请输入ApiKey！', trigger: 'change' }],
        }
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      batchOption: [
        {
          icon: 'download',
          label: '批量导出'
        },
      ],
      loading: false,
      isLoading: false,
      useStatusList: [
        {
          label: '全部',
          value: '-1',
          type: '',
        },
        {
          label: '未使用',
          value: '0',
          type: '',
        },
        {
          label: '使用中',
          value: '1',
          type: 'success',
        },
        {
          label: '不可用',
          value: '2',
          type: 'danger',
        },
      ],
      statusList: [
        {
          label: '全部',
          value: '0',
          type: '',
        },
        {
          label: '有效',
          value: '1',
          type: 'success',
        },
        {
          label: '即将失效',
          value: '2',
          type: 'danger',
        },
        {
          label: '已失效',
          value: '3',
          type: 'danger',
        },
      ],
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
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
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        do_main_url: this.queryData.do_main_url, // 域名 - 筛选项
        use_status: Number(this.queryData.use_status) || 0 , // 使用状态 - 筛选项
        status: Number(this.queryData.status) || -1, // 状态 - 筛选项
        server_id: this.queryData.server_id || ''
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list.map(item => {
            item.use_status = item.use_status ? String(item.use_status) : '0'
            item.status = item.status ? String(item.status) : '0'
            return item
          });
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      })
    },

    // 同步域名到期时间
    postExpireTimeFun() {
      this.$confirm(`确认同步域名到期时间吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {}
            postExpireTimeApi(formData).then(res => {
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
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.idx = command.idx
      this.setBatchData.item = command.item
      console.log('command',command)
      if (command.item.label === '批量导出') {
        this.$confirm(`确认批量导出吗？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              const formData = { ids: this.selectIdData }
              exportDataApi(formData).then(res => {
                if (res.msg === 'success') {
                  window.location.href = res.data.url
                  done();
                  instance.confirmButtonLoading = false;
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
      }
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
    handleRowQuery(val,key) {
      this.queryData[key] = val
      this.getDataListFun()
    },
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.queryData.do_main_url = ''
      this.queryData.use_status = '-1'
      this.queryData.status = ''
      this.queryData.server_id = ''

      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      }
      // else if (type === 'modal') {
      //
      // }
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

<style scoped>

</style>
