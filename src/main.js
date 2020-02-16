import Vue from 'vue'
import App from './App.vue'
import splitPane from 'vue-splitpane'

Vue.config.productionTip = false
Vue.component('split-pane', splitPane);

new Vue({
  render: h => h(App),
}).$mount('#app')



