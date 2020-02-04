<template>
    <el-header class="el_head">
      <div class="center">
          <el-row type="flex">
              <el-col :span="24">
                  <router-link to="/">
                     <img class="img" src="./../assets/logo2.png"/>
                     <div class="logoTxt">Ncl Explorer</div>
                  </router-link>
                  <el-dropdown class="el_dropdown" @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{$store.state.apiText}}Block Browser<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="blocks">Block</el-dropdown-item>
                          <el-dropdown-item command="peers">node</el-dropdown-item>
                          <el-dropdown-item command="generators">Forging pool</el-dropdown-item>
                          <a target="_blank" href="/#/?type=NCL">
                              <el-dropdown-item divided>NCL Block Browser</el-dropdown-item>
                              </a>
                          <a target="_blank" href="/#/?type=NXT">
                              <el-dropdown-item>NXT Block Browser</el-dropdown-item>
                          </a>
                          <a target="_blank" href="/#/?type=RNG">
                              <el-dropdown-item>RNG Block Browser</el-dropdown-item>
                          </a>
                          <a target="_blank" href="/#/?type=APL">
                              <el-dropdown-item>APL Block Browser</el-dropdown-item>
                          </a>
                      </el-dropdown-menu>
                  </el-dropdown>
                  <el-button @click="search" style="float: right;margin-top: 10px;" icon="el-icon-search" circle></el-button>
              </el-col>
          </el-row>
      </div>
    </el-header>

    <!--<el-container>-->

    <!--</el-container>-->
</template>


<script>
    export default {
        name: 'fhead',
        methods: {
            handleCommand(command) {
                if(command&&command.indexOf("type")==-1){
                    this.$router.push('/'+command)
                }
            },
            search(){
                this.$prompt('Please enter account address / block height ',' Prompt ', {
                    confirmButtonText: 'determine',
                    cancelButtonText: 'cancel',
                }).then(({ value }) => {
                    if(value.indexOf('-')!=-1){
                        this.$router.replace('/account/'+value);
                    }else{
                        this.$router.replace('/block/'+value);
                    }

                })
            }
        }
    }
</script>


<style  lang="less">
    a{
        text-decoration: none !important;
        color: #606266;
    }
    .el_head{
        background-color: #2196F3 !important;
        box-shadow: 0 1px 0px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24)!important;
        .el-dropdown-link{
            color: #fff;
        }
        .el_dropdown{
            margin-top: 25px;margin-left: 20px;

        }
        .img{float: left;width: 40px;margin-top: 10px;}
        .logoTxt{font-weight: bold;font-size: 20px;float: left;color: #fff;margin-top: 20px;}
    }
</style>  