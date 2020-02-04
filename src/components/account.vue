<template>
    <el-container>
        <fhead></fhead>
        <el-main >
            <el-breadcrumb class="center" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
                <el-breadcrumb-item>Account address</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card  v-loading="loading" class="box-card center" style="margin-top: 16px">
                <div slot="header" class="clearfix">
                    <span>{{accounts.accountRS}}</span>
                </div>

                <el-form  size="mini"  label-width="100px" >
                    <el-form-item label="Account id">
                        {{accounts.account}}
                    </el-form-item>
                    <el-form-item v-if="accounts.name" label="account name">
                        {{accounts.name}}
                    </el-form-item>
                    <el-form-item label="Account address">
                        {{accounts.accountRS}}
                    </el-form-item>
                    <el-form-item label="Account public key">
                        {{accounts.publicKey}}
                    </el-form-item>
                    <el-form-item label="Account balance">
                        {{$g.wallet.amount(accounts.balanceNQT)}}
                    </el-form-item>
                    <el-form-item label="Forging quantity">
                        {{$g.wallet.amount(lessorsSum)}}
                    </el-form-item>
                    <el-form-item label="Forging revenue">
                        {{$g.wallet.amount(accounts.forgedBalanceNQT)}}
                    </el-form-item>
                    <el-form-item v-if="accounts.description&&accounts.description!=''" label="Account description">
                        {{accounts.description}}
                    </el-form-item>
                </el-form>

                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item v-if="accounts.currentLesseeRS" title="Rental Information" name="1">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item style="margin-bottom: 0" label="Tenant account id">
                                {{accounts.currentLessee}}
                            </el-form-item>
                            <el-form-item style="margin-bottom: 0" label="Tenant account address">
                                <router-link :to="'/account/'+accounts.currentLesseeRS">
                                    <el-button type="text"> {{accounts.currentLesseeRS}}</el-button>
                                </router-link>
                            </el-form-item>
                        </el-form>
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="Rental height">
                                <router-link :to="'/block/'+accounts.currentLeasingHeightFrom">
                                    <el-button type="text"> {{accounts.currentLeasingHeightFrom}}</el-button>
                                </router-link>
                            </el-form-item>
                            <el-form-item label="Expiration height">
                                {{accounts.currentLeasingHeightTo}}
                            </el-form-item>
                        </el-form>
                        <el-form v-show="accounts.nextLessee" :inline="true" class="demo-form-inline">
                            <el-form-item style="margin-bottom: 0" label="Next tenant account id">
                                {{accounts.nextLessee}}
                            </el-form-item>
                            <el-form-item style="margin-bottom: 0" label="Address of the next tenant account">
                                <router-link :to="'/account/'+accounts.nextLesseeRS">
                                    <el-button type="text"> {{accounts.nextLesseeRS}}</el-button>
                                </router-link>
                            </el-form-item>
                        </el-form>
                        <el-form v-show="accounts.nextLessee" :inline="true" class="demo-form-inline">
                            <el-form-item label="Next rental height">
                                {{accounts.nextLeasingHeightFrom}}
                            </el-form-item>
                            <el-form-item label="Next expiration height">
                                {{accounts.nextLeasingHeightTo}}
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="Transaction information list" name="2">
                        <el-table v-loading="transactionsing" :data="transactions" border style="width: 100%">
                            <el-table-column
                                    label="id"
                                    width="80">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="sending address"
                                    width="280">
                                <template slot-scope="scope">
                                    <router-link v-if="scope.row.senderRS!=account" :to="'/account/'+scope.row.senderRS">
                                        <el-button type="text"> {{scope.row.senderRS}}</el-button>
                                    </router-link>
                                    <div v-if="scope.row.senderRS==account">
                                       This account
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="receiving address"
                                    width="280">
                                <template slot-scope="scope">
                                    <router-link v-if="scope.row.recipientRS!=account" :to="'/account/'+scope.row.recipientRS">
                                        <el-button type="text"> {{scope.row.recipientRS}}</el-button>
                                    </router-link>
                                    <div v-if="scope.row.recipientRS==account">
                                        This account
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="Quantity"
                                    width="180">
                                <template slot-scope="scope">
                                    {{$g.wallet.amount(scope.row.amountNQT)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="Handling fee"
                                    width="180">
                                <template slot-scope="scope">
                                    {{$g.wallet.amount(scope.row.feeNQT)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="time"
                                    width="180">
                                <template slot-scope="scope">
                                    {{$g.wallet.formatDateTime(scope.row.timestamp*1000+($store.state.epochBeginning-500))}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button v-show="currentPageIs" @click="add" type="text">Load 15 more messages</el-button>
                    </el-collapse-item>
                    <el-collapse-item v-show="lessors.length!=0" :title="'Group list（'+lessors.length+'人）'" name="3">
                        <el-table
                                :data="lessors"
                                border
                                style="width: 460px">
                            <el-table-column
                                    label="Rental address"
                                    width="280">
                                <template slot-scope="scope">
                                    <router-link :to="'/account/'+scope.row.lessorRS">
                                        <el-button type="text"> {{scope.row.lessorRS}}</el-button>
                                    </router-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="Number of leases">
                                <template slot-scope="scope">
                                    {{$g.wallet.amount(scope.row.guaranteedBalanceNQT)}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-main>
        <el-footer class="footer">
            COPYRIGHT © 2018. ALL RIGHTS RESERVED. DESIGNED BY
            <a target="_blank" href="https://hebeblock.com/">NUCLEARPLATFORM</a>
        </el-footer>
    </el-container>
</template>


<script>
    import fhead from './fhead.vue';

    export default {
        name: 'account',
        components: {
            fhead
        },
        data () {
            return {
                loading:true,
                account:'',
                accounts:{},
                transactionsing:true,
                transactions:[],
                currentPage:1,
                currentPageIs:true,
                activeNames:[0],
                lessors:[],
                lessorsSum:0
            }
        },
        methods: {
            handleChange(val){
                if(val.toString().indexOf('2')!=-1){
                    console.log(this.transactions);
                    if(this.transactions.length==0){
                        this.transaction();
                    }
                }
            },
            add(){
                if(this.currentPageIs) {
                    this.currentPage++;
                    this.transaction();
                }
            },
            transaction(){
                this.transactionsing=true;
                this.$ajax({
                    method: 'get',
                    url: 'requestType=getBlockchainTransactions&account='+this.account+'' +
                    '&firstIndex='+(this.currentPage-1)*14+'&lastIndex='+((this.currentPage-1)*14+14),
                }).then(response => {
                    if(response.errorCode){
                        this.$alert('Account address error', 'prompt', {
                            confirmButtonText: '确定',
                        });determine
                    }else{
                        this.transactions=this.transactions.concat(response.transactions);
                        if(response.transactions.length!=15){
                            this.currentPageIs=false;
                        }
                        this.transactionsing=false;
                    }
                });
            },
            accountLessor(){
                this.lessors=[];
                this.lessorsSum=0;
                this.$ajax({
                    method: 'get',
                    url: 'requestType=getAccountLessors&account='+this.account,
                }).then(response => {
                    if(response.errorCode){
                        this.$alert('Account address error', 'prompt', {
                            confirmButtonText: 'determine',
                        });
                    }
                    else{
                        this.lessors=response.lessors;
                        this.lessors.forEach(item=>{
                            this.lessorsSum=this.lessorsSum+parseInt(item.guaranteedBalanceNQT);
                        })
                    }
                });
            },
            load(){
                this.activeNames=[0];
                this.currentPageIs=true;
                this.currentPage=1;
                this.transactions=[];
                this.account=this.$route.params.account;
                if(!this.account){
                    this.$router.replace('/');
                }
                this.loading=true;
                this.accountLessor();
                this.$ajax({
                    method: 'get',
                    url: 'requestType=getAccount&account='+this.account,
                }).then(response => {
                    if(response.errorCode){
                        this.$alert('Account address error', 'prompt', {
                            confirmButtonText: 'determine',
                        });
                    }
                    else{
                        this.accounts=response;
                        this.loading=false;
                    }
                });
            }
        },
        mounted: function () {
            this.load();
        },
        watch: {
            '$route' (to, from) {
                this.load()
            }
        }
    }
</script>


<style scoped>
</style>  