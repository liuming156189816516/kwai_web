<!-- 活码列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.live_code_url" clearable placeholder="请输入活码地址" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.source_url" clearable placeholder="请输入跳转网址" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.do_main_url" clearable placeholder="请输入所属域名" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form v-if="false" size="small" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">添加</el-button>
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
        row-key="id"
        use-virtual
        border
        :height="cliHeight"
        element-loading-spinner="el-icon-loading"
        style="width: 100%;"
        show-body-overflow="title"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" :label="$t('sys_g020')" width="60" />
        <el-table-column prop="live_code_url" label="活码地址" min-width="120" />
        <el-table-column prop="source_url" label="跳转网址" min-width="120" show-overflow-tooltip />
        <el-table-column prop="do_main_url" label="所属域名" min-wid名称th="100" />
        <el-table-column prop="open_type" label="功能选择" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? '直接跳转' : scope.row.status === 2 ? '遮层' : '自动跳转' }}
          </template>
        </el-table-column>
        <el-table-column prop="if_filter_repeat" label="过滤重复" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.status ? '开启' : '不开启' }}
          </template>
        </el-table-column>
        <el-table-column label="Tk账号" min-width="100" prop="tk_account" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.tk_account ? scope.row.tk_account : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="itime" show-overflow-tooltip label="创建时间" min-width="120">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column prop="operation" show-overflow-tooltip label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="editOpenFun(scope.row)">编辑</el-button>
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
    <!-- 添加 编辑 -->
    <el-dialog
      :title="addModal.type==='add'?'新建':'编辑'"
      center
      :visible.sync="addModal.show"
      :close-on-click-modal="false"
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" size="small" :model="addModal.formData" label-width="120px" :rules="addModal.rules">
        <el-form-item label="跳转网址:" prop="source_url">
          <el-input v-model="addModal.formData.source_url" placeholder="请输入跳转网址" @input="changeInput" />
        </el-form-item>
        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, editDataApi } from './api';
import { deepClone, resetPage, successTips,getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'GroupServer',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        live_code_url: '',
        source_url: '',
        do_main_url: '',
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
          source_url: ''
        },
        rules: {
          source_url: [{ required: true, message: '请输入跳转网址！', trigger: 'change' }],
        }
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      batchOption: [
        {
          icon: 'delete',
          label: '批量删除'
        },
      ],
      loading: false,
      isLoading: false,
      statusList: [
        {
          label: '未使用',
          value: '0',
        },
        {
          label: '使用中',
          value: '1',
        },
        {
          label: '已使用',
          value: '2',
        },
      ]
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
        live_code_url: this.queryData.live_code_url,
        source_url: this.queryData.source_url,
        do_main_url: this.queryData.do_main_url,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list.map(item => {
            return item
          });
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      })
    },
    // 新建
    addOpenFun() {
      this.addModal.type = 'add'
      this.addModal.show = true
    },
    editOpenFun(row) {
      this.addModal.show = true
      this.addModal.type = 'edit'
      this.addModal.formData = deepClone(row)
    },
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = this.addModal.formData
          if (this.addModal.type === 'add') {
            formData.ptype = 1
          } else {
            formData.ptype = 2
          }
          editDataApi(formData).then(res => {
            if (res.msg === 'success') {
              this.closeModal()
              this.getDataListFun()
            }
          })
        }
      })
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      this.addModal.formData = {
        name: '',
        host: '',
        database_name: '',
        port: '',
        database_user: '',
        database_pwd: '',
        api_key: '',
      }
      this.$refs.refAddModal.resetFields();
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
              ptype: 3,
              del_id: this.selectIdData,// 要删除与的id集合
            }
            editDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
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
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.idx === 0) {
        this.delDataFun()
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
      this.cliHeight = document.documentElement.clientHeight - 240;
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row,false);
        return;
      }
      tableCell.toggleRowSelection(row,true);
    },
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.queryData.host = ''
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
