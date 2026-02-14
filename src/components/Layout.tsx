import { Outlet } from 'react-router-dom';
import { SettingsButton } from './SettingsButton';
import { ErrorBoundary } from './ErrorBoundary';

export function Layout() {
  return (
    <div>
      <SettingsButton />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
