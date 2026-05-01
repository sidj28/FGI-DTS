import { type ShipmentDocument } from '../types';
import { StatusIcon } from './StatusIcon';

export const DocStatusIndicator = ({ doc }: { doc: ShipmentDocument }) => {
    const status = doc.current_status?.status?.status_name?.toLowerCase() || '';

    if (status === 'approved') return <StatusIcon type="ok" />;
    if (status === 'rejected') return <StatusIcon type="error" />;

    return <div className="size-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />;
};