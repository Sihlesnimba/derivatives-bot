import { standalone_routes } from '@/components/shared';
import BrandLogoUrl from '../../../assets/brand/logo.png';
import './app-logo.scss';

export const AppLogo = () => {
    return (
        <a className='app-header__logo' href={standalone_routes.deriv_app} aria-label='Go to Deriv'>
            <img className='app-header__logo-image' src={BrandLogoUrl} alt='Your Brand' />

            <span className='app-header__powered'>
                Powered by <span className='app-header__powered-deriv'>Deriv</span>
            </span>
        </a>
    );
};
