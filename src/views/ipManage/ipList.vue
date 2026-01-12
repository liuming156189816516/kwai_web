<template>
  <div style="width:100%;height: calc(100% - 180px); float: left; position: relative;">
    <el-row :gutter="20">
      <el-col v-for="(item, idx) in ipAllList" :key="idx" :span="8">
        <el-card v-if="idx==0||idx==1">
          <el-button v-if="loadingIp" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
          <div v-else class="box_card_item" @click="syncInitApi">
            <div class="left_c">
              <div>
                {{ idx ==0?$t('sys_g131')+':'+$t('sys_c063'):$t('sys_g132')+':'+$t('sys_c063') }}
                <span>{{ item.total_count||0 }}</span>
              </div>
              <div>{{ $t('sys_c064') }}：<span>{{ item.use_num||0 }}</span></div>
              <!-- <div>冻结总数：<span>{{ item.use_num||0 }}</span></div> -->
            </div>
            <div class="right_r">
              <div>{{ $t('sys_g039') }}：<span>{{ item.no_user_num||0 }}</span></div>
            </div>
          </div>
        </el-card>
        <el-card v-else>
          <el-button v-if="loadingIp" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
          <div v-else class="box_card_item" @click="syncInitApi">
            <div class="left_c">
              <div>
                {{ $t('sys_l030') }}：{{ $t('sys_c063') }}：
                <span>{{ item.total_count||0 }}</span>
              </div>
              <!-- <div>已分配：<span>{{ item.use_num||0 }}</span></div> -->
              <!-- <div>冻结总数：<span>{{ item.use_num||0 }}</span></div> -->
            </div>
            <div class="right_r">
              <!-- <div>未分配：未分配：<span>{{ item.no_user_num||0 }}</span></div> -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item class="select_body">
        <div style="display: flex;">
          <el-select v-model="model1.selectIp" class="select_ele" :placeholder="$t('sys_c052')">
            <el-option v-for="(item, idx) in ipSelectList" :key="idx" :label="item" :value="idx" />
          </el-select>
          <el-input @input="changeInput" v-model="model1.ip" class="input_ele" :placeholder="$t('sys_c060')" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="model1.ipCtime" type="daterange" :range-separator="$t('sys_c108')" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initiplist(1)">{{ $t('sys_c002') }}</el-button>
      </el-form-item>
      <el-form-item class="el-item-right">
        <!-- <el-button type="primary">套餐IP</el-button> -->
        <!-- <el-button type="success" @click="showSetIp(0)">设置登录IP</el-button> -->
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="warning"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,idx) in betchOption" v-show="idx!=4&&idx!=5" :id="idx" :key="idx" :disabled="checkIdArry.length==0" :command="item">
              <i :class="'el-icon-'+item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="info" @click="showSetIp(0)">IP冻结规则</el-button> -->
        <el-button type="primary" style="margin-left: 10px;" @click="changeIpBtn(0,0)">{{ $t('sys_mat045') }}</el-button>
      </el-form-item>
    </el-form>
    <div style="height:100%;">
      <div class="group_main">
        <div>
          <div class="group_head_warp">
            <div class="group_name" style="cursor: pointer;" @click="changeGroup(0, 'clear')">{{ $t('sys_g049') }}（{{ ipGroupTotal }}）</div>
            <div class="group_icon">
              <el-popover v-model="addVisible" placement="top" width="230">
                <p>
                  <el-input @input="changeInput" v-model="group_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="addVisible = false">{{ $t('sys_c023') }}</el-button>
                  <el-button type="primary" size="mini" :loading="groupLoading" :disabled="!group_name.trim()" @click="addGroup(0, 0)">{{ $t('sys_c024') }}</el-button>
                </div>
                <i slot="reference" class="el-icon-plus" @click.stop="editGroup(0, 1)" />
              </el-popover>
              <i class="el-icon-setting" />
            </div>
          </div>
          <el-button v-if="loadingGroup" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
          <template v-else>
            <div class="group_warp">
              <template v-if="ipGroupList.length>0">
                <div
                  v-for="(item, idx) in ipGroupList"
                  :key="idx"
                  :class="['group_item', groupIdx === idx ? 'group_active' : '']"
                  @click="changeGroup(item, idx)"
                >
                  <div class="group_name">
                    <i class="left_icon" :class="['left_icon', groupIdx === idx ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                  <div class="group_icon">
                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input @input="changeInput" v-model="group_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{ $t('sys_c023') }}</el-button>
                        <el-button type="primary" :disabled="!group_name.trim()" size="mini" @click="addGroup(item, 2)">{{ $t('sys_c024') }}</el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click="editGroup(item, 2)" />
                    </el-popover>
                    <el-popconfirm
                      :title="$t('sys_c128')"
                      :confirm-button-text="$t('sys_c024')"
                      :cancel-button-text="$t('sys_c023')"
                      icon="el-icon-info"
                      @confirm="delGroup(item, idx)"
                    >
                      <i slot="reference" class="el-icon-delete" @click.stop />
                    </el-popconfirm>
                  </div>
                </div>
              </template>
              <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
            </div>
          </template>
        </div>
        <div class="group_continer" style="margin-left: 20px;">
          <div class="tab_check_warp">
            <i slot="reference" class="el-icon-info" />
            <div v-html="$t('sys_mat007',{value:checkIdArry.length})" />
          </div>
          <u-table
            ref="serveTable"
            v-loading="loading"
            :data="ipDataList"
            row-key="id"
            use-virtual
            border
            :height="cliHeight"
            element-loading-spinner="el-icon-loading"
            style="width: 100%;"
            show-body-overflow="title"
            @sort-change="sorthandle"
            @selection-change="handleSelectionChange"
            @row-click="rowSelectChange"
          >
            <u-table-column type="selection" width="55" />
            <u-table-column prop="proxy_ip" :label="$t('sys_c060')" min-width="160" />
            <u-table-column prop="proxy_user" :label="$t('sys_c003')" min-width="100" />
            <u-table-column prop="status" :label="$t('sys_c062')" min-width="100">
              <template slot="header">
                <el-dropdown trigger="click" size="medium" @command="(command) => handleNewwork(command,1)">
                  <span style="color:#909399" :class="[model1.status?'dropdown_title':'']"> {{ $t('sys_c062') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,idx) in networkOption" :key="idx" :class="{'dropdown_selected':idx==model1.status}" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag size="small" :type="handleTag(scope.row.status)"> {{ networkOption[scope.row.status] }}</el-tag>
              </template>
            </u-table-column>
            <u-table-column prop="allot_num" sortable :label="$t('sys_c064')+'/'+$t('sys_c063')" min-width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.user_num>0" style="color:#409eff;cursor: pointer;" @click.stop="showIpDetail(scope.row)">{{ scope.row.user_num }}</span>
                <span v-else>{{ scope.row.user_num }}</span>
                <span>/{{ scope.row.allot_num }}</span>
              </template>
            </u-table-column>
            <u-table-column prop="ip_category" :label="$t('sys_c066')" min-width="100">
              <template slot="header">
                <el-dropdown trigger="click" size="medium" @command="(command) => handleNewwork(command,2)">
                  <span style="color:#909399" :class="[model1.ip_category?'dropdown_title':'']"> {{ $t('sys_c066') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,idx) in ipClassOptions" v-show="item!=$t('sys_l035') " :key="idx" :class="{'dropdown_selected':idx==model1.ip_category}" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.ip_category==1?'success':''"> {{ ipClassOptions[scope.row.ip_category] }}</el-tag>
              </template>
            </u-table-column>
            <u-table-column prop="ip_type" :label="$t('sys_c065')" min-width="80">
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.ip_type==$t('sys_l028')?'success':''"> {{ ipTypeOptions[scope.row.ip_type] }}</el-tag>
              </template>
            </u-table-column>
            <u-table-column prop="expire_status" :label="$t('sys_c066')" min-width="100">
              <template slot="header">
                <el-dropdown trigger="click" size="medium" @command="(command) => handleNewwork(command,3)">
                  <span style="color:#909399" :class="[model1.expire_status?'dropdown_title':'']"> {{ $t('sys_c067') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,idx) in exprireOptions" :key="idx" :class="{'dropdown_selected':idx==model1.expire_status}" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.expire_status==1?'success':scope.row.expire_status==3?'warning':'danger'"> {{ exprireOptions[scope.row.expire_status] }}</el-tag>
              </template>
            </u-table-column>
            <u-table-column prop="country" :label="$t('sys_c068')" min-width="100" />
            <u-table-column prop="disable_status" :label="$t('sys_c069')" min-width="100">
              <template slot="header">
                <el-dropdown trigger="click" size="medium" @command="(command) => handleNewwork(command,4)">
                  <span style="color:#909399" :class="[model1.disable_status?'dropdown_title':'']"> {{ $t('sys_c069') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,idx) in stopOptions" :key="idx" :class="{'dropdown_selected':idx==model1.disable_status}" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.disable_status==1?'success':'danger'"> {{ stopOptions[scope.row.disable_status] }}</el-tag>
              </template>
            </u-table-column>
            <u-table-column prop="expire_time" :label="$t('sys_c070')" min-width="160">
              <template slot-scope="scope">
                {{ scope.row.expire_time>0?$baseFun.resetTime(scope.row.expire_time*1000):0 }}
              </template>
            </u-table-column>
            <u-table-column prop="remark" show-overflow-tooltip :label="$t('sys_c072')" width="100">
              <template slot-scope="scope">
                <div class="remark_ext">{{ scope.row.remark }}</div>
                <div @click.stop="addRemark(scope.row,11)"><i class="el-icon-edit" style="color: rgb(103, 194, 58); cursor: pointer;" /></div>
              </template>
            </u-table-column>
            <u-table-column prop="reason" show-overflow-tooltip :label="$t('sys_c071')" min-width="100" />
          </u-table>

          <div class="layui_page">
            <el-pagination
              :current-page.sync="model1.page"
              :page-size="model1.limit"
              :page-sizes="pageOption"
              :total="model1.total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="changePageSize($event,'table')"
              @current-change="changePageCurrent($event,'table')"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 新增-->
    <el-dialog :title="ipModdelTitle" center :visible.sync="ipModel" :close-on-click-modal="false" :width="ipModelWidth">
      <el-form ref="ipForm" size="small" :model="ipForm" label-width="100px" :rules="ipRules">
        <el-form-item v-if="ipModelType==0" :label="$t('sys_c052') + ':'" prop="iptype">
          <el-cascader ref="myCascader" v-model="ipForm.iptype" el-cascader :options="ipOptions" />
        </el-form-item>
        <template v-if="ipModelType==1 || ipModelType==2 || ipModelType==3">
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="0">
                <el-steps :active="stepsActive">
                  <el-step title="上传文件" description="请上传指定格式文件" />
                  <el-step title="校验数据" description="检查数据格式是否正确" />
                  <el-step title="导入数据" description="正在执行导入文件" />
                </el-steps>
              </el-form-item>
            </el-col>
            <el-col v-if="ipModelType==2" :span="24">
              <el-form-item label-width="0" style="margin-bottom: 14px;">
                <div style="display:flex;flex-direction:column; align-items:center;line-height:30px; width:100%;">
                  <img style="width: 140px;height: 140px;margin-bottom: 10px;" src="../../assets/upload_03.png" alt="" srcset="">
                  <!-- <img style="width: 280px;height: 188px;" src="../../assets/upload_03.png" alt="" srcset=""> -->
                  <template v-if="fail_number>0||success_number>0">
                    <div>数据校验完成</div>
                    <div>校验正常数据{{ success_number }}条，异常数据{{ fail_number }}条</div>
                    <span style="display: flex;cursor: pointer; font-size: 12px; align-items: center;color: #209cdf; margin-left: 20px;" @click="exportErrIp">
                      <i class="el-icon-download" /> 导出格式异常IP
                    </span>
                  </template>
                  <template v-else>
                    <div style="display: flex;align-items: center;">
                      检测中... <img style="height: 20px;margin-left: 10px;" src="../../assets/loading_icon.gif" alt="" srcset="">
                    </div>
                  </template>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="0">
                <template v-if="uploadloading">
                  <el-progress :text-inside="true" :stroke-width="14" :percentage="percentage" />
                  <div style="display:flex;flex-direction:column; align-items:center;line-height:30px; width:100%;margin-top: 10px;">
                    <img style="width: 140px;height: 140px;margin: 10px 0;" src="../../assets/upload_ing.png" alt="" srcset="">
                  </div>
                </template>
                <div v-if="ipModelType==3" style="display:flex;flex-direction:column; align-items:center;line-height:30px; width:100%;">
                  <img style="width: 280px;height: 188px;margin-bottom: 10px;" src="../../assets/success.png" alt="" srcset="">
                  <div style="font-weight: 600;">数据导入成功</div>
                  <div>成功导入ip数量{{ success_number }}条，失败数据{{ fail_number }}条,点击完成或继续上传</div>
                </div>
              </el-form-item>
            </el-col>
            <template v-if="ipModelType==1">
              <el-col :span="10" style="margin-bottom: 14px;">
                <el-form-item :label="$t('sys_c053')+':'" prop="group_id">
                  <el-select v-model="ipForm.group_id" clearable filterable :placeholder="$t('sys_c053')" style="width:100%;">
                    <el-option v-for="item in ipGroupList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-bottom: 14px;">
                <el-form-item label-width="0" style="margin-left: 22px;">
                  <el-popover v-model="visible" placement="top" width="260">
                    <p>
                      <el-input @input="changeInput" v-model="group_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                    </p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="visible = false">{{ $t('sys_c023') }}</el-button>
                      <el-button type="primary" size="mini" :disabled="!group_name.trim()" @click="addGroup(group_name)">{{ $t('sys_c024') }}</el-button>
                    </div>
                    <el-button slot="reference" type="primary" @click.stop="editGroup(0, 1)">新建分组</el-button>
                  </el-popover>
                </el-form-item>
              </el-col>

              <el-col :span="10" style="margin-bottom: 14px;">
                <el-form-item v-if="ipForm.iptype[1]!=2" :label="$t('sys_c054')+':'" prop="country">
                  <el-select v-model="ipForm.country" clearable filterable :disabled="ipForm.iptype[1]==2" :placeholder="$t('sys_c054')" style="width:100%;">
                    <el-option v-for="(item,idx) in countryList" :key="idx" :label="item" :value="item" />
                  </el-select>
                </el-form-item>

                <el-form-item v-else>
                  <el-select v-model="ipForm.country" :placeholder="$t('sys_c054')" style="width:100%;opacity: 0;">
                    <el-option v-for="(item,idx) in countryList" :key="idx" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12" style="margin-bottom: 14px;">
                <el-form-item :label="$t('sys_c055')+':'" prop="ip_time">
                  <el-date-picker v-model="ipForm.ip_time" :picker-options="pickerOptions" type="datetime" placeholder="选择日期时间" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="margin-bottom: 14px;">
                <el-form-item :label="$t('sys_c066')+':'">WS-{{ ipClassOptions[ipForm.iptype[1]] }}</el-form-item>
              </el-col>
              <el-col :span="24" style="margin-bottom: 14px;">
                <el-form-item :label="$t('sys_c056')+':'">
                  <div style="display: flex;font-size: 12px;line-height: 16px;">
                    <span style="display: flex;align-items: center;">单个ip最多登录</span>
                    <span style="margin: 0 5px;">
                      <el-input @input="changeInput"-number v-model="ipForm.ipLoginNum" :disabled="ipForm.iptype[1]==2" type="number" :min="1" label="描述文字" style="width: 120px;" />
                    </span>
                    <span style="display: flex;align-items: center;">个账号,如果ip为动态时,分配次数是根据账号而定,例如10个账号登录那么就分配10次</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24" :label="$t('sys_c057')+':'">
                <el-form-item :label="$t('sys_c058')+':'">
                  <div class="submit_btn">
                    <el-button v-if="ipForm.iptype[1]==1?!ipForm.ip_time||!ipForm.country:!ipForm.group_id||!ipForm.ip_time" class="custom_file1" @click="submitIpBtn('ipForm')">{{ $t('sys_c059') }}</el-button>
                    <el-button v-else class="custom_file1">{{ $t('sys_c059') }}
                      <input id="uploadFile" ref="uploadclear" type="file" title=" " @change="checkIpIsUse">
                    </el-button>
                    <span class="export_tips" @click="downLoadTemp"><i class="el-icon-download" />下载模板</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width="0">点击上方文字按钮，下载模板，并按照规定格式填写数据，且文件大小不得超过5MB</el-form-item>
              </el-col>
            </template>
          </el-row>
        </template>
        <el-form-item v-if="ipModelType==0||ipModelType==2||ipModelType==3" label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button v-if="ipModelType==1||ipModelType==2&&!ipModelType==3" @click="ipModel=false">{{ ipModelType==1?$t('sys_c023'):"取消导入" }}</el-button>
          <el-button v-if="ipModelType==3" @click="restUpload">继续上传</el-button>
          <el-button v-if="ipModelType==0" type="primary" @click="submitIpBtn('ipForm')">{{ $t('sys_c024') }}</el-button>
          <el-button v-if="ipModelType==2&&success_number>0&&!uploadloading" type="primary" @click="exportIpBtn('ipForm')">执行导入数据</el-button>
          <el-button v-if="ipModelType==3" type="primary" @click="ipModel=false">完成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 设置IP -->
    <el-dialog :title="setIpName" center :visible.sync="setIpModel" :close-on-click-modal="false" width="450px">
      <el-form ref="ipForm" size="small" :model="ipForm" label-width="100px" :rules="ipRules">
        <el-form-item v-if="setIpType==0" :label="$t('sys_c055') + ':'" prop="expire_time">
          <el-date-picker v-model="ipForm.expire_time" type="datetime" :placeholder=" $t('sys_c052')" />
        </el-form-item>
        <template v-if="setIpType==1">
          <el-form-item :label="$t('sys_l051') + ':'" prop="allot_num" label-width="140px">
            <div style="display: flex;font-size: 12px; line-height: 20px;align-items: center;">
              <span>单个ip最多登录</span>
              <el-input @input="changeInput" v-model="ipForm.allot_num" size="small" style="width: 120px;margin: 0 4px;" show-word-limit placeholder="请输入" />
              <span>个账号</span>
            </div>
          </el-form-item>
          <el-form-item label-width="0">
            <div style="display: flex;font-size: 12px;align-items: center;justify-content: center;">如果IP已分配给X个账号正在使用，修改数值要≥X，否则无法生效！</div>
          </el-form-item>
        </template>
        <template v-if="setIpType==2">
          <el-form-item :label="$t('sys_mat012') + ':'" prop="group_id">
            <el-select v-model="ipForm.group_id" :placeholder=" $t('sys_c052')">
              <el-option v-for="item in ipGroupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div style="display: flex;font-size: 12px;align-items: center;justify-content: center; color:#f56c6c;">一个账号只能存在于一个分组中！</div>
          </el-form-item>
        </template>

        <el-form-item v-if="setIpType==10" :label="$t('sys_c054') + ':'" prop="country">
          <el-select v-model="ipForm.country" :placeholder=" $t('sys_c052')">
            <el-option v-for="(item,idx) in countryList" :key="idx" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <template v-if="setIpType==11">
          <el-form-item prop="remock_text" label-width="0">
            <el-input @input="changeInput" v-model="ipForm.remock_text" type="textarea" :placeholder="$t('sys_mat021')" size="small" :rows="6" maxlength="50" show-word-limit />
          </el-form-item>
        </template>

        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="setIpModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button :loading="isLoading" type="primary" @click="submitSetBtn('ipForm')">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 设置IP -->
    <el-dialog title="IP分配详情" center :visible.sync="alloctModel" :close-on-click-modal="false" width="750px">
      <el-form ref="ipForm" size="small" :inline="true">
        <el-form-item>
          <el-date-picker v-model="model2.ipTime" type="datetimerange" range-separator="-" start-placeholder="分配日期查询" end-placeholder="到分配日期查询" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getIpDetailList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
        </el-form-item>
      </el-form>
      <u-table v-loading="detailLoading" :data="ipDetailList" border height="560" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" @sort-change="sorthandle">
        <u-table-column prop="proxy_ip" :label="$t('sys_g005')" min-width="140" />
        <u-table-column prop="account" :label="$t('sys_g064')" min-width="100" />
        <u-table-column prop="ip_time" :label="$t('sys_g065')" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.ip_time>0?$baseFun.resetTime(scope.row.ip_time*1000):"-" }}
          </template>
        </u-table-column>
      </u-table>
      <div class="layui_page">
        <el-pagination
          background
          :page-sizes="pageOption"
          :page-size="this.model2.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.model2.total"
          @size-change="setDetailSize"
          @current-change="setDetailPage"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import { successTips,resetPage } from '@/utils/index'
import { getiplist,getgrouplist, doipgroup,checkfile,getcountrylist,addip,getipv4allot,getipv6allot,getipdynamicallot,doexpiretime,doallotnum,domoveipgroup,docheckstatus,dostartdistribution,dodisableallocation,dobatchdel,doupcountry,dooutputip,doipremark,getuselist } from '@/api/ipmanage'
export default {
  data() {
    return {
      model1: {
        ip: '',
        page: 1,
        limit: 10,
        total: 0,
        ipCtime: '',
        selectIp: 0,
        status: '',
        sort: '',
        ip_category: '',
        expire_status: '',
        disable_status: '',
      },
      ipModdelTitle: '',
      percentage: 0,
      stepsActive: 1,
      ipModelType: '',
      ipModelWidth: '',
      ipGroupTotal: 0,
      ipDataList: [],
      ipGroupList: [],
      loading: false,
      loadingIp: false,
      setIpModel: false,
      alloctModel: false,
      detailLoading: false,
      setIpName: '',
      ipAllList: [{},{},{}],
      checkIdArry: [],
      ipSelectList: [this.$t('sys_q103')],
      groupLoading: false,
      loadingGroup: false,
      ipConfigModel: false,
      uploadloading: false,
      ipModel: false,
      fail_number: 0,
      setIpType: '',
      success_number: 0,
      ipForm: {
        id: '',
        iptype: '',
        country: '',
        group_id: '',
        ip_time: '',
        ipLoginNum: 1,
        ip_file: '',
        expire_time: '',
        allot_num: '',
        pgroup_id: '',
        remock_text: '',
      },
      countryList: [],
      randomNum: [1,2,4,8,3,8,4,6,3,8],
      pageOption: resetPage(),
      ipOptions: [{
        value: 0,
        label: 'WS',
        children: [
          {
            value: 1,
            label: this.$t('sys_l031'),
            children: [{
              value: 4,
              label: 'Ipv4'
            }, {
              value: 5,
              label: 'Ipv6'
            }]
          },
          {
            value: 2,
            label: this.$t('sys_l030'),
            children: [{
              value: 6,
              label: this.$t('sys_l052')
            }]
          }
          // ,
          // {
          //   value: 3,
          //   label: 'Rola ip'
          // }
        ]
      }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      offest: 1,
      limit: 200,
      total: 0,
      groupIdx: '',
      materType: '',
      checkedNum: 0,
      isLoading: false,
      visible: false,
      addVisible: false,
      groupModel: false,
      cardAcyive: '1',
      type: '',
      group_id: '',
      group_name: '',
      groupList: [],
      batchArry: [],
      groupForm: {
        id: '',
        group_id: '',
        title: '',
        content: '',
      },
      moveForm: {
        checked_group: ''
      },
      isPlay: false, // 是否正在播放
      isauto: false, // 是否自动播放
      audio: null,
      contorl: null,
      progrTimer: null,
      model2: {
        offest: 1,
        limit: 10,
        total: 0,
        ip_id: '',
        ipTime: '',
        proxy_ip: ''
      },
      ipDetailList: [],
      cliHeight:0
    }
  },
  computed: {
    ipRules() {
      return {
        iptype: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        group_id: [{ required: true, message: this.$t('sys_c053'), trigger: 'change' }],
        country: [{ required: true, message: this.$t('sys_c054'), trigger: 'change' }],
        ip_time: [{ required: true, message: this.$t('sys_c055'), trigger: 'change' }],
        ip_file: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        expire_time: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        allot_num: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }],
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        remock_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }],
      }
    },
    ipNumOption() {
      return ['','','','',this.$t('sys_l028'),this.$t('sys_l029'),this.$t('sys_l052')]
    },
    networkOption() {
      return ['',this.$t('sys_l023'),this.$t('sys_l024'),this.$t('sys_l025'),this.$t('sys_l026'),this.$t('sys_l027')]
    },
    ipTypeOptions() {
      return ['',this.$t('sys_l028'),this.$t('sys_l029'),this.$t('sys_l030')]
    },
    ipClassOptions() {
      return ['',this.$t('sys_l031'),this.$t('sys_l030'),this.$t('sys_l035')]
    },
    exprireOptions() {
      return ['',this.$t('sys_l023'),this.$t('sys_l033'),this.$t('sys_l034')]
    },
    stopOptions() {
      return ['',this.$t('sys_c025'),this.$t('sys_c026')]
    },
    ipSetptions() {
      return ['',this.$t('sys_l032'),this.$t('sys_l036')]
    },
    betchOption() {
      return [
        {
          icon: 'date',
          label: this.$t('sys_l040')
        },
        {
          icon: 'setting',
          label: this.$t('sys_l041')
        },
        {
          icon: 'rank',
          label: this.$t('sys_l042')
        },
        {
          icon: 'connection',
          label: this.$t('sys_l043')
        },
        {
          icon: 'connection',
          label: this.$t('sys_l044')
        },
        {
          icon: 's-promotion',
          label: this.$t('sys_l045')
        },
        {
          icon: 'check',
          label: this.$t('sys_l046')
        },
        {
          icon: 'close',
          label: this.$t('sys_l047')
        },
        {
          icon: 'delete',
          label: this.$t('sys_l048')
        },
        {
          icon: 'download',
          label: this.$t('sys_l049')
        },
        {
          icon: 'edit-outline',
          label: this.$t('sys_l050')
        }
      ]
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
    }
  },
  watch: {
    ipModel(val) {
      if (val == false) {
        this.ipForm.iptype = '';
        this.ipForm.group_id = '';
        this.ipForm.ipLoginNum = '';
        this.ipForm.country = '';
        this.ipForm.ip_time = '';
        const _cascader = this.$refs.myCascader;
        console.log(_cascader);
        if (_cascader) {
          _cascader.$refs.panel.activePath = [];
          _cascader.$refs.panel.checkedValue = [];
          _cascader.$refs.panel.syncActivePath();
        }
        this.$refs.ipForm.resetFields();
      }
    }
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  created() {
    this.syncInitApi();
    this.initipGroup();
    this.initiplist();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => { return item.id })
    },
    rowSelectChange(row, column, event) {
      const tableCell = this.$refs.serveTable;
      if (this.checkIdArry.includes(row.id)) {
        tableCell.toggleRowSelection([{ row: row,selected: false }]);
        return;
      }
      tableCell.toggleRowSelection([{ row: row,selected: true }]);
    },
    handleNewwork(row,idx) {
      if (idx == 1) {
        this.model1.status = row;
      } else if (idx == 2) {
        this.model1.ip_category = row;
      } else if (idx == 3) {
        this.model1.expire_status = row;
      } else if (idx == 4) {
        this.model1.disable_status = row;
      }
      this.initiplist();
    },
    addRemark(row,idx) {
      this.setIpType = idx;
      this.ipForm.id = row.id;
      this.setIpModel = true;
      this.ipForm.remock_text = row.remark || '';
      this.setIpName = this.$t('sys_c033');
    },
    sorthandle({ column, prop, order }) {
      if (order) {
        this.model1.sort = order == 'ascending' ? 'user_num' : '-user_num';
      } else {
        this.model1.sort = '';
      }

      this.initiplist();
    },
    handleTag(type) {
      let color;
      switch (type) {
        case 1:
          color = 'success';
          break;
        case 2:
          color = 'danger';
          break;
        case 3:
          color = 'info';
          break;
        case 4:
          color = 'success';
          break;
        case 5:
          color = 'danger';
          break;
        default:
          break;
      }
      return color;
    },
    initiplist(num) {
      this.loading = true;
      const sTime = this.model1.ipCtime;
      this.model1.page = num || this.model1.page;
      const params = {
        page: this.model1.page,
        limit: this.model1.limit,
        proxy_ip: this.model1.ip,
        status: this.model1.status || -1,
        sort: this.model1.sort,
        ip_category: this.model1.ip_category || -1,
        expire_status: this.model1.expire_status || -1,
        disable_status: this.model1.disable_status || -1,
        group_id: this.model1.pgroup_id,
        start_time: sTime ? this.$baseFun.resetTime(sTime[0], 1) : -1,
        end_time: sTime ? this.$baseFun.resetTime(sTime[1], 1) : -1
      }
      getiplist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.ipDataList = res.data.list || [];
        this.$nextTick(() => {
          const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
          tableBodyWrapper.scrollTop = 0
        })
      })
    },
    restQueryBtn() {
      this.model2.ipTime = [];
      this.getIpDetailList(1);
    },
    showIpDetail(row) {
      console.log(row);
      this.model2.ip_id = row.id;
      this.model2.proxy_ip = row.proxy_ip;
      this.alloctModel = true;
      this.getIpDetailList();
    },
    getIpDetailList(num) {
      const sTime = this.model2.ipTime;
      this.model2.page = num || this.model2.page;
      const params = {
        id: this.model2.ip_id,
        page: this.model2.offest,
        limit: this.model2.limit,
        proxy_ip: this.model2.proxy_ip,
        start_time: sTime ? this.$baseFun.resetTime(sTime[0], 3) : -1,
        end_time: sTime ? this.$baseFun.resetTime(sTime[1], 3) : -1
      }
      this.detailLoading = true;
      getuselist(params).then(res => {
        this.detailLoading = false;
        this.model2.total = res.data.total;
        this.ipDetailList = res.data.list || [];
      })
    },
    setDetailPage(val) {
      this.model2.offest = val;
      this.getIpDetailList();
    },
    setDetailSize(val) {
      this.model2.limit = val;
      this.getIpDetailList();
    },
    async initipGroup() {
      this.loadingGroup = true;
      const { data } = await getgrouplist({ page: 1, limit: 100 });
      this.loadingGroup = false;
      this.ipGroupTotal = data.total;
      this.ipGroupList = data.list || [];
    },
    syncInitApi() {
      this.loadingIp = true;
      const getipv4 = new Promise((resolve,reject) => {
        getipv4allot().then(res => {
          resolve(res.data)
        })
      });
      const getipv6 = new Promise((resolve,reject) => {
        getipv6allot().then(res => {
          resolve(res.data)
        })
      });
      const gettrendsip = new Promise((resolve,reject) => {
        getipdynamicallot().then(res => {
          resolve(res.data)
        })
      });
      Promise.all([getipv4,getipv6,gettrendsip]).then(res => {
        this.ipAllList = res || [];
        this.loadingIp = false;
      })
    },
    async initCountry() {
      const { data } = await getcountrylist({});
      this.countryList = data.country_list || [];
    },
    editGroup(row, idx) {
      this.type = idx;
      this.group_name = '';
      if (idx == 1) return;
      this.groupForm.id = row.id;
      this.group_name = row.name;
    },
    async addGroup(title) {
      const params = {
        ptype: this.type,
        name: this.group_name,
        type: Number(this.cardAcyive),
      }
      this.groupLoading = true;
      this.type == 2 ? params.id = this.groupForm.id : '';
      const newBank = await doipgroup(params);
      this.groupLoading = false;
      if (newBank.code !== 0) return;
      this.visible = false;
      this.addVisible = false;
      this.initipGroup();
      successTips(this)
      if (title) {
        setTimeout(() => {
          this.ipForm.group_id = this.ipGroupList.filter(item => item.name == this.group_name)[0].id;
        },600)
      }
    },
    async delGroup(row) {
      const res = await doipgroup({ ptype: 3, del_id: [row.id] });
      if (res.code !== 0) return;
      this.groupIdx = 0;
      this.groupForm.group_id = '';
      successTips(this)
      for (let k = 0; k < this.ipGroupList.length; k++) {
        if (this.ipGroupList[k].id == row.id) {
          this.ipGroupList.splice(k, 1)
        }
      }
    },
    changeIpBtn(row,idx) {
      this.ipModel = true;
      this.ipModelType = idx;
      this.ipModdelTitle = this.$t('sys_g133');
      this.ipModelWidth = '380px';
      this.$nextTick(() => {
        const _cascader = this.$refs.myCascader;
        _cascader.$refs.panel.activePath = [];
        _cascader.$refs.panel.checkedValue = [];
        _cascader.$refs.panel.syncActivePath();
        this.$refs.ipForm.resetFields();
      })
    },
    async checkIpIsUse(e) {
      this.errIpUrl = '';
      this.fail_number = 0;
      this.success_list = [];
      this.success_number = 0;
      const files = this.$refs.uploadclear.files[0];
      const formData = new FormData();
      formData.append('file', files);
      formData.append('ptype', this.ipForm.iptype[1]);
      this.stepsActive = 2,
      this.ipModelType = 2;
      this.$refs.uploadclear.value = null;
      checkfile(formData).then(res => {
        if (res.code != 0) return;
        // this.ipModelType=2;
        this.errIpUrl = res.data.url;
        this.fail_number = res.data.fail_number;
        this.success_list = res.data.success_list;
        this.success_number = res.data.success_number;
      })
    },
    exportErrIp() {
      window.location.href = this.errIpUrl;
    },
    async exportIpBtn() {
      this.uploadloading = true;
      const params = {
          country: this.ipForm.country,
          group_id: this.ipForm.group_id,
          allot_num: this.ipForm.ipLoginNum,
          ip_type: this.ipForm.iptype[2] == 4 ? 1 : 2,
          ip_category: this.ipForm.iptype[1],
          success_list: this.success_list,
          expire_time: Date.parse(this.$baseFun.resetTime(this.ipForm.ip_time)) / 1000
        }
        this.startPercent();
        const result = await addip(params);
        if (result.code != 0) return;
        this.initipGroup();
        this.initiplist();
        this.uploadloading = false;
        this.ipModelType = 3;
        this.stepsActive = 3,
        this.percentage = 0;
        this.fail_number = result.data.fail_number;
        this.success_number = result.data.success_number;
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
        },500)
    },
    restUpload() {
      this.stepsActive = 1,
      this.ipModelType = 1;
    },
    submitIpBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ipModelType == 0) {
            this.initCountry();
            this.stepsActive = 1,
            this.ipModelType = 1;
            if (this.ipForm.iptype[1] == 1) {
              this.ipModdelTitle = 'WS-' + this.ipClassOptions[this.ipForm.iptype[1]] + '-' + this.ipNumOption[this.ipForm.iptype[2]] + '格式入库';
            } else if (this.ipForm.iptype[1] == 2) {
              this.ipModdelTitle = 'WS-' + this.ipClassOptions[this.ipForm.iptype[1]] + '格式入库';
            } else if (this.ipForm.iptype[1] == 3) {
              this.ipModdelTitle = 'WS-' + this.ipClassOptions[this.ipForm.iptype[1]] + '格式入库';
            }
            this.ipModelWidth = '680px';
            this.startPercent();
          }
        }
      })
    },
    changeGroup(row, idx) {
      this.batchArry = [];
      this.checkedNum = 0;
      this.groupIdx = idx;
      this.model1.pgroup_id = idx == 'clear' ? '' : row.id;
      this.initiplist(1);
    },
    addContent(row, idx) {
      this.materType = idx;
      this.groupForm.id = row.id;
      this.groupModel = true;
      this.$nextTick(() => {
        this.$refs.groupForm.resetFields();
        if (idx == 1) return;
        this.groupForm.title = row.name;
        this.groupForm.content = row.content;
      })
    },
    copayUrl(row) {
      const clipboard = new Clipboard('#imgUrl'); // .copy-btn为按钮元素的class名称或选择器
      clipboard.on('success', (e) => {
        successTips(this, '',this.$t('sys_rai121'))
      });
    },

    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.model1.limit = val;
        this.initiplist();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.model1.page = val;
        this.initiplist();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 380;
    },
    handleCommand(command) {
      if (this.checkIdArry.length == 0) {
        return successTips(this,'error',this.$t('sys_c126'));
      }
      for (let k = 0; k < this.betchOption.length; k++) {
        if (this.betchOption[k].label == command.label) {
          this.setIpType = k;
          this.setIpName = this.betchOption[k].label;
        }
      }
      if (this.setIpType == 0 || this.setIpType == 1 || this.setIpType == 2 || this.setIpType == 10) {
        this.setIpModel = true;
        if (this.setIpType == 10) {
          this.initCountry()
        }
        this.$nextTick(() => {
          this.$refs.ipForm.resetFields();
        })
      } else {
        const that = this;
        that.$confirm(`确认${that.setIpName}吗？`, that.$t('sys_l013'), {
          type: 'warning',
          confirmButtonText: that.$t('sys_c024'),
          cancelButtonText: that.$t('sys_c023'),
          beforeClose: function(action, instance, done) {
            if (action === 'confirm') {
              const allPost = [doexpiretime,doallotnum,domoveipgroup,docheckstatus,'','',dostartdistribution,dodisableallocation,dobatchdel,dooutputip,doupcountry]
              instance.confirmButtonLoading = true;
              allPost[that.setIpType]({ ids: that.checkIdArry }).then(res => {
                instance.confirmButtonLoading = false;
                if (res.code != 0) return;
                that.initiplist();
                if (that.setIpType == 8) {
                  that.initipGroup();
                }
                if (that.setIpType == 9) {
                  window.location.href = res.data.url
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
      }
    },
    submitSetBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const allPost = [doexpiretime,doallotnum,domoveipgroup,docheckstatus,'','',dostartdistribution,dodisableallocation,dobatchdel,dooutputip,doupcountry,doipremark]
          const params = {}
          this.setIpType == 11 ? params.id = this.ipForm.id : params.ids = this.checkIdArry;
          if (this.setIpType == 0) {
            params.expire_time = Date.parse(this.$baseFun.resetTime(this.ipForm.expire_time)) / 1000;
          } else if (this.setIpType == 1) {
            params.allot_num = Number(this.ipForm.allot_num)
          } else if (this.setIpType == 2) {
            params.group_id = this.ipForm.group_id
          } else if (this.setIpType == 10) {
            params.country = this.ipForm.country
          } else if (this.setIpType == 11) {
            params.remark = this.ipForm.remock_text
          }
          this.isLoading = true;
          allPost[this.setIpType](params).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            this.setIpModel = false;
            if (this.setIpType == 2) {
              this.initipGroup();
            }
            this.initiplist();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    downLoadTemp() {
      const ipDescList = [
        '',
        '静态ip入库格式：ip地址,端口,代理账号,代理密码,代理类型（此行需要删除）',
        '动态ip入库格式：ip地址,端口,代理账号,代理密码,代理类型,国家（此行需要删除）',
        'ROLAip入库格式：ip地址,端口,代理账号,代理密码,代理类型,国家（此行需要删除）'
      ]
      var textContent = ipDescList[this.ipForm.iptype[1]];
      var blob = new Blob([textContent], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = this.ipForm.iptype[1] == 1 ? 'example-import-static-ip.txt' : 'example-import-dynamic-ip.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-card__body {
  width: 100%;
  height: 108px;
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  &>div {
    flex: 1;
  }
  .box_card_item{
    display: flex;
    cursor: pointer;
    justify-content: space-between;
  }

  .left_c,
  .right_r {
    &>div {
      font-size: 14px;
      padding: 8px 0;
    }

    span {
      color: #409eff;
    }
  }

  .left_c {
    div:nth-child(1) {
      font-size: 17px;
    }
  }
}
.dropdown_selected{
  color: #fff;
  background-color: #209cdf;
}
.dropdown_title{
  color: #409eff !important;
}
.remark_ext{
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select_body {
  .select_ele {
    width: 120px;

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
.group_main {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .group_head_warp {
    display: flex;
    width: 220px;
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
    width: 220px;
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
      .group_name{
        width: 80%;
        display: flex;
        align-items: center;
        .left_icon {
          margin-right: 6px;
        }
        .group_text{
          max-width:90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .el-icon-more, .el-icon-delete {
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
          border: 1px solid #ebeef5;
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
  }

  .group_continer {
    width: 100%;
    height: 100%;
  }
}
.custom_file1{
  margin-top: 0;
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}</style>
