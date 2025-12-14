/**
 * Free Bots configuration
 * -----------------------
 * Static, safe starter bots for DBot Elite.
 * These bots are loaded into the Bot Builder workspace on demand.
 */

export type TFreeBot = {
    id: string;
    name: string;
    description: string;
    strategy_type: 'digits' | 'volatility' | 'trend';
    // Placeholder for now — will be replaced with Blockly XML
    workspace: null;
};

export const FREE_BOTS: TFreeBot[] = [
    {
        id: 'digits-even-odd',
        name: 'Digits Even / Odd',
        description:
            'A simple digits strategy that trades on even and odd outcomes. Ideal for beginners learning DBot.',
        strategy_type: 'digits',
        workspace: null,
    },
    {
        id: 'volatility-breakout',
        name: 'Volatility Breakout',
        description: 'Trades volatility indices using breakout logic. Demonstrates timing and entry conditions.',
        strategy_type: 'volatility',
        workspace: null,
    },
    {
        id: 'trend-follow-basic',
        name: 'Trend Follow (Basic)',
        description: 'A basic trend-following bot using directional bias. Designed to showcase trend logic.',
        strategy_type: 'trend',
        workspace: null,
    },
];
