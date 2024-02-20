import prisma from '../prisma.js';
import {createLeaseWithPaymentSchedule} from "../services/leaseService.js";


// Creates a tenant, if provided link them to a lease, otherwise create new lease using lease data in body
export async function createTenant(req, res) {
    const {leaseId} = req.query;
    const tenantData = {...req.body};
    // Remove Lease data from tenantdata
    delete tenantData.lease;
    delete tenantData.unitId;


    try {
        const newTenant = await prisma.tenant.create({
            data: {
                ...tenantData,
                leases: {
                    ...(leaseId ?
                            {connect: {id: parseInt(leaseId)}} : null

                    )
                }
            },
            include: {
                leases: true
            }
        });
        let lease = null;

        if (!leaseId) {
            const leaseBody = req.body?.lease;
            leaseBody.unitId = req.body.unitId;
            leaseBody.tenantId = newTenant.id;
            lease = await createLeaseWithPaymentSchedule(leaseBody, req.user.userId);
        }

        res.status(200).json({data: {
            ...newTenant,
            leases: [lease]
            } });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error creating tenant" });
    }
}

export async function getTenants(req, res) {
    try {
        const tenants = await prisma.tenant.findMany({
            where: {
                leases: {
                    some: {
                        realtor: {
                            userId: req.user.userId
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                leases: true
            }
        });

        res.status(200).json({data: tenants });
    }
    catch (error) {
        res.status(500).json({ message: "Error getting tenants" });
    }
}

export async function getTenant(req, res) {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: {
                id: parseInt(req.params.id),
                leases: {
                    some: {
                        realtor: {
                            userId: req.user.userId
                        }
                    }
                }
            },
            include: {
                leases: true
            }
        });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        res.status(200).json({data: tenant });
    }
    catch (error) {
        res.status(500).json({ message: "Error getting tenant" });
    }
}

export async function deleteTenant(req, res) {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
            include: {
                leases: true
            }
        });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        // Disconnect the tenant from each lease
        for (const lease of tenant.leases) {
            await prisma.lease.update({
                where: {
                    id: lease.id
                },

                data: {
                    tenant: {
                        disconnect: {
                            id: tenant.id
                        }
                    }
                }
            });
        }

        // Delete the tenant
        const deletedTenant = await prisma.tenant.delete({
            where: {
                id: tenant.id
            }
        });

        res.status(200).json({data: deletedTenant });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error deleting tenant" });
    }
}

// Allows realtors to update tenants, but only if the tenant is linked to a lease that the realtor owns.
// If the tenant has created an account of their own, they can update their own tenant data using the same endpoint
export async function updateTenant(req, res) {
    const tenantData = {...req.body};

    try {
        const updatedTenant = await prisma.tenant.update({
            where: {
                id: parseInt(req.params.id),
                leases: {
                    some: {
                        realtor: {
                            userId: req.user.userId
                        }
                    }
                }

            },
            data: {
                ...tenantData,
            },
            include: {
                leases: true
            }
        });

        res.status(200).json({data: updatedTenant });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating tenant" });
    }
}