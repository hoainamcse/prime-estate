import {authApi} from "./authApi.js";
import customFetchBase from "./customFetchBase.js";
import {toast} from "../../components/ui/use-toast.tsx";


export const bulkApi = authApi.injectEndpoints({
    reducerPath: 'bulkApi',
    baseQuery: customFetchBase,
    endpoints: (build) => ({
        updateLeases: build.mutation({
            query: (body) => {
                return {
                    url: `/bulk/leases`,
                    method: 'PATCH',
                    body
                }
            },
            async onQueryStarted(arg, { queryFulfilled }) {
                toast({
                    title: "Updating Leases...",
                    variant: "loading",
                })
                queryFulfilled
                    .then((data) => {
                        toast({
                            title: "Success",
                            description: `${data?.data?.data?.length} Leases updated successfully`,
                            variant: "success",
                        });
                    })
                    .catch(() => {
                        toast({
                            title: "Uh oh! Something went wrong.",
                            description: "There was a problem with your request.",
                            variant: "error",
                        });
                    })
            },
            invalidatesTags: ['Leases']
        }),
        deleteLeases: build.mutation({
            query: (body) => {
                return {
                    url: `/bulk/leases`,
                    method: 'DELETE',
                    body
                }
            },
            async onQueryStarted(arg, { queryFulfilled }) {
                toast({
                    title: "Deleting Leases...",
                    variant: "loading",
                })
                queryFulfilled
                    .then((data) => {
                        toast({
                            title: "Success",
                            description: `${data?.data?.data?.length} Leases deleted successfully`,
                            variant: "success",
                        });
                    })
                    .catch(() => {
                        toast({
                            title: "Uh oh! Something went wrong.",
                            description: "There was a problem with your request.",
                            variant: "error",
                        });
                    })
            },
            invalidatesTags: ['Leases']
        }),
    })
})


export const { useUpdateLeasesMutation, useDeleteLeasesMutation } = bulkApi;