import {dateParser, moneyParser} from "../../utils/formatters.js";
import {DataTable} from "../ui/data-table.js";
import {ColumnDef} from "@tanstack/react-table";
import {Lease} from "../../utils/classes.ts";
import {Button} from "../ui/button.tsx";
import {FilePlus2, Link, Scroll} from "lucide-react";
import AddLease from "./AddLease.js";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {selectUnitById} from "../../services/slices/objectSlice.js";
import {useSelector} from "react-redux";
import {LeaseStatus, PaymentFrequency} from "../../utils/magicNumbers.js";
import {isAfter} from "date-fns";


const UnitLink = ({unitId}) => {

    const navigate = useNavigate();


    const unit = useSelector(state => selectUnitById(state, unitId))

    if (!unit) return null;

    return (
        <div className="p-2 whitespace-nowrap rounded-full bg-white border-2 border-gray-100 w-fit hover:bg-gray-100 font-500 flex flex-row cursor-pointer" onClick={() => {
            navigate(`/rentals/${unit?.id}`)
        }}>
            <Link className="w-5 h-5 mr-2" />
            {unit?.unitIdentifier}
        </div>
    )
}




const LeaseHistory = ({leases, ...props}) => {

    //const location = useLocation();
    //const isRentalPage = location.pathname.includes("rentals");


    const columns: ColumnDef<Lease>[] = [
        {
            id: "unit",
            header: "Unit",
            meta: {
                type: "string",
            },
            cell: ({ row }) => {

                return (
                    <UnitLink unitId={row?.original?.unitId} />
                )
            },
            accessorFn: (row) => row?.startDate || undefined,
            enableSorting: true,
        },
        {
            id: "startDate",
            header: "Start Date",
            meta: {
                type: "date",
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize font-500">
                        {dateParser(row?.original?.startDate)}
                    </div>
                )
            },
            accessorFn: (row) => row?.startDate || undefined,
            enableSorting: true,
        },
        {
            id: "endDate",
            header: "End Date",
            meta: {
                type: "date",
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize font-500">
                        {dateParser(row?.original?.endDate)}
                    </div>
                )
            },
            accessorFn: (row) => row?.endDate || undefined,
            enableSorting: true,

        },
        {
            id: "rentalPrice",
            header: "Rent Price",
            meta: {
                type: "string",
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize font-500">
                        {moneyParser(row?.original?.rentalPrice)}
                    </div>
                )
            },
            accessorFn: (row) => row?.rentalPrice || undefined,
            enableSorting: true,
        },
        {
            id: "paymentFrequency",
            header: "Payment Frequency",
            meta: {
                type: "string",
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {PaymentFrequency[row?.original?.paymentFrequency]}
                    </div>
                )
            },
            accessorFn: (row) => row?.paymentFrequency || undefined,
            enableSorting: true,
        },
        {
            id: "status",
            header: "Status",
            meta: {
                type: "string",
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {LeaseStatus[row?.original?.status]}
                    </div>
                )
            },
            accessorFn: (row) => row?.status || undefined,
            enableSorting: true,
        },
        {
            id: "nextPaymentDue",
            header: "Next Payment Due",
            meta: {
                type: "date",
            },
            cell: ({ row }) => {
                const paymentSchedule = row?.original?.paymentSchedule;

                if (!paymentSchedule || !paymentSchedule.length) return null;

                // Find oldest payment that is not "PAID"
                const oldestUnpaidPayment = paymentSchedule.find(p => p.status !== "PAID");

                return (
                    <div className="capitalize font-500">
                        {dateParser(oldestUnpaidPayment?.dueDate)}
                    </div>
                )
            },
            accessorFn: (row) => row?.totalRentDue || undefined,
            enableSorting: true,

        },
        {
            id: "totalRentPaid",
            header: "Total Rent Paid",
            meta: {
                type: "number",
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize font-500">
                        {moneyParser(row?.original?.rentPaid)}
                    </div>
                )
            },
            accessorFn: (row) => row?.rentPaid || undefined,
            enableSorting: true,
        },
        {
            id: "notes",
            header: "Notes",
            meta: {
                type: "string",
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {row.original?.notes}
                    </div>
                )
            },
            accessorFn: (row) => row?.notes || undefined,
            enableSorting: true,
        },
    ]



    return (
            <DataTable data={leases} columns={columns} title="Lease History" icon={<Scroll className={"w-5 h-5"} />}
                       defaultSort={{id: "startDate", desc: true}}
            >
                {props.children}
            </DataTable>
        )
}

export default LeaseHistory;