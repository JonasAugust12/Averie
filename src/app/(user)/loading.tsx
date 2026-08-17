import { getTranslations } from 'next-intl/server';
import { RouteLoadingScreen } from '@components/shared/RouteLoadingScreen';

export default async function UserRouteLoading() {
    const t = await getTranslations('common');

    return (
        <RouteLoadingScreen
            message={t('status.routeLoading')}
            hint={t('status.routeLoadingHint')}
        />
    );
}
