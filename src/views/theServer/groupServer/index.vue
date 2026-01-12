<!-- 站群服务器 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.host" clearable placeholder="请输入服务器IP" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">新建服务器</el-button>
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
        @handlePageSize="switchPage"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('sys_g020')" type="index" width="60" />
        <el-table-column label="名称" min-width="100" prop="name" />
        <el-table-column label="服务器IP" min-width="150" prop="host">
          <template slot-scope="scope">
            {{ scope.row.host ? scope.row.host : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="服务器端口" min-width="120" prop="server_port">
          <template slot-scope="scope">
            {{ scope.row.server_port ? scope.row.server_port : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="数据库名称" min-width="100" prop="database_name">
          <template slot-scope="scope">
            {{ scope.row.database_name ? scope.row.database_name : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="数据库端口" min-width="120" prop="port">
          <template slot-scope="scope">
            {{ scope.row.port ? scope.row.port : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="数据库用户" min-width="100" prop="database_user" show-overflow-tooltip />
        <el-table-column label="数据库密码" min-width="100" prop="database_pwd" show-overflow-tooltip />
        <el-table-column label="ApiKey" min-width="100" prop="api_key" show-overflow-tooltip />
        <el-table-column label="备注" min-width="100" prop="remark">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.stop="openRemarkFun(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" min-width="100" prop="expire_time" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row[scope.column.property]) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row[scope.column.property]) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="240">
          <template slot-scope="scope">
            <el-button size="small" style="margin-right: 15px" type="primary" @click.stop="domainNameFun(scope.row)">同步域名
            </el-button>
            <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
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
      :close-on-click-modal="false"
      :title="addModal.type==='add'?'新建服务器':'编辑服务器'"
      :visible.sync="addModal.show"
      center
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addModal.formData.name" placeholder="请输入名称" @input="changeInput" />
        </el-form-item>
        <el-form-item label="服务器IP:" prop="host">
          <el-input v-model="addModal.formData.host" placeholder="请输入服务器IP" @input="changeInput" />
        </el-form-item>
        <el-form-item label="服务器端口:" prop="server_port">
          <el-input v-model="addModal.formData.server_port" placeholder="请输入服务器端口" @input="changeInput" />
        </el-form-item>
        <el-form-item label="数据库名称:" prop="database_name">
          <el-input v-model="addModal.formData.database_name" placeholder="请输入数据库名称" @input="changeInput" />
        </el-form-item>
        <el-form-item label="数据库端口:" prop="port">
          <el-input v-model="addModal.formData.port" placeholder="请输入数据库端口" @input="changeInput" />
        </el-form-item>
        <el-form-item label="数据库用户:" prop="database_user">
          <el-input v-model="addModal.formData.database_user" placeholder="请输入数据库用户" @input="changeInput" />
        </el-form-item>
        <el-form-item label="数据库密码:" prop="database_pwd">
          <el-input v-model="addModal.formData.database_pwd" placeholder="请输入数据库密码" @input="changeInput" />
        </el-form-item>
        <el-form-item label="ApiKey:" prop="api_key">
          <el-input v-model="addModal.formData.api_key" placeholder="请输入ApiKey" @input="changeInput" />
        </el-form-item>
        <!--        <el-form-item v-if="addModal.type==='add'" label="所属用户:" prop="fuid">-->
        <!--          <el-select v-model="addModal.formData.fuid" clearable filterable placeholder="请选择所属用户">-->
        <!--            <el-option v-for="item in userData" :key="item.uid" :label="item.account" :value="item.uid"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="到期时间:" prop="expire_time">
          <el-date-picker
            v-model="addModal.formData.expire_time"
            placeholder="请选择到期时间"
            type="date"
          />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="addModal.formData.remark" :rows="5" type="textarea" placeholder="请输入备注" @input="changeInput" />
        </el-form-item>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!-- 查看备注 -->
    <el-dialog
      :close-on-click-modal="false"
      title="备注"
      :visible.sync="remarkModal.show"
      center
      width="800px"
      @close="closeRemarkModal"
    >
      <el-form ref="refRemarkModal" :model="remarkModal.formData" :rules="remarkModal.rules" label-width="60px" size="small">
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="remarkModal.formData.remark" :rows="10" :readonly="true" type="textarea" placeholder="请输入备注" @input="changeInput" />
        </el-form-item>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeRemarkModal">关闭</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, editDataApi, syncDoMainApi } from './api';
import { deepClone, resetPage, successTips } from '@/utils';
import { formatTimestamp } from '@/filters'
import { adminuser } from '@/api/permission';

export default {
  name: 'GroupServer',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        host: '',
      },
      setBatchData: {
        show: false,
        title: '',
        idx: -1,
        item: {},
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
          remark: ''
        },
        rules: {
          name: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          host: [{ required: true, message: '请输入服务器IP！', trigger: 'change' }],
          server_port: [{ required: true, message: '请输入服务器端口！', trigger: 'change' }],
          database_name: [{ required: true, message: '请输入数据库名称！', trigger: 'change' }],
          port: [{ required: true, message: '请输入数据库端口！', trigger: 'change' }],
          database_user: [{ required: true, message: '请输入数据库用户！', trigger: 'change' }],
          database_pwd: [{ required: true, message: '请输入数据库密码！', trigger: 'change' }],
          api_key: [{ required: true, message: '请输入ApiKey！', trigger: 'change' }],
          remark: [{ required: true, message: '请输入备注！', trigger: 'change' }],
          // fuid: [{ required: true, message: '请选择所属用户！', trigger: 'change' }],
          expire_time: [{ required: true, message: '请输入到期时间！', trigger: 'change' }],
        }
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      userData: [],// 所属用户列表
      batchOption: [
        {
          icon: 'delete',
          label: '批量删除'
        },
      ],
      loading: false,
      isLoading: false,
      remarkModal: {
        show: false,
        formData: {
          remark: ''
        },
      },

    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.getAdminUserFun() // 获取用户
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
        host: this.queryData.host, // //服务器IP - 筛选项
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list || [];
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
      this.addModal.formData.expire_time = row.expire_time * 1000
    },
    // 打开备注
    openRemarkFun(row) {
      this.remarkModal.show = true
      this.remarkModal.formData = deepClone(row)
    },
    closeRemarkModal() {
      this.remarkModal.show = false
      this.remarkModal.formData.remark = ''
      this.$refs.refRemarkModal.resetFields();
    },
    // 域名同步
    domainNameFun(row) {
      this.$confirm(`确认域名同步吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const params = {
              host: row.host,
              api_key: row.api_key,
              server_port: row.server_port,
            }
            syncDoMainApi(params).then(res => {
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
    // 新建保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          const formData = this.addModal.formData
          formData.expire_time = this.addModal.formData.expire_time ? new Date(this.addModal.formData.expire_time).getTime() / 1000 : ''
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
      this.setBatchData.idx = command.idx
      this.setBatchData.item = command.item
      if (command.item.label === '批量删除') {
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
      this.cliHeight = document.documentElement.clientHeight - 300;
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
    formatTimestamp

  }
}
</script>

<style scoped>

</style>
