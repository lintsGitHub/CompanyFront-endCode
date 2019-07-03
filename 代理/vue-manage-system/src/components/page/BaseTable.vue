<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 会员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" @change="rowsChange" placeholder="显示条数" class="handle-select mr10">
                    <el-option key="1" label="10" value="10"></el-option>
                    <el-option key="2" label="20" value="20"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" @click="addUser">添加会员</el-button>
				
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="vip_mp" label="手机号" sortable width="150">
                </el-table-column>
                <el-table-column prop="vip_AN" label="会员名" width="120">
                </el-table-column>
				<el-table-column prop="vip_email" label="邮箱" width="200">
				</el-table-column>
				<el-table-column prop="status_id" label="状态" width="120">
				</el-table-column>
                  <el-table-column prop="vip_CDT" label="日期" sortable width="200">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
			
			</el-form-item>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>
		
		<!-- 添加弹出框 -->
		<el-dialog title="添加" :visible.sync="addVisible" width="30%">
		    <el-form ref="adduser" :model="adduser" label-width="70px">
		       
		        <el-form-item label="手机号">
		            <el-input v-model="adduser.vip_mp"></el-input>
		        </el-form-item>
		        <el-form-item label="会员名">
		            <el-input v-model="adduser.vip_AN"></el-input>
		        </el-form-item>
				<el-form-item label="邮箱">
				    <el-input v-model="adduser.vip_Email"></el-input>
				</el-form-item>
				<el-form-item label="密码">
				    <el-input type="password" v-model="adduser.vip_pwd"></el-input>
				</el-form-item>
				<el-form-item label="状态">
				    <!-- <el-input v-model="form.Status"></el-input> -->
					<el-select v-model="adduser.status_id">
						<el-option value="启用" >启用</el-option>
						<el-option value="禁用">禁用</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="日期">
				     <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
				 </el-form-item> -->
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="addVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveAdd">确 定</el-button>
		    </span>
		</el-dialog>
		

        <!--  编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
               <!-- <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item> -->
                <el-form-item label="手机号">
                    <el-input v-model="form.vip_mp"></el-input>
                </el-form-item>
                <el-form-item label="会员名">
                    <el-input v-model="form.vip_AN"></el-input>
                </el-form-item>
				<el-form-item label="邮箱">
				    <el-input v-model="form.vip_email"></el-input>
				</el-form-item>
				<el-form-item label="状态">
				    <!-- <el-input v-model="form.Status"></el-input> -->
					<el-select v-model="form.status_id">
						<el-option value="启用">启用</el-option>
						<el-option value="禁用">禁用</el-option>
					</el-select>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: 'http://localhost:58561/VIP/GetAllVIP',
				// 总数据
                tableData: [],
				// 分页
                cur_page: 1,
                multipleSelection: [],
                select_cate: 10,
                select_word: '',
                del_list: [],
                is_search: false,
				// 编辑弹框
                editVisible: false,
				// 删除弹框
                delVisible: false,
				// 添加弹框
				addVisible : false,
				// 编辑数据
                form: {
                    vip_mp: '',
                    vip_AN: '',
                    vip_email: '',
					status_id: ''
                },
				// 添加数据
				adduser:{
					vip_mp: '',
					vip_AN: '',
					vip_Email: '',
					vip_pwd : '',
					status_id: '启用'
				},
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.vip_AN === this.del_list[i].vip_AN) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.vip_mp.indexOf(this.select_word) > -1 &&
                            (d.vip_AN.indexOf(this.select_word) > -1 ||
                                d.vip_email.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
			// 显示条数
			rowsChange(val){
				this.select_cate = val;
				this.getData();
			},
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
               
			 /* axios({
				   method : 'get',
				   url : 'https://news-at.zhihu.com/api/4/news/latest',
				   headers: {  
					// 跨域请求 这个配置不能少  
					"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",  
					'Accept': 'application/json'  
					} 
			   }).then(function(res){
				   console.log()
			   }) */
			   // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
// 			   const params = new URLSearchParams()
// 			   params.append('page',this.cur_page) 
// 			   params.append('rows',30)
                const  page = this.cur_page
				const rows = this.select_cate
                this.$axios.get(this.url,{
					 params: {
						 'rows' : rows,
						 'page' : page
					 }
				}).then((res) => {
					// console.log(res)
                    this.tableData = res.data.rows;
					
					for(let i in this.tableData){
						// console.log(this.tableData[i])
						if(this.tableData[i].status_id === 1){
							this.tableData[i].status_id = "启用";
						}
							
					}
						
					// console.log(this.tableData)
                })
              /* this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
					console.log(res)
                    this.tableData = res.data.list;
                }) */
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.vip_email;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    vip_mp: item.vip_mp,
                    vip_AN: item.vip_AN,
                    vip_email: item.vip_email,
					status_id: item.status_id
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                // this.$set(this.tableData, this.idx, this.form);
				console.log(this.tableData[this.idx])
				console.log(this.form.vip_AN)
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
				
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            },
			// 显示添加会员表单
			addUser(){
				this.addVisible = true
			},
			// 添加会员
			saveAdd(){
				// 创建一个params对象,来进行前后端数据交换
				var params = new URLSearchParams()
				params.append('vip_id',0) 
				params.append('vip_AN',this.adduser.vip_AN)
				params.append('vip_mp',this.adduser.vip_mp)
				params.append('vip_Email',this.adduser.vip_Email)
				params.append('vip_pwd',this.adduser.vip_pwd)
				if(this.adduser.status_id === '启用'){
					params.append('status_id',1)
				}else{
					params.append('status_id',2)
				}
				
				params.append('agent_id', localStorage.getItem('AgentID'))
// 				const vip_mp = this.adduser.vip_mp
// 				const vip_Email = this.adduser.vip_Email
				
				

				// 发送post请求,添加会员
				this.$axios.post('/api/VIP/Signin',params).then((res) => {
					let msgs = res.data.success;
					if(msgs){
						this.getData();
						this.addVisible = false
						this.$message.success('添加成功');
					}else{
						this.$message.success('添加失败');
					}
				})
				// this.tableData.splice(this.idx, 0,this.adduser);
			}
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
