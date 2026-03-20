export default [
  // {
  //   path: '/test',
  //   component: './test',
  // },
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'Home',
    path: '/home',
    component: './Home',
    icon: 'HomeOutlined',
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: 'DashboardOutlined',
    routes: [
      {
        path: '/analytics',
        redirect: '/analytics/subscriptions',
      },
      {
        path: '/analytics/subscriptions',
        component: './Analytics/Subscriptions',
        name: 'Subscriptions',
      },
      {
        path: '/analytics/user',
        component: './Analytics/User',
        name: 'User Analytics',
      },
      {
        path: '/analytics/income',
        component: './Analytics/Income',
        name: 'Income Analytics',
      },
      {
        path: '/analytics/download',
        component: './Analytics/Download',
        name: 'Statistical download',
      },
    ],
  },
  {
    name: 'Expert management',
    path: '/bot',
    icon: 'DatabaseOutlined',
    routes: [
      {
        path: '/bot',
        redirect: '/bot/category',
      },
      {
        path: '/bot/category',
        component: './Bot/Category',
        name: 'Bot category',
      },
      {
        path: '/bot/category/edit/:id',
        component: './Bot/Category/Edit',
        name: 'Bot category Edit',
        hideInMenu: true,
      },

      {
        path: '/bot/built-in',
        component: './Bot/Built-in',
        name: 'Built-in bot',
      },
      {
        path: '/bot/built-in/edit/:id',
        component: './Bot/Built-in/Edit',
        name: 'Built-in bot edit',
        hideInMenu: true,
      },
      // {
      //   path: '/bot/user-created',
      //   component: './Bot/User-created',
      //   name: 'User-created bot management',
      // },
      // {
      //   path: '/bot/user-created/view/:id',
      //   component: './Bot/User-created/View',
      //   name: 'Bot Created View',
      //   hideInMenu: true,
      // },
      {
        path: '/bot/explore',
        component: './Bot/Explore',
        name: 'Explore management',
      },
      {
        path: '/bot/explore/edit/:id',
        component: './Bot/Explore/Edit',
        name: 'Explore edit',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'Story Management',
    path: '/story',
    icon: 'CheckCircleOutlined',
    // component: './Story',
    routes: [
      {
        path: '/story',
        redirect: '/story/list',
      },
      {
        name: 'Story Management',
        path: '/story/list',
        component: './Story/StoryManagement',
      },
      {
        path: '/story/list/edit/:id',
        component: './Story/StoryManagement/CreateEdit',
        // component: './Bot/Explore/Edit',
        hideInMenu: true,
      },
      {
        name: 'Gift Management',
        path: '/story/gift/list',
        component: './Story/GiftManagement',
      },
      {
        path: '/story/gift/list/edit/:id',
        component: './Story/GiftManagement/Edit',
        hideInMenu: true,
      },
      {
        name: 'Story category',
        path: '/story/category/list',
        component: './Story/Category',
      },
    ],
  },

  {
    name: 'Financial management',
    path: '/financial',
    icon: 'AccountBookOutlined',
    routes: [
      // {
      //   path: '/financial',
      //   redirect: '/financial/orderInformation',
      // },
      {
        name: 'Order information',
        path: '/financial/orderInformation',
        component: './Financial/OrderInformation',
      },
      {
        name: 'View',
        path: '/financial/orderInformation/:id',
        component: './Financial/OrderInformation/detail',
        hideInMenu: true,
      },
      {
        name: 'Service pack management',
        path: '/financial/servicePackManagement',
        component: './Financial/ServicePackManagement',
      },
      {
        name: 'Service pack list',
        path: '/financial/servicePackManagement/:id',
        component: './Financial/ServicePackManagement/edit',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'User management',
    path: '/userManagement',
    icon: 'UserOutlined',
    routes: [
      {
        name: 'User View',
        path: '/userManagement/userView',
        component: './UserManagement/UserView',
      },
      {
        name: 'User Detail',
        path: '/userManagement/userView/:id',
        component: './UserManagement/UserView/detail',
        hideInMenu: true,
      },
      {
        name: 'Group management',
        path: '/userManagement/groupManagement',
        component: './UserManagement/GroupManagement',
      },
      {
        name: 'Groups',
        path: '/userManagement/groupManagement/:id/:groupName',
        component: './UserManagement/GroupManagement/edit',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'Support Management',
    path: '/supportManagement',
    icon: 'FormOutlined',
    routes: [
      {
        name: 'FeedbackList',
        path: '/supportManagement/feedbacklist',
        component: './SupportManagement/FeedbackList',
      },
      {
        name: 'FeedbackList View',
        path: '/supportManagement/feedbacklist/detail/:id',
        component: './SupportManagement/FeedbackList/detail',
        hideInMenu: true,
      },
      {
        name: 'Report Statistics',
        path: '/supportManagement/reportstatistics',
        component: './SupportManagement/Reportstatistics',
      },
    ],
  },

  {
    name: 'System management',
    path: '/systemManagement',
    icon: 'SettingOutlined',
    routes: [
      {
        name: 'Admin management',
        path: '/systemManagement/adminManagement',
        component: './SystemManagement/AdminManagement',
      },
      {
        name: 'Admin mangement',
        path: '/systemManagement/adminManagement/:id',
        component: './SystemManagement/AdminManagement/detail',
        hideInMenu: true,
      },
      {
        name: 'Permission management',
        path: '/systemManagement/permissionManagement',
        component: './SystemManagement/PermissionManagement',
      },
      {
        name: 'Role Management',
        path: '/systemManagement/permissionManagement/:id',
        component: './SystemManagement/PermissionManagement/detail',
        hideInMenu: true,
      },
      {
        name: 'Dictionary setting',
        path: '/systemManagement/dictionarySetting',
        routes: [
          {
            name: 'Interest list',
            path: '/systemManagement/dictionarySetting/interestList',
            component: './SystemManagement/DictionarySetting/InterestList',
            hideInMenu: true,
          },
          {
            name: 'Interests',
            path: '/systemManagement/dictionarySetting/interestList/:id/:tagName',
            component: './SystemManagement/DictionarySetting/InterestList/edit',
            hideInMenu: true,
          },
          {
            name: 'Interest tags',
            path: '/systemManagement/dictionarySetting/interesttags',
            component: './SystemManagement/DictionarySetting/InterestTags',
          },
          {
            name: 'Interests tag edit',
            path: '/systemManagement/dictionarySetting/interesttags/:id',
            component: './SystemManagement/DictionarySetting/InterestTags/edit',
            hideInMenu: true,
          },
        ],
      },
      {
        name: 'Assistant Setting',
        path: '/systemManagement/assistant-setting',
        component: './SystemManagement/AssistantSetting',
      },
      {
        path: '/systemManagement/assistant-setting/digit-profile/:id',
        component: './DigitProfile',
        name: ' DigitProfile',
        hideInMenu: true,
      },
    ],
  },

  {
    name: 'Notifications',
    path: '/notifications',
    icon: 'BookOutlined',
    routes: [
      {
        name: 'Push-notifications',
        path: '/notifications/pushNotifications',
        component: './Notifications/PushNotifications',
      },
      {
        name: 'Push-notifications',
        path: '/notifications/pushNotifications/:id',
        component: './Notifications/PushNotifications/edit',
        hideInMenu: true,
      },
      {
        name: 'Task View',
        path: '/notifications/pushNotifications/task-detail/:id',
        component: './Notifications/PushNotifications/TaskDetail',
        hideInMenu: true,
      },
      {
        name: 'Record View',
        path: '/notifications/pushNotifications/record-detail/:id',
        component: './Notifications/PushNotifications/RecordDetail',
        hideInMenu: true,
      },
      {
        name: 'Email logs',
        path: '/notifications/emailLogs',
        component: './Notifications/EmailLogs',
      },
      // {
      //   name: 'SMS logs',
      //   path: '/notifications/sMSLogs',
      //   component: './Notifications/SMSLogs',
      // },
      {
        name: 'Operation logs',
        path: '/notifications/operationLogs',
        component: './Notifications/OperationLogs',
      },
    ],
  },
  {
    name: 'Content Management',
    path: '/contentManagement',
    icon: 'BookOutlined',
    routes: [
      {
        name: 'Post List',
        path: '/contentManagement/postList',
        component: './ContentManagement/PostList',
      },
      {
        name: 'Post Detail',
        path: '/contentManagement/postList/:id',
        component: './ContentManagement/ReportList/detail',
        hideInMenu: true,
      },
      {
        name: 'Sensitive-Words List',
        path: '/contentManagement/sensitiveWords',
        component: './ContentManagement/SensitiveWordsList',
      },
      {
        name: 'Blocked Author List',
        path: '/contentManagement/blockedAuthor',
        component: './ContentManagement/BlockedAuthorList',
      },
      {
        name: 'Report content',
        path: '/contentManagement/reportList',
        component: './ContentManagement/ReportList',
      },
      {
        name: 'Report Detail',
        path: '/contentManagement/reportList/:id',
        component: './ContentManagement/ReportList/detail',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'Group Management',
    path: '/group',
    icon: 'BookOutlined',
    component: './Group',
  },
  {
    path: '/group/:id/member',
    component: './Group/MemberManagement',
    hideInMenu: true,
  },
  {
    name: 'Game',
    path: '/game',
    icon: 'BookOutlined',
    component: './Game',
    // routes: [
    //   {
    //     path: '/game',
    //     redirect: '/game/list',
    //   },
    //   {
    //     // name:'Game list',
    //     path: '/game/list',
    //     component: './Game',
    //   },
    // ],
  },
  {
    path: '/game/edit/:id',
    component: './Game/Edit',
    hideInMenu: true,
  },
  {
    // name:'Game result list',
    path: '/game/result/:id',
    component: './Game/Result',
    hideInMenu: true,
  },
  {
    name: 'Sphere',
    path: '/sphere',
    icon: 'BookOutlined',
    component: './Sphere',
    // routes: [
    //   {
    //     path: '/sphere',
    //     redirect: '/sphere/list',
    //   },
    //   {
    //     path: '/sphere/list',
    //     component: './Sphere',
    //   },
    //   {
    //     path: '/sphere/edit/:id',
    //     component: './Sphere/Edit',
    //   },
    //   {
    //     path: '/sphere/bot-manage/:id/:type',
    //     component: './Sphere/BotManagement',
    //     hideInMenu: true,
    //   },
    // ],
  },
  {
    path: '/sphere/edit/:id',
    component: './Sphere/Edit',
    hideInMenu: true,
  },
  {
    path: '/sphere/bot-manage/:id/:type',
    component: './Sphere/BotManagement',
    hideInMenu: true,
  },
  {
    name: 'User Task Management',
    path: '/userTask',
    icon: 'BookOutlined',
    component: './UserTask',
  },
  {
    name: 'User',
    path: '/user',
    layout: false,
    component: '@/layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        component: './User/Login',
      },
      {
        path: '/user/change-pass',
        component: './User/ChangePass',
      },
    ],
  },
  {
    path: '/register',
    name: 'Register',
    layout: false,
    component: '@/layouts/RegisterLayout',
    routes: [
      {
        path: '/register/verify', // 注册--成功
        component: './Register/Verification',
      },
      {
        path: '/register/set-new-pass', // 重设密码
        component: './Register/SetNewPassInput',
      },
      {
        path: '/register/set-new-pass-success', // 重设密码--成功
        component: './Register/SetNewPassSuccess',
      },
      {
        path: '/register/set-new-email', // 修改邮箱
        component: './Register/SetNewEmail',
      },
      {
        path: '/register/set-new-email-success', // 重设邮箱--成功
        component: './Register/SetNewEmailSuccess',
      },
      {
        path: '/register/delete-google-email', // 删除google邮箱--成功
        component: './Register/DeleteGooglleEmail',
      },
    ],
  },
  {
    path: '*',
    layout: false,
    component: './NoFound',
  },
];
