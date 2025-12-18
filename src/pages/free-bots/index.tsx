import React from 'react';
import { observer } from 'mobx-react-lite';
import { FREE_BOTS } from '@/constants/free-bots';
import { loadFreeBotWorkspace } from '@/utils/free-bots/load-free-bot';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import './free-bots.scss';

const FreeBots = observer(() => {
    const { dashboard } = useStore();
    const { setActiveTab } = dashboard;

    const handleLoadBot = async (workspace: string) => {
        await loadFreeBotWorkspace(workspace);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    return (
        <div className='free-bots'>
            <h2 className='free-bots__heading'>Free Bots</h2>

            <div className='free-bots__list'>
                {FREE_BOTS.map(bot => (
                    <div key={bot.id} className='free-bots__card'>
                        <span className='free-bots__name'>{bot.name}</span>

                        <button
                            className='free-bots__button'
                            onClick={() => handleLoadBot(bot.workspace)}
                        >
                            Load bot
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default FreeBots;
