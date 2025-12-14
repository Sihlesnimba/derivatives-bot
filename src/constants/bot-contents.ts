type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    FREE_BOTS: 'Free Bots',
    CHART: 'Chart',
});

export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    FREE_BOTS: 2,
    CHART: 3,
    TUTORIAL: 4,
});

export const MAX_STRATEGIES = 10;

/**
 * ⚠️ Order MUST match DBOT_TABS indexes
 */
export const TAB_IDS = [
    'id-dbot-dashboard', // 0
    'id-bot-builder', // 1
    'id-free-bots', // 2
    'id-charts', // 3
    'id-tutorials', // 4
];

export const DEBOUNCE_INTERVAL_TIME = 500;
