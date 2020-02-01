import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        epochBeginning:"",
        api:'http://34.68.197.65:9801/nxt?',
        apiText:'NCL'
    }
})
