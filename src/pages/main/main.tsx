import React, { lazy, Suspense, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import { redirectToLogin } from '@/components/shared/utils/login';
import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import Dialog from '@/components/shared_ui/dialog';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import Tabs from '@/components/shared_ui/tabs/tabs';
import TradingViewModal from '@/components/trading-view-chart/trading-view-modal';
import { TAB_IDS } from '@/constants/bot-contents';
import { api_base } from '@/external/bot-skeleton';
import { CONNECTION_STATUS } from '@/external/bot-skeleton/services/api/observables/connection-status-stream';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import {
    LabelPairedChartLineCaptionRegularIcon,
    LabelPairedObjectsColumnCaptionRegularIcon,
    LabelPairedPuzzlePieceTwoCaptionBoldIcon,
} from '@deriv/quill-icons/LabelPaired';
import { LegacyGuide1pxIcon, LegacyTemplatesIcon } from '@deriv/quill-icons/Legacy';
import { Localize, localize } from '@deriv-com/translations';
import RunPanel from '../../components/run-panel';
import ChartModal from '../chart/chart-modal';
import Dashboard from '../dashboard';
import RunStrategy from '../dashboard/run-strategy';
import './main.scss';

const ChartWrapper = lazy(() => import('../chart/chart-wrapper'));
const Tutorial = lazy(() => import('../tutorials'));

const AppWrapper = observer(() => {
    const { connectionStatus } = useApiBase();
    const { dashboard, run_panel, quick_strategy, summary_card } = useStore();
    const {
        active_tab,
        active_tour,
        is_chart_modal_visible,
        is_trading_view_modal_visible,
        setActiveTab,
        setWebSocketState,
        setActiveTour,
        setTourDialogVisibility,
    } = dashboard;

    const { is_dialog_open, dialog_options, onCancelButtonClick, onCloseDialog, onOkButtonClick, stopBot } = run_panel;

    const { is_open } = quick_strategy;
    const { clear } = summary_card;

    const { cancel_button_text, ok_button_text, title, message, dismissable, is_closed_on_cancel } = dialog_options as {
        [key: string]: string;
    };

    const init_render = React.useRef(true);

    // Hash order aligned with DBOT_TABS
    const hash = ['dashboard', 'bot_builder', 'free_bots', 'chart', 'tutorial'];

    const location = useLocation();
    const navigate = useNavigate();

    let tab_value: number | string = active_tab;
    const getHashedValue = (tab: number) => {
        tab_value = location.hash?.split('#')[1];
        if (!tab_value) return tab;
        return Number(hash.indexOf(String(tab_value)));
    };
    const active_hash_tab = getHashedValue(active_tab);

    useEffect(() => {
        if (connectionStatus !== CONNECTION_STATUS.OPENED) {
            const is_bot_running = document.getElementById('db-animation__stop-button') !== null;
            if (is_bot_running) {
                clear();
                stopBot();
                api_base.setIsRunning(false);
                setWebSocketState(false);
            }
        }
    }, [clear, connectionStatus, setWebSocketState, stopBot]);

    useEffect(() => {
        if (is_open) {
            setTourDialogVisibility(false);
        }

        if (init_render.current) {
            setActiveTab(Number(active_hash_tab));
            init_render.current = false;
        } else {
            navigate(`#${hash[active_tab] || hash[0]}`);
        }

        if (active_tour !== '') {
            setActiveTour('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab]);

    const handleTabChange = React.useCallback(
        (tab_index: number) => {
            setActiveTab(tab_index);
            const el_id = TAB_IDS[tab_index];
            if (el_id) {
                const el_tab = document.getElementById(el_id);
                setTimeout(() => {
                    el_tab?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }, 10);
            }
        },
        [setActiveTab]
    );

    const handleLoginGeneration = () => {
        redirectToLogin(false, localStorage.getItem('i18n_language') || 'en', true);
    };

    return (
        <>
            <div className='main'>
                <Tabs active_index={active_tab} className='main__tabs' onTabItemClick={handleTabChange} top>
                    {/* Dashboard */}
                    <div
                        label={
                            <>
                                <LabelPairedObjectsColumnCaptionRegularIcon />
                                <Localize i18n_default_text='Dashboard' />
                            </>
                        }
                        id='id-dbot-dashboard'
                    >
                        <Dashboard handleTabChange={handleTabChange} />
                    </div>

                    {/* Bot Builder */}
                    <div
                        label={
                            <>
                                <LabelPairedPuzzlePieceTwoCaptionBoldIcon />
                                <Localize i18n_default_text='Bot Builder' />
                            </>
                        }
                        id='id-bot-builder'
                    />

                    {/* Free Bots */}
                    <div
                        label={
                            <>
                                <LegacyTemplatesIcon />
                                <Localize i18n_default_text='Free Bots' />
                            </>
                        }
                        id='id-free-bots'
                    >
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <h2>Free Bots</h2>
                            <p>Curated automated bots will appear here soon.</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div
                        label={
                            <>
                                <LabelPairedChartLineCaptionRegularIcon />
                                <Localize i18n_default_text='Charts' />
                            </>
                        }
                        id={
                            is_chart_modal_visible || is_trading_view_modal_visible
                                ? 'id-charts--disabled'
                                : 'id-charts'
                        }
                    >
                        <Suspense fallback={<ChunkLoader message={localize('Please wait, loading chart...')} />}>
                            <ChartWrapper show_digits_stats={false} />
                        </Suspense>
                    </div>

                    {/* Tutorials */}
                    <div
                        label={
                            <>
                                <LegacyGuide1pxIcon />
                                <Localize i18n_default_text='Tutorials' />
                            </>
                        }
                        id='id-tutorials'
                    >
                        <Suspense fallback={<ChunkLoader message={localize('Please wait, loading tutorials...')} />}>
                            <Tutorial handleTabChange={handleTabChange} />
                        </Suspense>
                    </div>
                </Tabs>
            </div>

            <DesktopWrapper>
                <RunStrategy />
                <RunPanel />
                <ChartModal />
                <TradingViewModal />
            </DesktopWrapper>

            <MobileWrapper>{!is_open && <RunPanel />}</MobileWrapper>

            <Dialog
                cancel_button_text={cancel_button_text || localize('Cancel')}
                confirm_button_text={ok_button_text || localize('Ok')}
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick}
                onClose={onCloseDialog}
                onConfirm={onOkButtonClick || onCloseDialog}
                title={title}
                login={handleLoginGeneration}
                dismissable={dismissable}
                is_closed_on_cancel={is_closed_on_cancel}
            >
                {message}
            </Dialog>
        </>
    );
});

export default AppWrapper;
