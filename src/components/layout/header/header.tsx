import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { generateOAuthURL, standalone_routes } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Header, useDevice, Wrapper } from '@deriv-com/ui';
import { AppLogo } from '../app-logo';
import AccountsInfoLoader from './account-info-loader';
import AccountSwitcher from './account-switcher';
import MenuItems from './menu-items';
import MobileMenu from './mobile-menu';
import './header.scss';

type TAppHeaderProps = {
    isAuthenticating?: boolean;
};

// 🔗 Your Deriv affiliate signup link
const DERIV_SIGNUP_URL = 'https://track.deriv.com/_8Lovsuxt-L90QQMXeD9If2Nd7ZgqdRLk/1/';

const AppHeader = observer(({ isAuthenticating }: TAppHeaderProps) => {
    const { isDesktop } = useDevice();
    const { isAuthorizing, isAuthorized, activeLoginid, setIsAuthorizing } = useApiBase();
    const { client } = useStore() ?? {};
    const [authTimeout, setAuthTimeout] = useState(false);

    const { data: activeAccount } = useActiveAccount({
        allBalanceData: client?.all_accounts_balance,
        directBalance: client?.balance,
    });
    const { getCurrency, is_virtual } = client ?? {};

    const currency = getCurrency?.();
    const { localize } = useTranslations();

    const { isSingleLoggingIn, oAuthLogout } = useOauth2({ handleLogout: async () => client?.logout(), client });

    const handleLogout = useCallback(async () => {
        try {
            await oAuthLogout();
        } catch (error) {
            console.error('Logout failed:', error);
            await oAuthLogout();
        }
    }, [oAuthLogout]);

    // Handle direct URL access with token
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            setIsAuthorizing(true);
        }
    }, [setIsAuthorizing]);

    // Fallback timeout for auth
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthorizing && !activeLoginid) {
                setAuthTimeout(true);
                setIsAuthorizing(false);
            }
        }, 5000);

        if (activeLoginid || !isAuthorizing) {
            setAuthTimeout(false);
            clearTimeout(timer);
        }

        return () => clearTimeout(timer);
    }, [isAuthorizing, activeLoginid, setIsAuthorizing]);

    const handleLogin = useCallback(() => {
        try {
            setIsAuthorizing(true);
            window.location.replace(generateOAuthURL());
        } catch (error) {
            console.error('Login redirection failed:', error);
            setIsAuthorizing(false);
        }
    }, [setIsAuthorizing]);

    const renderAccountSection = useCallback(() => {
        // Logged in
        if (activeLoginid) {
            return (
                <div className='auth-actions'>
                    <AccountSwitcher activeAccount={activeAccount} />
                    {isDesktop && (
                        <Button tertiary disabled={client?.is_logging_out} onClick={handleLogout}>
                            <Localize i18n_default_text='Log out' />
                        </Button>
                    )}
                </div>
            );
        }

        // Not logged in → show Sign up + Log in
        if ((!isAuthorizing && !activeLoginid) || authTimeout) {
            return (
                <div className='auth-actions'>
                    <Button secondary onClick={() => window.open(DERIV_SIGNUP_URL, '_blank', 'noopener,noreferrer')}>
                        <Localize i18n_default_text='Sign up' />
                    </Button>

                    <Button tertiary onClick={handleLogin}>
                        <Localize i18n_default_text='Log in' />
                    </Button>
                </div>
            );
        }

        // Loading / authorizing
        return <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} />;
    }, [
        isAuthenticating,
        isAuthorizing,
        isSingleLoggingIn,
        isDesktop,
        activeLoginid,
        isAuthorized,
        standalone_routes,
        client,
        currency,
        localize,
        activeAccount,
        is_virtual,
        handleLogout,
        authTimeout,
    ]);

    if (client?.should_hide_header) return null;

    return (
        <Header
            className={clsx('app-header', {
                'app-header--desktop': isDesktop,
                'app-header--mobile': !isDesktop,
            })}
        >
            <Wrapper variant='left'>
                <MobileMenu onLogout={handleLogout} />
                <AppLogo />
                {isDesktop && <MenuItems />}
            </Wrapper>

            <Wrapper variant='right'>{renderAccountSection()}</Wrapper>
        </Header>
    );
});

export default AppHeader;
