// ===========================
// Routing Configuration
// ===========================

export interface RouteConfig {
  path: string
  title: string
  component: string
  exact?: boolean
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: '首页',
    component: 'HomePage',
    exact: true,
  },
  {
    path: '/form',
    title: '表单页面',
    component: 'FormPage',
  },
  {
    path: '/table',
    title: '表格页面',
    component: 'TablePage',
  },
  {
    path: '/builder',
    title: '页面构建器',
    component: 'PageBuilder',
    children: [
      {
        path: '/builder/components',
        title: '组件库',
        component: 'ComponentLibrary',
      },
      {
        path: '/builder/pages',
        title: '页面管理',
        component: 'PageManager',
      },
      {
        path: '/builder/preview',
        title: '预览',
        component: 'PagePreview',
      },
    ],
  },
  {
    path: '/settings',
    title: '设置',
    component: 'Settings',
    children: [
      {
        path: '/settings/general',
        title: '通用设置',
        component: 'GeneralSettings',
      },
      {
        path: '/settings/appearance',
        title: '外观设置',
        component: 'AppearanceSettings',
      },
      {
        path: '/settings/data',
        title: '数据源设置',
        component: 'DataSettings',
      },
    ],
  },
]

// 获取扁平化的路由列表
export const getFlatRoutes = (
  routeList: RouteConfig[] = routes
): RouteConfig[] => {
  const flatRoutes: RouteConfig[] = []

  const flatten = (routes: RouteConfig[]) => {
    routes.forEach(route => {
      flatRoutes.push(route)
      if (route.children) {
        flatten(route.children)
      }
    })
  }

  flatten(routeList)
  return flatRoutes
}

// 根据路径查找路由
export const findRouteByPath = (
  path: string,
  routeList: RouteConfig[] = routes
): RouteConfig | null => {
  const flatRoutes = getFlatRoutes(routeList)
  return flatRoutes.find(route => route.path === path) || null
}

// 获取面包屑导航
export const getBreadcrumbs = (
  path: string,
  routeList: RouteConfig[] = routes
): RouteConfig[] => {
  const breadcrumbs: RouteConfig[] = []
  const pathSegments = path.split('/').filter(segment => segment)

  let currentPath = ''
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`
    const route = findRouteByPath(currentPath, routeList)
    if (route) {
      breadcrumbs.push(route)
    }
  })

  return breadcrumbs
}

// 导航菜单配置
export interface NavigationItem {
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
}

export const navigationMenu: NavigationItem[] = [
  {
    label: '首页',
    path: '/',
    icon: 'home',
  },
  {
    label: '示例页面',
    path: '/examples',
    icon: 'code',
    children: [
      {
        label: '动态表单',
        path: '/form',
        icon: 'form',
      },
      {
        label: '动态表格',
        path: '/table',
        icon: 'table',
      },
    ],
  },
  {
    label: '页面构建器',
    path: '/builder',
    icon: 'build',
    children: [
      {
        label: '组件库',
        path: '/builder/components',
        icon: 'component',
      },
      {
        label: '页面管理',
        path: '/builder/pages',
        icon: 'pages',
      },
      {
        label: '预览',
        path: '/builder/preview',
        icon: 'preview',
      },
    ],
  },
  {
    label: '设置',
    path: '/settings',
    icon: 'settings',
    children: [
      {
        label: '通用设置',
        path: '/settings/general',
        icon: 'general',
      },
      {
        label: '外观设置',
        path: '/settings/appearance',
        icon: 'appearance',
      },
      {
        label: '数据源设置',
        path: '/settings/data',
        icon: 'data',
      },
    ],
  },
]

// 路由守卫配置
export interface RouteGuard {
  path: string
  requireAuth?: boolean
  allowedRoles?: string[]
  redirectTo?: string
}

export const routeGuards: RouteGuard[] = [
  {
    path: '/builder',
    requireAuth: true,
    allowedRoles: ['admin', 'developer'],
  },
  {
    path: '/settings',
    requireAuth: true,
    allowedRoles: ['admin'],
  },
]

// 检查路由权限
export const checkRoutePermission = (
  path: string,
  userRole?: string
): boolean => {
  const guard = routeGuards.find(guard => path.startsWith(guard.path))

  if (!guard) {
    return true // 没有守卫的路由默认允许访问
  }

  if (guard.requireAuth && !userRole) {
    return false // 需要认证但用户未登录
  }

  if (
    guard.allowedRoles &&
    userRole &&
    !guard.allowedRoles.includes(userRole)
  ) {
    return false // 用户角色不在允许列表中
  }

  return true
}

export default {
  routes,
  navigationMenu,
  routeGuards,
  getFlatRoutes,
  findRouteByPath,
  getBreadcrumbs,
  checkRoutePermission,
}
