/**
 * Created by Sergey Trizna on 17.02.2017.
 */
import { Injectable } from '@angular/core';
import { appRouter } from '../../constants/appRouter';

@Injectable()
export class PermissionService {

    static getPermissionsMap(): any {
        return {
            0: { // common
                paths: [
                    appRouter.empty, // empty route
                    appRouter.no_access,
                    // remove from common
                    appRouter.task.search,
                    appRouter.task_my.search,
                    appRouter.task.detail,
                    appRouter.workflow.search,
                    appRouter.workflow.detail,
                    appRouter.workflow.subtitle_qc,
                    appRouter.workflow.assessment,
                    appRouter.system.system,
                    appRouter.queues,
                    appRouter.media.search,
                    appRouter.names.search,
                    appRouter.cachemanager.search,
                    appRouter.media.detail,
                    appRouter.mapping.search,
                    appRouter.mapping.detail,
                    appRouter.simple.search,
                    appRouter.search,
                    appRouter.searchType,
                    appRouter.profile,
                    appRouter.events_manager,
                    'demo',
                    appRouter.misr,
                    appRouter.dashboard,
                    appRouter.title.search,
                    appRouter.title.detail,
                    appRouter.versions.search,
                    appRouter.versions.detail,
                    appRouter.version,
                    appRouter.carrier,
                    appRouter.carriers.search,
                    appRouter.carriers.detail,
                    appRouter.media_basket,
                    'demo/tree',
                    'demo/mse',
                    'demo/video',
                    'demo/video/details/:type',
                    'demo/audio-synch',
                    'demo/audio-synch/details/:type',
                    'demo/tabletree',
                    'demo/permissions',
                    'demo/xml',
                    'demo/jointjs',
                    'demo/timeline',
                    appRouter.system.xml,
                    appRouter.system.config,
                    'demo/jointjs',
                    'demo/date-formats',
                    'demo/fileupload',
                    'demo/viewers',
                    appRouter.media_logger.detail,
                    appRouter.reports,
                    appRouter.simple.settings,
                    appRouter.clip_editor_media,
                    appRouter.clip_editor_version,
                    appRouter.rce_silver,
                    appRouter.media_logger.silver,
                    appRouter.media_logger.job,
                    appRouter.mediaproxy_logplayer,
                    appRouter.acquisitions.search,
                    appRouter.acquisitions.workspace,
                ],
                names: [
                    'thumbnails',
                    'advsearch',
                    'advsearch-builder',
                    'advsearch-example',
                    'settings',
                    'xml',
                    'jointjs',
                    'media_upload'
                ]
            },
            20001: {
                paths: [
                ],
                names: [
                ]
            },
            20002: {
                paths: [
                ],
                names: [
                ]
            },
            20003: {
                paths: [
                ],
                names: [
                ]
            },
            20004: {
                paths: [
                ],
                names: [
                ]
            },
            20006: {
                paths: [
                ]
            },
            1200012: {
                paths: [
                ],
                names: [
                  'play_restricted_content'
                ]
            }
        }
    }
}
