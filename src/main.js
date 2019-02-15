// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import {
  Card,
  Col,
  Row,
  Form,
  FormItem,
  Button,
  Input,
  Message,
  Menu,
  Submenu,
  MenuItem,
  Container,
  Header,
  Aside,
  Main,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Select,
  Option,
  DatePicker,
  Table,
  TableColumn,
  Dialog,
  Pagination,
  Upload,
  Badge,
  Autocomplete,
  Tabs,
  TabPane,
  MessageBox,
  Switch,
  Loading,
  Transfer,
  Radio
} from 'element-ui'

Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Input)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Upload)
Vue.use(Badge)
Vue.use(Autocomplete)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Switch)
Vue.use(Loading)
Vue.use(Transfer)
Vue.use(Radio)
Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$axios = axios
Vue.prototype.$img = 'http://zengxf.cn/'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
