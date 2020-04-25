import { Routes } from '@angular/router';
import { NoContentComponent } from './views/no-content';
import { NoAccessComponent } from './views/no-access';
import { LoginComponent } from './views/login';
import { SecurityProvider } from './providers/security/security.provider';
import { appRouter } from './constants/appRouter';
import {LoginProvider} from "./views/login/providers/login.provider";

export const ROUTES: Routes = [
    // {
    //     path: '',
    //     loadChildren: () => System.import('./views/login').then((comp: any) => {
    //         return comp.default;
    //     }),
    // },
    // {
    //     path: 'login',
    //     loadChildren: () => System.import('./views/login').then((comp: any) => {
    //         return comp.default;
    //     })
    // },
    {
        path: appRouter.empty,
        component: LoginComponent,
        // canLoad: [SecurityProvider]
    },
    {
        path: appRouter.login,
        component: LoginComponent,
    },
    {
        path: appRouter.loginauto,
        component: LoginComponent,
    },
    {
        path: appRouter.title.search,
        loadChildren: () => System.import('./views/titles').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo',
        loadChildren: () => System.import('./views/demo').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/tree',
        loadChildren: () => System.import('./views/demo/comps/tree').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/mse',
        loadChildren: () => System.import('./views/demo/comps/mse/index').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/video',
        loadChildren: () => System.import('./views/demo/comps/video/details').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/video/details/:type',
        loadChildren: () => System.import('./views/demo/comps/video/details').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
      path: 'demo/audio-synch',
      loadChildren: () => System.import('./views/demo/comps/audio.synch/details').then((comp: any) => {
        return comp.default;
      }),
      canLoad: [SecurityProvider],
    },
    {
      path: 'demo/video/audio-synch/:type',
      loadChildren: () => System.import('./views/demo/comps/audio.synch/details').then((comp: any) => {
        return comp.default;
      }),
      canLoad: [SecurityProvider],
    },
    {
        path: 'demo/timeline',
        loadChildren: () => System.import('./views/demo/comps/timeline').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/viewers',
        loadChildren: () => System.import('./views/demo/comps/viewers').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/date-formats',
        loadChildren: () => System.import('./views/demo/comps/date-formats').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/tabletree',
        loadChildren: () => System.import('./views/demo/comps/tabletree').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/permissions',
        loadChildren: () => System.import('./views/demo/comps/permissions').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/xml',
        loadChildren: () => System.import('./views/demo/comps/xml').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: 'demo/jointjs',
        loadChildren: () => System.import('./views/demo/comps/jointjs.interactive')
            .then((comp: any) => {
                return comp.default;
            }),
        // canLoad: [SecurityProvider],
    },
    // end demo
    {
        path: appRouter.profile,
        loadChildren: () => System.import('./views/profile').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.media_basket,
        loadChildren: () => System.import('./views/media-basket').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.events_manager,
        loadChildren: () => System.import('./views/events-manager').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.media_logger.detail,
        loadChildren: () => System.import('./views/media-logger').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.media_logger.silver,
        loadChildren: () => System.import('./views/media-logger-silver').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.media_logger.job,
        loadChildren: () => System.import('./views/media-logger-job').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.simple.search,
        loadChildren: () => System.import('./views/simplified').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.search,
        loadChildren: () => System.import('./views/start').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.searchType,
        loadChildren: () => System.import('./views/start').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.media.search,
        loadChildren: () => System.import('./views/media').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.names.search,
        loadChildren: () => System.import('./views/names').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.cachemanager.search,
        loadChildren: () => System.import('./views/cachemanager').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
      path: appRouter.mapping.search,
      loadChildren: () => System.import('./views/mapping').then((comp: any) => {
        return comp.default;
      }),
      canLoad: [SecurityProvider],
    },
    {
        path: appRouter.dashboard,
        loadChildren: () => System.import('./views/dashboard').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.reports,
        loadChildren: () => System.import('./views/reports').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.version,
        loadChildren: () => System.import('./views/version').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.carrier,
        loadChildren: () => System.import('./views/carrier').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.workflow.search,
        loadChildren: () => System.import('./views/workflow').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.task.search,
        loadChildren: () => System.import('./views/tasks').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.task_my.search,
        loadChildren: () => System.import('./views/tasks-my').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.workflow.detail,
        loadChildren: () => System.import('./views/workflow/comps/detail').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.workflow.subtitle_qc,
        loadChildren: () => System.import('./views/workflow/comps/subtitle.qc')
            .then((comp: any) => {
                return comp.default;
            }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.workflow.assessment,
        loadChildren: () => System.import('./views/workflow/comps/assessment').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.media.detail,
        loadChildren: () => System.import('./views/detail/media').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.versions.detail,
        loadChildren: () => System.import('./views/detail/version').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.carriers.detail,
        loadChildren: () => System.import('./views/detail/carrier').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.title.detail,
        loadChildren: () => System.import('./views/detail/titles').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.system.config,
        loadChildren: () => System.import('./views/system/config/').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider],
    },
    {
        path: appRouter.queues,
        loadChildren: () => System.import('./views/queue/').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.misr,
        loadChildren: () => System.import('./views/misr/').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.rce_silver,
        loadChildren: () => System.import('./views/rce-silverlight/').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.clip_editor_media,
        loadChildren: () => System.import('./views/clip-editor/').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.clip_editor_version,
        loadChildren: () => System.import('./views/clip-editor/').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.mediaproxy_logplayer,
        loadChildren: () => System.import('./views/mediaproxy-logplayer/').then((comp: any) => {
            return comp.default;
        }),
        canLoad: [SecurityProvider]
    },
    {
        path: appRouter.logout,
        loadChildren: () => System.import('./views/logout/').then((comp: any) => {
            return comp.default;
        }),
    },
    {
      path: appRouter.acquisitions.search,
      loadChildren: () => System.import('./views/acquisitions').then((comp: any) => {
        return comp.default;
      }),
      canLoad: [SecurityProvider]
    },
    {
      path: appRouter.acquisitions.workspace,
      loadChildren: () => System.import('./views/acquisitions/comps/acquisition-workplace').then((comp: any) => {
        return comp.default;
      }),
      canLoad: [SecurityProvider]
    },
    {
        path: appRouter.no_access,
        component: NoAccessComponent,
        canLoad: [SecurityProvider]
    },
    {
        path: '**',
        component: NoContentComponent,
        canLoad: [SecurityProvider]
    },
];
