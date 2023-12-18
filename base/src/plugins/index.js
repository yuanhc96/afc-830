import '@/components/index.js'
import './dnd.js'
import './element-ui.js'
import './vxe-table.js'
import './wujie/wujie.js'
import Cookie from 'js-cookie'
import { changeTheme } from './theme.js'
changeTheme(Cookie.get('theme'))
