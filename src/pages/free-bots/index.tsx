import React from 'react';
import { observer } from 'mobx-react-lite';
import { FREE_BOTS } from '@/constants/free-bots';
import './free-bots.scss';

const FreeBots = observer(() => {
    return (
        <div className='free-bots'>
            <h2 className='free-bots__title'>Free Bots</h2>

            <p className='free-bots__subtitle'>Ready-made strategies you can explore and load into the Bot Builder.</p>

            <div className='free-bots__list'>
                {FREE_BOTS.map(bot => (
                    <div key={bot.id} className='free-bots__card'>
                        <h3 className='free-bots__card-title'>{bot.name}</h3>

                        <p className='free-bots__card-description'>{bot.description}</p>

                        <span className='free-bots__card-tag'>{bot.strategy_type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default FreeBots;
