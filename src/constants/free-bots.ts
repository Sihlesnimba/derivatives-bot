/**
 * Free Bots configuration
 * -----------------------
 * Static, safe starter bots for DBot Elite.
 * These bots are loaded into the Bot Builder workspace on demand.
 */

export type TFreeBot = {
    id: string;
    name: string;
    description?: string;
    strategy_type?: 'digits' | 'volatility' | 'trend';
    workspace: string; // XML path (public)
};

export const FREE_BOTS: TFreeBot[] = [
    {
        id: 'miner',
        name: 'Miner Bot',
        workspace: '/free-bots/workspaces/miner.xml',
    },
];
