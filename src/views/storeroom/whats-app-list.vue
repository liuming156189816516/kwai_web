<!-- 账号列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" class="queryForm" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.account" clearable placeholder="请输入账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.account_id" clearable placeholder="请输入账号ID" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.device_id" clearable placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.reason" clearable placeholder="请输入原因" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.remark" clearable placeholder="请输入备注" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.link_success_num" clearable placeholder="请输入累计链接成功数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.link_fail_num" clearable placeholder="请输入累计链接失败数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.text_success_num" clearable placeholder="请输入累计文本成功数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.text_fail_num" clearable placeholder="请输入累计文本失败数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.today_link_success_num" clearable placeholder="请输入目前链接成功数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.today_link_fail_num" clearable placeholder="请输入目前链接失败数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.today_text_success_num" clearable placeholder="请输入目前文本成功数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.today_text_fail_num" clearable placeholder="请输入目前文本失败数" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="initNumberList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
    </el-form>

    <el-form :inline="true" size="small">
      <el-form-item>
        <el-button :disabled="idx===0||checkIdArray.length===0" type="primary" @click="batchLaunch"> 批量上线</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleBathDataFun(command)}">
          <el-button type="primary">批量操作
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
    <!-- 分组管理 -->
    <div class="continer_main">
      <div :class="[!showGroup?'group_mian_hide':'']">
        <div class="group_head_warp">
          <div class="group_head" @click="changeGroup(0, 'clear')">
            <i class="el-icon-d-arrow-left" @click="showGroup=false" />
            {{ $t('sys_g049') }} ({{ numGroupTotal }})
          </div>
          <div class="group_icon">
            <el-popover v-model="search_icon" placement="top" width="230">
              <p>
                <el-select
                  v-model="queryData.group_name"
                  :placeholder="$t('sys_c053')"
                  clearable
                  filterable
                  size="small"
                  style="width:100%;"
                >
                  <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="search_icon=false">{{ $t('sys_c023') }}</el-button>
                <el-button size="mini" type="primary" @click="initNumberGroup">{{ $t('sys_c024') }}</el-button>
              </div>
              <i slot="reference" class="el-icon-search" style="margin-right: 10px;" />
            </el-popover>
            <el-popover v-model="addVisible" placement="top" width="230">
              <p>
                <el-input
                  v-model="group_name"
                  :placeholder="$t('sys_c112')"
                  maxlength="10"
                  show-word-limit
                  size="small"
                  @input="changeInput"
                />
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addVisible=false">{{ $t('sys_c023') }}</el-button>
                <el-button
                  :disabled="!group_name.trim()"
                  :loading="ipLoading"
                  size="mini"
                  type="primary"
                  @click="addGroup(0, 0)"
                >{{ $t('sys_c024') }}
                </el-button>
              </div>
              <i slot="reference" class="el-icon-plus" @click.stop="editGroup(0, 1)" />
            </el-popover>
          </div>
        </div>
        <el-button v-if="loadingGroup" :loading="true" class="loading_icon" type="primary" />
        <template v-else>
          <div :style="{height:(cliHeight-40)+'px'}" class="group_warp">
            <template v-if="numberGroupList.length>0">
              <transition-group name="fade">
                <div
                  v-for="(item, idx) in numberGroupList"
                  :key="idx"
                  :class="['group_item', queryData.group_id === item.id ? 'group_active' : '']"
                  :draggable="true"
                  @click="changeGroup(item, idx)"
                  @dragstart="dragStart(idx)"
                  @drop="handleMoveSort(idx)"
                  @dragover.prevent
                >
                  <div class="group_name">
                    <i
                      :class="['left_icon', queryData.group_id === item.id ? 'el-icon-folder-opened' : 'el-icon-folder']"
                      class="left_icon"
                    />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                  <div class="group_icon" style="">
                    <div v-if="!item.name.includes('有效账号')" class="collect_icon">
                      <i
                        v-if="item.status"
                        slot="reference"
                        class="el-icon-star-on"
                        style="color: #ffda00;font-size: 20px"
                        @click.stop="handleCollectFun(item,idx,0)"
                      />
                      <i v-else slot="reference" class="el-icon-star-off" @click.stop="handleCollectFun(item,idx,1)" />
                    </div>
                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input
                          v-model="group_name"
                          :placeholder="$t('sys_c112')"
                          clearable
                          maxlength="10"
                          show-word-limit
                          size="small"
                          @input="changeInput"
                        />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{
                          $t('sys_c023')
                        }}
                        </el-button>
                        <el-button
                          :disabled="!group_name.trim()"
                          :loading="ipLoading"
                          size="mini"
                          type="primary"
                          @click="addGroup(item, 2)"
                        >确定
                        </el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click.stop="editGroup(item, 2)" />
                    </el-popover>
                    <el-popconfirm
                      :cancel-button-text="$t('sys_c023')"
                      :confirm-button-text="$t('sys_c024')"
                      :title="$t('sys_c128')"
                      icon="el-icon-info"
                      @confirm="delGroup(item, idx)"
                    >
                      <i slot="reference" class="el-icon-delete" @click.stop />
                    </el-popconfirm>
                  </div>
                </div>
              </transition-group>
            </template>
            <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
          </div>
        </template>
      </div>
      <div class="group_continer" style="margin-left: 20px;">
        <div class="tab_check_warp">
          <span v-if="!showGroup" style="margin-right: 8px;cursor: pointer; color:#409eff;" @click="showGroup=true">
            <el-tooltip content="展开分组" effect="dark" placement="top">
              <i class="el-icon-d-arrow-right" />
            </el-tooltip>
          </span>
          <i class="el-icon-info" />
          <div v-html="$t('sys_mat007',{value:checkIdArray.length})" />
        </div>
        <u-table
          ref="serveTable"
          v-loading="loading"
          :data="accountDataList"
          :height="cliHeight"
          border
          element-loading-spinner="el-icon-loading"
          row-key="id"
          show-body-overflow="title"
          style="width: 100%;"
          use-virtual
          @sort-change="handleSortChange"
          @row-click="rowSelectChange"
          @selection-change="handleSelectionChange"
        >
          <u-table-column :reserve-selection="true" type="selection" width="55" />
          <u-table-column label="头像" prop="head" width="80">
            <template slot-scope="scope">
              <el-avatar v-if="scope.row.head" :src="scope.row.head" />
              <el-avatar v-else icon="el-icon-user-solid" />
            </template>
          </u-table-column>
          <u-table-column label="账号" min-width="100" prop="account" />
          <u-table-column label="账号ID" min-width="120" prop="account_id" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="设备ID" min-width="120" prop="device_id" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.device_id ? scope.row.device_id === '0' ? '-' : scope.row.device_id : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="账号状态" min-width="130" prop="status">
            <template slot="header">
              <el-dropdown trigger="click" @command="(command) => handleNewWork(command,1)">
                <span :class="[queryData.status ?'dropdown_title':'']" style="color:#909399"> {{ $t('sys_c022') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in accountOptions"
                    :key="idx"
                    :class="{'dropdown_selected':idx === queryData.status}"
                    :command="idx"
                  >{{ item === '' ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag :type="handleTag(scope.row.status)" size="small"> {{ accountOptions[scope.row.status] }}</el-tag>
            </template>
          </u-table-column>
          <u-table-column label="使用状态" min-width="100" prop="use_status">
            <template slot="header">
              <el-dropdown trigger="click" @command="(command) => handleNewWork(command,2)">
                <span :class="[queryData.use_status >-1?'dropdown_title':'']" style="color:#909399"> 使用状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in statusList"
                    :key="index"
                    :class="{'dropdown_selected':item.value==queryData.use_status}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag :type="getLabelByVal(scope.row.use_status, statusList,{label:'type',value:'value'})" size="small">
                {{ getLabelByVal(scope.row.use_status, statusList) }}
              </el-tag>
            </template>
          </u-table-column>

          <u-table-column label="累计链接成功数" min-width="120" prop="link_success_num" sortable="custom" />
          <u-table-column label="累计链接失败数" min-width="120" prop="link_fail_num" sortable="custom" />
          <u-table-column label="累计文本成功数" min-width="120" prop="text_success_num" sortable="custom" />
          <u-table-column label="累计文本失败数" min-width="120" prop="text_fail_num" sortable="custom" />
          <u-table-column label="目前链接成功数" min-width="120" prop="today_link_success_num" sortable="custom" />
          <u-table-column label="目前链接失败数" min-width="120" prop="today_link_fail_num" sortable="custom" />
          <u-table-column label="目前文本成功数" min-width="120" prop="today_text_success_num" sortable="custom" />
          <u-table-column label="目前文本失败数" min-width="120" prop="today_text_fail_num" sortable="custom" />
          <u-table-column label="原因" min-width="130" prop="reason" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.reason ? scope.row.reason : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="备注" min-width="100" prop="remark" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="remark_ext">{{ scope.row.remark }}</div>
              <div @click.stop="editRemark(scope.row)">
                <i class="el-icon-edit" style="color: rgb(103, 194, 58); cursor: pointer;" />
              </div>
            </template>
          </u-table-column>
          <u-table-column label="入库时间" min-width="150" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : '-' }}
            </template>
          </u-table-column>
          <u-table-column label="冻结时间" min-width="150" prop="freeze_time" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.freeze_time > 0 ? $baseFun.resetTime(scope.row.freeze_time * 1000) : '-' }}
            </template>
          </u-table-column>
        </u-table>

        <div class="layui_page">
          <el-pagination
            :current-page.sync="queryData.page"
            :page-size="queryData.limit"
            :page-sizes="pageOption"
            :total="queryData.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="homelHandleSize"
            @current-change="homeHandleCurrent"
          />
        </div>

      </div>
    </div>
    <!-- 批量操作 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="batchOptionData.title"
      :visible.sync="batchOptionData.show"
      :width="'550px'"
      center
    >
      <el-form
        v-if="batchOptionData.show"
        ref="refForm"
        :model="batchOptionData.ipForm"
        :rules="batchOptionData.ipRules"
        label-width="100px"
        size="small"
      >
        <!-- 移至其他分组 -->
        <template v-if="batchOptionData.btnLabel === '移至其他分组'">
          <el-form-item :label="$t('sys_c053') + ':'" label-width="140px" prop="group_id">
            <el-select
              v-model="batchOptionData.ipForm.group_id"
              :placeholder="$t('sys_c053')"
              clearable
              filterable
              size="small"
              style="width:100%;"
            >
              <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="group_tips">一个账号只能存在于一个分组中！</div>
          </el-form-item>
        </template>

        <!-- 批量修改备注 -->
        <template v-if="batchOptionData.btnLabel === '批量修改备注' ">
          <el-form-item label-width="0" prop="remock_text">
            <el-input
              v-model="batchOptionData.ipForm.remock_text"
              :placeholder="$t('sys_mat021')"
              :rows="6"
              maxlength="50"
              show-word-limit
              size="small"
              type="textarea"
            />
          </el-form-item>
        </template>

        <!-- 批量解冻 -->
        <template v-if="batchOptionData.btnLabel === '批量解冻' ">
          <el-form-item label="最小冻结时长（小时）" label-width="180px" prop="min_hour">
            <el-input v-model="batchOptionData.ipForm.min_hour" clearable placeholder="请输入最小冻结时长（小时" />
          </el-form-item>
          <el-form-item label="最大冻结时长（小时）" label-width="180px" prop="max_hour">
            <el-input v-model="batchOptionData.ipForm.max_hour" clearable placeholder="请输入最大冻结时长（小时" />
          </el-form-item>
        </template>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;margin-top: 40px;">
          <el-button @click="batchOptionData.show = false">取消</el-button>
          <el-button
            :loading="isLoading"
            type="primary"
            @click="submitSetBtn('refForm')"
          >确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="model.title"
      :visible.sync="model.show"
      :width="model.width"
      center
      @close="closeModal"
    >
      <div class="modalContent">
        <template v-if="model.title ==='余额校正工具'">
          <p v-for="(item,index) in model.dataList" :key="index">{{ item }}</p>
        </template>
      </div>
      <div style="text-align:center;position: relative">
        <el-button type="primary" @click="closeModal">关闭</el-button>
        <el-button class="setNone" type="primary" @click="setNoneFun">设置不可用</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { successTips, resetPage, getLabelByVal, getLabelArrByVal } from '@/utils/index'
