// Clean In-Memory Fallback Stores (Zero Hardcoded Data)
// All initial arrays are completely empty. Only data added by the user will exist.

export const mockExpenses = [];
export const mockVehicles = [];
export const mockItems = [];
export const mockServices = [];
export const mockSuppliers = [];
export const mockSupplierInvoices = [];
export const mockJobs = [];

export const getMockExpenses = () => mockExpenses;
export const getMockVehicles = () => mockVehicles;
export const getMockItems = () => mockItems;
export const getMockServices = () => mockServices;
export const getMockSuppliers = () => mockSuppliers;
export const getMockSupplierInvoices = () => mockSupplierInvoices;
export const getMockJobs = () => mockJobs;
