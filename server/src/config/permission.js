const permissions = {
  admin: {
    dashboard: ['view'],
    users: ['view', 'create', 'edit', 'delete', 'changeRole', 'activate', 'deactivate'],
    properties: ['view', 'create', 'edit', 'delete'],
    buildings: ['view', 'create', 'edit', 'delete'],
    units: ['view', 'create', 'edit', 'delete', 'assignTenant'],
    tenants: ['view', 'create', 'edit', 'delete'],
    lease: ['view', 'create', 'edit', 'delete', 'renew', 'terminate'],
    maintenance: ['view', 'create', 'edit', 'delete', 'assignStaff', 'assignVendor', 'changePriority', 'changeStatus'],
    amenities: ['view', 'create', 'edit', 'delete', 'disable'],
    bookings: ['view', 'create', 'edit', 'delete', 'approve', 'cancel'],
    payments: ['viewAll', 'verify', 'refund', 'export'],
    reports: ['viewAll', 'generate', 'export'],
    notifications: ['viewAll', 'create', 'send', 'delete'],
    settings: ['systemSettings', 'rolePermissions', 'paymentSettings', 'notificationSettings'],
    documents: ['viewAll', 'create', 'edit', 'delete']
  },
  manager: {
    dashboard: ['viewAssignedProperties'],
    properties: ['viewAssigned', 'editAssigned'],
    buildings: ['viewAssigned', 'create', 'edit'],
    units: ['view', 'create', 'edit', 'assignTenant'],
    tenants: ['viewAssigned', 'createLease', 'editTenantInfo'],
    lease: ['view', 'create', 'edit', 'renew'],
    maintenance: ['viewAllAssigned', 'createTicket', 'assignStaff', 'assignVendor', 'changePriority', 'changeStatus'],
    amenities: ['view', 'create', 'edit', 'disable'],
    bookings: ['viewAll', 'approve', 'cancel'],
    payments: ['viewPropertyPayments', 'verifyPayment', 'viewOutstandingRent'],
    reports: ['propertyReports', 'maintenanceReports', 'occupancyReports', 'paymentReports'],
    notifications: ['viewAssigned'],
    documents: ['viewPropertyDocs']
  },
  staff: {
    dashboard: ['viewOwnStats', 'viewTodayTasks', 'viewSchedule'],
    myTasks: ['viewAssigned', 'acceptTask', 'rejectTask', 'startTask', 'completeTask'],
    taskDetails: ['viewProperty', 'viewUnit', 'viewProblem', 'addWorkNotes', 'uploadPhotos', 'addMaterials'],
    maintenance: ['viewAssigned', 'updateStatus', 'addComment', 'uploadProof'],
    schedule: ['viewOwnSchedule'],
    performance: ['viewOwnPerformance'],
    properties: ['viewAssigned'],
    buildings: ['view'],
    units: ['viewAssigned'],
    amenities: ['view'],
    notifications: ['viewOwn'],
    documents: ['taskDocs'],
    settings: ['profile']
  },
  vendor: {
    dashboard: ['viewOwnJobs', 'viewPendingJobs', 'viewCompletedJobs', 'viewEarnings'],
    jobs: ['viewAssignedJobs', 'acceptJob', 'rejectJob', 'updateStatus'],
    jobDetails: ['viewProperty', 'viewUnit', 'viewProblem', 'addWorkNotes', 'uploadPhotos'],
    schedule: ['viewOwnSchedule', 'updateVisitTime'],
    materials: ['viewRequiredMaterials', 'addUsedMaterials', 'submitMaterialCost'],
    invoices: ['createInvoice', 'viewOwnInvoices', 'viewInvoiceStatus'],
    properties: ['viewJobProperty'],
    buildings: ['viewJobLocation'],
    units: ['viewJobUnit'],
    maintenance: ['viewVendorJobs', 'updateStatus'],
    notifications: ['viewOwn'],
    documents: ['jobDocs'],
    settings: ['profile']
  },
  tenant: {
    dashboard: ['viewOwnDashboard'],
    property: ['viewOwnProperty', 'viewUnit', 'viewFacilities'],
    lease: ['viewOwnLease', 'downloadAgreement', 'requestRenewal'],
    rent: ['viewCurrentRent', 'viewBill', 'payRent', 'downloadInvoice'],
    payments: ['viewOwnPayments', 'downloadReceipt'],
    maintenance: ['createRequest', 'viewOwnRequests', 'addComment', 'cancelOwnRequest', 'confirmCompletion'],
    amenities: ['viewAmenities', 'viewAvailability', 'book'],
    bookings: ['createBooking', 'viewOwnBookings', 'cancelOwnBooking', 'rescheduleOwnBooking'],
    documents: ['viewOwnDocuments', 'downloadOwnDocuments'],
    support: ['createTicket', 'viewOwnTickets'],
    profile: ['viewOwnProfile', 'editOwnProfile', 'changePassword'],
    notifications: ['viewOwn']
  }
};

permissions.owner = permissions.tenant;

module.exports = permissions;