import {
  getaccountinfolist,
  getaccountgrouplist,
  doaccountgroup,
  doupgroup,
  dooutputaccount,
  dobatchdelaccount,
  doupremark,
  sortgroup,
  dobatchaccountdetailApi,
  dobatchlogin,
  setaccountunavailableApi, batchUnfreezeAccountApi,
} from '@/api/storeroom'

export default {
  data() {
    return {
      queryData: {
        page: 1,
        limit: 100,
        total: 0,
        account: '',
        group_id: '',
        custom_popover: '960px',
        select_sort: 'account',
        status: '',
        use_status: -1,
        group_name: '',
        account_id: '',
        device_id: '',
        sort: '',
        reason: '',
        remark: '',
        link_success_num: '',
        link_fail_num: '',
        text_success_num: '',
        text_fail_num: '',
        today_link_success_num: '',
        today_link_fail_num: '',
        today_text_success_num: '',
        today_text_fail_num: '',
      },
      cliHeight: null,
      numGroupTotal: 0,
      accountDataList: [],
      numberGroupList: [],
      loading: false,
      closeModel: false,
      ipLoading: false,
      showGroup: true,
      checkIdArray: [],
      checkAccount: [],
      selectArray: [],
      search_icon: false,
      loadingGroup: false,
      blockGroupLoading: false,
      isBlockLoading: false,

      pageOption: resetPage(),
      offest: 1,
      limit: 200,
      total: 0,
      groupIdx: '',
      checkedNum: 0,
      isLoading: false,
      visible: false,
      addVisible: false,
      cardAcyive: '1',
      type: '',
      group_id: '',
      group_name: '',
      group_status: 0,
      close_icon: '',
      close_group_name: '',
      titleGroupIdx: '',
      batchArry: [],
      staffCheck: [],
      blockType: null,
      blockAccount: [],
      inheritAccount: [],
      blockAccountList: [],
      groupForm: {
        id: '',
        account: '',
        group_id: '',
        title: '',
        content: ''
      },
      blockTitle: '',
      blockGroupList: [],
      blockCheckList: [],
      blockPramse: {
        group_id: '',
        offest: 1,
        limit: 10,
        total: 0
      },
      draggedItemIndex: 0,
      statusList: [
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
      limitErrList: [
        {
          label: '私发',
          value: '2',
          type: '',
        },
      ],
      bindCardStatusList: [
        {
          label: '全部',
          value: '',
          type: '',
        },
        {
          label: '未绑卡',
          value: '1',
          type: '',
        },
        {
          label: '待绑卡',
          value: '2',
          type: '',
        },
        {
          label: '绑卡中',
          value: '3',
          type: '',
        },
        {
          label: '绑卡失败',
          value: '4',
          type: '',
        },
        {
          label: '已绑卡',
          value: '5',
          type: '',
        },
      ],
      payStatusList: [
        {
          label: '全部',
          value: '',
          type: '',
        },
        {
          label: '待充值',
          value: '1',
          type: '',
        },
        {
          label: '充值中',
          value: '2',
          type: '',
        },
        {
          label: '充值完成',
          value: '3',
          type: '',
        },
      ],
      batchOptionData: {
        show: false,
        title: '',
        ipForm: {
          id: '',
          ip_id: '',
          iptype: '',
          group_id: '',
          staff_name: '',
          use_status: 1,
          remock_text: '',
          allocat_role: 1,
          seat_type: 1,
          staffCheck: [],
          deviceIdText: '',
          min_hour: '', // 最小
          max_hour: '', // 最大
        },
        ipRules: {
          use_status: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          expire_time: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          remock_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }],
          deviceIdText: [{ required: true, message: '请输入设备ID', trigger: 'change' }],
          iptype: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          ip_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          allocat_role: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          seat_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          staffCheck: [{ type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          min_hour: [{ required: true, message: '请输入', trigger: 'change' }],
          max_hour: [{ required: true, message: '请输入', trigger: 'change' }],

        },
        btnLabel: ''
      },
      model: {
        show: false,
        title: '',
        width: '35%',
        data: null,
        dataList: [],
        itemApi: {}
      }
    }
  },
  computed: {
    accountOptions() {
      return ['', this.$t('sys_g032'), this.$t('sys_g033'), this.$t('sys_g034')]
    },

    moveRules() {
      return {
        checked_group: [{ required: true, message: this.$t('sys_c051'), trigger: 'change' }],
      }
    },
    groupRules() {
      return {
        title: [{ required: true, message: this.$t('sys_mat018'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('sys_mat020'), trigger: 'blur' }],
      }
    },
    // 批量操作
    batchOption() {
      return [
        { icon: 'rank', label: '移至其他分组', index: 1, api: doupgroup },
        { icon: 'download', label: '批量导出', index: 3, api: dooutputaccount },
        { icon: 'delete', label: '批量删除', index: 4, api: dobatchdelaccount },
        { icon: 'edit', label: '批量修改备注', index: 5, api: doupremark },
        { icon: 'odometer', label: '批量检测', index: 11, api: dobatchaccountdetailApi },
        { icon: 's-tools', label: '批量解冻', index: 12, api: batchUnfreezeAccountApi },
      ]
    },
  },
  watch: {
    'batchOptionData.show'(val) {
      if (val === false) {
        this.$refs.refForm.resetFields();
        this.batchOptionData.ipForm.iptype = '';
        this.batchOptionData.ipForm.staffCheck = [];
        this.batchOptionData.ipForm.group_id = '';
        this.batchOptionData.ipForm.use_status = 1;
        this.batchOptionData.ipForm.remock_text = '';
        this.batchOptionData.ipForm.deviceIdText = ''
      }
    }
  },
  created() {
    //   this.syncInitApi();
    this.initNumberGroup();
    this.initNumberList();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 设置页面高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 320;
    },
    // 修改备注
    editRemark(row) {
      this.batchOptionData.btnLabel = '批量修改备注';
      this.batchOptionData.show = true;
      this.batchOptionData.ipForm.account = row.account;
      this.batchOptionData.ipForm.remock_text = row.remark || '';
      this.batchOptionData.title = '修改备注';
    },
    // 获取分组列表数据
    async initNumberGroup() {
      this.loadingGroup = true;
      const { data } = await getaccountgrouplist({ name: this.queryData.group_name, page: 1, limit: 100 });
      console.log('data', data)
      this.search_icon = false;
      this.loadingGroup = false;
      this.numGroupTotal = data.total;
      this.numberGroupList = data.list || []
    },
    // 主数据
    initNumberList(num) {
      this.loading = true;
      this.queryData.page = num || this.queryData.page;

      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        account: this.queryData.account, // 账号
        sort: this.queryData.sort, // 排序
        status: this.queryData.status || -1,
        use_status: this.queryData.use_status === 0 ? 0 : this.queryData.use_status || -1,
        device_id: this.queryData.device_id,
        account_id: this.queryData.account_id,
        group_id: this.queryData.group_id, // 分组
        reason: this.queryData.reason,
        remark: this.queryData.remark,
        link_success_num: Number(this.queryData.link_success_num) || 0,
        link_fail_num: Number(this.queryData.link_fail_num) || 0,
        text_success_num: Number(this.queryData.text_success_num) || 0,
        text_fail_num: Number(this.queryData.text_fail_num) || 0,
        today_link_success_num: Number(this.queryData.today_link_success_num) || 0,
        today_link_fail_num: Number(this.queryData.today_link_fail_num) || 0,
        today_text_success_num: Number(this.queryData.today_text_success_num) || 0,
        today_text_fail_num: Number(this.queryData.today_text_fail_num) || 0,
      }

      getaccountinfolist(params).then(res => {
        this.loading = false;
        this.queryData.total = res.data.total;

        this.accountDataList = res.data.list.map(item => {
          item.use_status = item.use_status ? String(item.use_status) : '0'
          return item
        });
        this.$nextTick(() => {
          const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
          tableBodyWrapper.scrollTop = 0
        })
      })
    },
    // 重置 列表
    restQueryBtn() {
      this.queryData = {
        page: 1,
        limit: 100,
        total: 0,
        account: '',
        group_id: '',
        custom_popover: '960px',
        select_sort: 'account',
        status: '',
        use_status: -1,
        group_name: '',
        account_id: '',
        device_id: '',
        sort: '',
        reason: '',
        remark: '',
        link_success_num: '',
        link_fail_num: '',
        text_success_num: '',
        text_fail_num: '',
        today_link_success_num: '',
        today_link_fail_num: '',
        today_text_success_num: '',
        today_text_fail_num: '',
      }

      this.checkIdArray = [];
      this.checkAccount = [];
      this.selectArray = []
      this.initNumberList(1)
      this.$refs.serveTable.clearSelection();
      this.$refs.serveTable.clearSort()
    },
    // 批量操作
    handleBathDataFun(command) {
      this.batchOptionData.ipForm.account = '';
      this.blockAccount = [];
      this.inheritAccount = [];
      // if (this.checkIdArray.length === 0) {
      //   return successTips(this, 'error', '请勾选要操作的列表!');
      // }
      this.batchOptionData.title = command.item.label;
      this.batchOptionData.btnLabel = command.item.label;
      if (command.item.label === '移至其他分组' || command.item.label === '批量修改备注' || command.item.label === '批量解冻') {
        this.batchOptionData.show = true;
        this.$nextTick(() => {
          this.$refs.refForm.resetFields();
        })
      } else {
        this.popConfirm(command);
      }
    },
    // 批量上线
    batchLaunch() {
      const that = this;
      that.$confirm(`确认批量上线吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            const params = {
              accounts: that.checkAccount
            }
            instance.confirmButtonLoading = true;

            dobatchlogin(params).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code !== 0) return;
              that.initNumberList();
              that.$refs.serveTable.clearSelection();
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
    // 批量操作 确认框
    popConfirm(command) {
      const that = this;
      that.$confirm(`确认${command.item.label}吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            const reqApi = command.item.api;
            const labelIndex = command.item.label
            let params = {}
            params.accounts = that.checkAccount
            instance.confirmButtonLoading = true;
            if (labelIndex === '批量退款') { // 批量退款
              params = { accounts: that.checkAccount, }
            }
            if (labelIndex === '批量充值' || labelIndex === '批量检测' || labelIndex === '绑定信用卡') {
              params = { accounts: that.checkAccount, }
            }

            if (labelIndex === '解绑信用卡' || labelIndex === '解绑域名') { // 解绑信用卡1 // 解绑域名2
              params = {
                ptype: command.item.index === 7 ? 1 : 2,
                accounts: that.checkAccount,
              }
            }
            reqApi(params).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code !== 0) return;
              that.initNumberList();
              that.$refs.serveTable.clearSelection();
              if (labelIndex === '批量导出') {
                window.location.href = res.data.url
              }
              if (labelIndex === '批量删除') {
                that.initNumberGroup();
              }

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
    // 批量操作 弹窗确认
    submitSetBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            list_req: {
              page: this.queryData.page,
              limit: this.queryData.limit,
              account: this.queryData.account, // 账号
              sort: this.queryData.sort, // 排序
              status: this.queryData.status || -1,
              use_status: this.queryData.use_status === 0 ? 0 : this.queryData.use_status || -1,
              device_id: this.queryData.device_id,
              account_id: this.queryData.account_id,
              group_id: this.queryData.group_id, // 分组
              reason: this.queryData.reason,
              remark: this.queryData.remark,
              link_success_num: Number(this.queryData.link_success_num) || 0,
              link_fail_num: Number(this.queryData.link_fail_num) || 0,
              text_success_num: Number(this.queryData.text_success_num) || 0,
              text_fail_num: Number(this.queryData.text_fail_num) || 0,
              today_link_success_num: Number(this.queryData.today_link_success_num) || 0,
              today_link_fail_num: Number(this.queryData.today_link_fail_num) || 0,
              today_text_success_num: Number(this.queryData.today_text_success_num) || 0,
              today_text_fail_num: Number(this.queryData.today_text_fail_num) || 0,
            }
          }
          this.batchOptionData.ipForm.account ? params.accounts = [this.batchOptionData.ipForm.account] : params.accounts = this.checkAccount;
          if (this.batchOptionData.btnLabel === '批量下线') {
            params.expire_time = Date.parse(this.$baseFun.resetTime(this.batchOptionData.ipForm.expire_time)) / 1000;
          } else if (this.batchOptionData.btnLabel === '移至其他分组') {
            params.group_id = this.batchOptionData.ipForm.group_id // 移动分组
          } else if (this.batchOptionData.btnLabel === '批量修改备注') {
            params.remark = this.batchOptionData.ipForm.remock_text // 修改备注
          } else if (this.batchOptionData.btnLabel === '批量解冻') {
            const min_hour = this.batchOptionData.ipForm.min_hour
            const max_hour = this.batchOptionData.ipForm.max_hour
            if (max_hour <= min_hour) {
              this.$message.error('最大值不可以小于等于最小值')
              return false
            }
            params.min_hour = min_hour > 0 ? Number(min_hour) : 0 // 最小冻结时长（小时）
            params.max_hour = max_hour > 0 ? Number(max_hour) : 0 // 最大冻结时长（小时）
          }
          let reqApi;
          this.isLoading = true;
          this.batchOption.forEach(item => {
            if (item.label === this.batchOptionData.btnLabel) {
              reqApi = item.api
            }
          })
          reqApi(params).then(res => {
            this.isLoading = false;
            if (res.code !== 0) return;
            this.batchOptionData.show = false;
            if (this.batchOptionData.btnLabel === '移至其他分组') {
              this.initNumberGroup();
            }
            this.initNumberList();
            this.$refs.serveTable.clearSelection();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 全选
    allChecked() {
      console.log('123')
    },
    // 分页 切换
    homelHandleSize(val) {
      this.queryData.limit = val;
      this.initNumberList();
    },
    // 页码
    homeHandleCurrent(val) {
      this.queryData.page = val;
      this.initNumberList();
    },
    // 筛选项 排序
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') { // 下降 倒序
        switch (prop) {
          case 'link_success_num': // 累计链接成功数
            this.queryData.sort = '-' + prop
            break;
          case 'link_fail_num': // 累计链接失败数
            this.queryData.sort = '-' + prop
            break;
          case 'text_success_num': // 累计文本成功数
            this.queryData.sort = '-' + prop
            break;
          case 'text_fail_num': // 累计文本失败数
            this.queryData.sort = '-' + prop
            break;
          case 'today_link_success_num': // 目前链接成功数
            this.queryData.sort = '-' + prop
            break;
          case 'today_link_fail_num': // 目前链接失败数
            this.queryData.sort = '-' + prop
            break;
          case 'today_text_success_num': // 目前文本成功数
            this.queryData.sort = '-' + prop
            break;
          case 'today_text_fail_num': // 目前文本失败数
            this.queryData.sort = '-' + prop
            break;
        }
      } else if (order === 'ascending') { // 上升 = 正序
        switch (prop) {
          case 'link_success_num': // 累计链接成功数
            this.queryData.sort = prop
            break;
          case 'link_fail_num': // 累计链接失败数
            this.queryData.sort = prop
            break;
          case 'text_success_num': // 累计文本成功数
            this.queryData.sort = prop
            break;
          case 'text_fail_num': // 累计文本失败数
            this.queryData.sort = prop
            break;
          case 'today_link_success_num': // 目前链接成功数
            this.queryData.sort = prop
            break;
          case 'today_link_fail_num': // 目前链接失败数
            this.queryData.sort = prop
            break;
          case 'today_text_success_num': // 目前文本成功数
            this.queryData.sort = prop
            break;
          case 'today_text_fail_num': // 目前文本失败数
            this.queryData.sort = prop
        }
      } else {
        this.queryData.sort = ''
      }
      this.initNumberList();
    },
    // 单行 点击勾选
    rowSelectChange(row, column, event) {
      const tableCell = this.$refs.serveTable;
      if (this.checkIdArray.includes(row.id)) {
        tableCell.toggleRowSelection([{ row: row, selected: false }]);
        return;
      }
      tableCell.toggleRowSelection([{ row: row, selected: true }]);
    },
    // 勾选列表
    handleSelectionChange(arr) {
      this.checkIdArray = arr.map(item => {
        return item.id
      })
      this.checkAccount = arr.map(item => {
        return item.account
      })
    },
    // 表格 赋值
    handleNewWork(row, idx) {
      if (idx === 1) {
        this.queryData.status = row;
      } else if (idx === 2) {
        this.queryData.use_status = Number(row);
      }
      this.initNumberList();
    },
    // 编辑分组
    editGroup(row, idx) {
      this.type = idx;
      this.group_name = '';
      if (idx === 1) return;
      this.groupForm.id = row.id;
      this.group_name = row.name;
      this.group_status = row.status;
    },
    // 新建分组
    addGroup(title) {
      const params = {
        ptype: this.type,
        name: this.group_name,
        type: Number(this.cardAcyive),
        status: this.group_status
      }
      this.ipLoading = true;
      this.type === 2 ? params.id = this.groupForm.id : '';
      doaccountgroup(params).then(res => {
        if (res.code !== 0) {
          this.visible = false;
          this.ipLoading = false;
          this.addVisible = false;
        } else {
          this.visible = false;
          this.ipLoading = false;
          this.addVisible = false;
          this.initNumberGroup();
          successTips(this)
        }
      })
    },
    // 删除分组
    async delGroup(row) {
      const res = await doaccountgroup({ ptype: 3, del_id: [row.id] });
      if (res.code !== 0) return;
      this.groupIdx = 0;
      this.groupForm.group_id = '';
      successTips(this)
      for (let k = 0; k < this.numberGroupList.length; k++) {
        if (this.numberGroupList[k].id === row.id) {
          this.numberGroupList.splice(k, 1)
        }
      }
    },
    // 点击分组
    changeGroup(row, idx) {
      this.batchArry = [];
      this.checkedNum = 0;
      this.groupIdx = idx;
      this.queryData.group_id = idx === 'clear' ? '' : row.id;
      if (idx === 'clear') {
        this.initNumberGroup()
      }
      this.initNumberList(1);
      this.$refs.serveTable.clearSelection();
    },
    // 收藏分组
    handleCollectFun(item, index, value) {
      this.numberGroupList[index].status = value
      const params = {
        ptype: 2,
        name: item.name,
        type: Number(this.cardAcyive),
        status: value,
        id: item.id
      }
      console.log('params', params)
      doaccountgroup(params).then(res => {
        // if (res.msg === 'success') {
        //
        // }
      })
    },

    handleTag(type) {
      let color;
      switch (type) {
        case 1:
          color = 'danger';
          break;
        case 2:
          color = 'success';
          break;
        case 3:
          color = 'warning';
          break;
        case 4:
          color = 'danger';
          break;
        case 5:
          color = 'warning';
          break;
        default:
          break;
      }
      return color;
    },
    dragStart(index) {
      this.draggedItemIndex = index;
    },
    async handleMoveSort(index) {
      const draggedItem = this.numberGroupList[this.draggedItemIndex];
      this.numberGroupList.splice(this.draggedItemIndex, 1);
      this.numberGroupList.splice(index, 0, draggedItem);
      this.draggedItemIndex = -1;
      const sortMap = this.numberGroupList.map(item => {
        return item.id
      });
      const res = await sortgroup({ list: sortMap });
      if (res.code !== 0) return;
    },

    // 弹出框
    closeModal() {
      this.model.show = false
      this.model.title = ''
      this.model.dataList = []
    },
    // 设置不可用
    setNoneFun() {
      const that = this;
      that.$confirm(`确认设置不可用吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            setaccountunavailableApi().then(res => {
              if (res.msg === 'success') {
                done();
                instance.confirmButtonLoading = false;
                that.$message({ type: 'info', message: '执行成功！' });
                const params = {}
                that.model.itemApi.item.api(params).then(res => {
                  if (res.msg === 'success') {
                    const arr = res.data.message.split('\n')
                    that.model.dataList = []
                    arr.forEach(item => {
                      if (item) {
                        that.model.dataList.push(item)
                      }
                    })
                  }
                })
              }
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
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    getLabelByVal,
    getLabelArrByVal
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  width: 100%;
  height: 118px;
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  & > div {
    flex: 1;
  }

  .refsh_icon {
    cursor: pointer;
    color: #409eff;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .box_card_item {
    display: flex;
    cursor: pointer;
    padding: 6px;
    align-items: center;
    flex-direction: column;

    span {
      font-size: 16px;
    }

    .port_title {
      color: #409eff;
      font-size: 18px;
      margin-bottom: 20px;
    }
  }
}

.level_01 {
  display: flex;
  color: #C0C4CC;
  align-items: center;
  width: max-content;
  padding: 0 15px;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  border: 1px solid #DCDFE6;

  .level_01_1 {
    color: #606266;
    font-size: 13px;
    margin-left: 10px;
  }

  .screen_t_02 {
    width: 20px;
    height: 20px;
    color: #fff;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-left: 5px;
    background-color: #409eff;
  }

  .down_01 {
    width: 500px;
    height: 40px;
    position: absolute;
    top: 40px;
    left: 0;
    border-radius: 4px;
    border: solid 1px #dfe4ed;
    background-color: #FFFFFF;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .down_01_01 {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      top: -12px;
      left: 20%;
      transform: translateX(-50%);
      margin-right: 3px;
      border-bottom-width: 0;
      border-bottom-color: #e6ebf5;
      border-width: 6px;
      -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    }

    .down_01_01::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
    }
  }
}

.level_01:hover {
  border-color: #C0C4CC;
}

.custom_popover {
  .screen_01 {
    color: #209cdf;
    display: flex;

    .screen_t_01 {
      display: flex;
      opacity: .7;
      align-items: center;
      cursor: pointer;

      i {
        margin-right: 5px;
      }
    }

    .screen_t_01:nth-child(1) {
      margin-right: 20px;
    }

    .screen_t_01:hover {
      opacity: 1;
    }
  }

  .select_02 {
    .el-icon-close {
      font-size: 14px;
      color: #f56c6c;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.level_01_01 {
  width: 100%;
  display: flex;
  font-size: 12px;
  margin-bottom: 10px;

  .level_01_02 {
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 4px;
    width: max-content;
    margin-right: 10px;
    background-color: #ecf5ff;

    .el-icon-error {
      color: #409eff;
      font-size: 17px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}

::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-radio-group {
  margin-top: -2px;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}

.remark_ext {
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select_body {
  .select_ele {
    width: 130px;

    ::v-deep .el-input__inner {
      border-right: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .input_ele {
    width: 202px;

    ::v-deep .el-input__inner {
      border-left: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 1px solid #DCDFE6;
    }
  }
}

.continer_main {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .group_mian_hide {
    display: none;
  }

  .group_continer {
    width: 100%;
    overflow-x: auto;
  }
}

.group_tips {
  display: flex;
  color: #f56c6c;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}

.group_head_warp {
  display: flex;
  width: 270px;
  height: 40px;
  flex-shrink: 0;
  position: relative;
  font-size: 14px;
  color: #606266;
  align-items: center;
  padding: 0 8px 0 15px;
  box-sizing: border-box;
  justify-content: space-between;
  background: #f5f7fa;

  .group_head {
    cursor: pointer;
    display: flex;
    align-items: center;

    .el-icon-d-arrow-left {
      color: #409eff;
      font-size: 18px;
      margin-right: 10px;
    }
  }

  .custom_popover {
    position: absolute;
    top: 280px;
    // position: absolute;
    // top: -80px;
  }

  .el-icon-setting {
    margin-left: 10px;
  }

  .group_icon {
    display: flex;

    i {
      cursor: pointer;
    }
  }
}

.group_warp {
  width: 270px;
  // max-height: 550px;
  overflow-y: auto;
  flex-shrink: 0;
  flex-wrap: wrap;

  .group_item {
    display: flex;
    width: 100%;
    flex-shrink: 0;
    height: 36px;
    margin-top: 8px;
    cursor: pointer;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 12px;

    .group_name {
      width: 80%;
      display: flex;
      align-items: center;

      .left_icon {
        margin-right: 6px;
      }

      .group_text {
        max-width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-icon-more,
    .el-icon-delete {
      margin-left: 10px;
      position: relative;

      .del_alert {
        //opacity: 0;
        width: 60px;
        padding: 10px;
        display: flex;
        position: absolute;
        top: 15px;
        left: -22px;
        z-index: 99999;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        // background-color: darkgreen;
        border: 1px solid #ebeef5;;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        .del_arrow {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          margin-right: 3px;
          border-bottom-width: 0;
          border-bottom-color: #ebeef5;
          border-width: 6px;
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
        }
      }
    }
  }

  .group_item:hover {
    background-color: #F5F8FA;
  }

  .group_active {
    background-color: #ebeef5;
  }

  .group_icon {
    display: flex;

    .collect_icon {
      i {
        display: inline-block;
        margin-right: 12px;
        font-size: 16px;
      }
    }

  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}

.close_inherit, .add_inherit {
  display: flex;
  width: 100%;
  justify-content: center;

  .close_desc {
    display: flex;
    height: max-content;
    color: #606266;
    line-height: 1.4;
    font-size: 14px;
    padding: 10px;
    margin: 0 10px;
    border-radius: 10px;
    flex-direction: column;
    border: 1px solid #dcdcdc;
  }

  .footer_btn {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
}

.add_inherit {
  justify-content: space-between;

  .table_group {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .table_ele {
    width: 100%;
    height: 100%;
    // display: flex;
    flex-grow: 2;
    flex-direction: column;

    .tab_check_warp {
      margin: 12px 0 20px 10px;
    }
  }
}

.seat_class {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 10px;

  .seat_item {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 5px;
    color: #409eff;
    background: #ecf5ff;
    border-radius: 4px;
    border: 1px solid #b3d8ff;
  }
}

.loading_icon {
  margin-top: 10px;
}

.queryForm {
  //&:after {
  //  content: "";
  //  display: table;
  //  clear: both;
  //}

  //::v-deep .el-form-item {
  //  float: left;
  //}

  //::v-deep .el-form-item:last-of-type {
  //  float: right;
  //  //clear: both; /* 清除左右两边的浮动 */
  //}

}
</style>
<style lang="scss">
.group_continer {
  .el-pagination {
    text-align: left !important;
  }
}

.modalContent {
  min-height: 300px;
  max-height: 70vh;
  overflow-y: auto;
}

.setNone {
  position: absolute;
  right: 0;
}

</style>
