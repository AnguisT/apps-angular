export const appRouter = {
    empty: '',
    login: 'login',
    loginauto: 'login?auto',
    logout: 'logout',
    logoutauto: 'logout?auto',
    no_access: 'no-access',
    acquisitions: {
      search: 'acquisitions',
      workspace: 'acquisitions/workspace/:id',
    },
    media: {
        search: 'media',
        detail: 'media/detail/:id',
    },
    cachemanager: {
        search: 'cachemanager',
        detail: 'media/detail/:id',
    },
    names: {
        search: 'names',
    },
    mapping: {
      search: 'mapping',
      detail: 'mapping/detail/:id',
    },
    workflow: {
        search: 'workflow',
        detail: 'workflow/detail/:id',
        subtitle_qc: 'workflow/subtitle-qc/:id',
        assessment: 'workflow/assessment/:id'
    },
    task: {
        search: 'tasks',
        detail: 'tasks/detail/:id',
        // subtitle_qc: 'workflow/subtitle-qc/:id',
    },
    task_my: {
        search: 'tasks/my',
        detail: 'tasks/my/detail/:id',
    },
    system: {
        system: 'system',
        config: 'system/config',
        xml: 'system/config/xml',
    },
    queues: 'queues',
    simplified: 'simplified',
    simple: {
        search: 'simple',
        settings: 'simple/settings',
    },
    search: 'search',
    searchType: 'search/:staticSearchType',
    start: 'start',
    profile: 'profile',
    events_manager: 'events-manager',
    misr: 'misr',
    dashboard: 'dashboard',
    title: {
        search: 'titles',
        detail: 'title/detail/:id',
    },
    versions: {
        search: 'versions',
        detail: 'versions/detail/:id',
    },
    version: 'version',
    carrier: 'carrier',
    carriers: {
        search: 'carriers',
        detail: 'carriers/detail/:id',
    },
    media_basket: 'media-basket',
    media_logger: {
        detail: 'media-logger/:id',
        job: 'media-logger-job/:id',
        jos_aspx: 'media-logger-job-aspx/:id',
        aspx: 'media-logger-aspx/:id',
        silver: 'media-logger-silver/:id',
    },
    reports: 'reports',
    clip_editor_media: 'clip-editor/media/:id',
    clip_editor_version: 'clip-editor/version/:id',
    rce_silver: 'rce-silver/:id',
    rce: 'rce/:id',
    mediaproxy_logplayer: 'mediaproxy-logplayer',
    joint: 'joint',
};
