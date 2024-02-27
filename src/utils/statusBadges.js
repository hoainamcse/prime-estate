import {Badge} from "../components/ui/badge.tsx";
import {AlarmClockIcon, AlarmClockOffIcon, Ban, CheckIcon, Dot, XIcon} from "lucide-react";
import {FaCheck} from "react-icons/fa6";
import {cn} from "../utils.ts";

export const LeaseStatusBadge = ({ status }) => {
    if (!status) return null

    const lowerStatus = status.toLowerCase()

    const statusVariant = {
        active: 'positive',
        expired: 'negative',
        terminated: 'negative',
        pending: 'warning',
    }

    const dotColor = {
        active: 'bg-green-600',
        expired: 'bg-red-500',
        terminated: 'bg-red-500',
        pending: 'bg-orange-600',
    }

    return (
        <Badge variant={statusVariant[lowerStatus]}>
            <p className={cn("inline-block w-1 h-1 rounded-full mr-1", dotColor[lowerStatus])}/>
            {lowerStatus}
        </Badge>
    )
}

export const ListingStatusBadge = ({ status }) => {
    if (!status) return null;

    const lowerStatus = status.toLowerCase();

    const statusVariant = {
        active: 'positive',
        inactive: 'neutral',
        rented: 'positive',
        not_rented: 'negative',
        reserved: 'warning',
        sold: 'positive',
        pending: 'warning',
        unknown: 'neutral',
    };

    const dotColor = {
        active: 'bg-green-600',
        inactive: 'bg-gray-400',
        rented: 'bg-green-600',
        not_rented: 'bg-red-500',
        reserved: 'bg-orange-600',
        sold: 'bg-blue-600',
        pending: 'bg-yellow-500',
        unknown: 'bg-gray-400',
    };

    return (
        <Badge variant={statusVariant[lowerStatus]}>
            <span className={cn("inline-block w-1 h-1 rounded-full mr-2", dotColor[lowerStatus])}></span>
            {lowerStatus}
        </Badge>
    );
};

export const PaymentStatusBadge = ({ status }) => {
    if (!status) return null

    const lowerStatus = status.toLowerCase()

    const statusVariant = {
        pending: 'warning',
        paid: 'positive',
        late: 'negative',
        overdue: 'negative',
        cancelled: 'neutral',
        rejected: 'pink',
    }

    const statusIcon = {
        pending: <AlarmClockIcon className="w-3 h-3 mr-[4px]"/>,
        paid: <FaCheck className="w-3 h-3 mr-[4px] text-green-600"/>,
        late: <AlarmClockOffIcon className="w-3 h-3 mr-[4px] "/>,
        overdue:  <AlarmClockOffIcon className="w-3 h-3 mr-[4px]"/>,
        cancelled: <XIcon className="w-3 h-3 mr-[2px]"/>,
        rejected: <Ban className="w-3 h-3 mr-[4px] text-pink-400"/>,
    }

    return (
        <Badge variant={statusVariant[lowerStatus]}>
            {statusIcon[lowerStatus]}
            {lowerStatus}
        </Badge>
    )
}