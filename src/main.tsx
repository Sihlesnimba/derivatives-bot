import { configure } from 'mobx';
import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { AnalyticsInitializer } from './utils/analytics';
import { performVersionCheck } from './utils/version-check';
import './styles/index.scss';

// Configure MobX
configure({ isolateGlobalState: true });

// Force dark theme on first load
const saved_theme = localStorage.getItem('theme');
if (!saved_theme) {
    localStorage.setItem('theme', 'dark');
}

// Sync DOM classes
const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(theme);

document.body.classList.remove('theme--light', 'theme--dark');
document.body.classList.add(theme === 'dark' ? 'theme--dark' : 'theme--light');

// Init services
performVersionCheck();
AnalyticsInitializer();

// Render app ✅
ReactDOM.createRoot(document.getElementById('root')!).render(<AuthWrapper />);
