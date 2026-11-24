module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/supplier-invoices/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dataStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dataStore.js [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const invoices = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dataStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupplierInvoices"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: invoices
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        if (!body.supplierName || !body.invoiceNo || !body.invoiceAmount) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Supplier Name, Invoice Number, and Invoice Amount are required.'
            }, {
                status: 400
            });
        }
        const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dataStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSupplierInvoice"])(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: created
        }, {
            status: 201
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message
        }, {
            status: 500
        });
    }
}
}),
"[project]/src/lib/dataStore.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createServiceRecord",
    ()=>createServiceRecord,
    "createSupplier",
    ()=>createSupplier,
    "createSupplierInvoice",
    ()=>createSupplierInvoice,
    "createVehicle",
    ()=>createVehicle,
    "deleteServiceRecord",
    ()=>deleteServiceRecord,
    "deleteVehicle",
    ()=>deleteVehicle,
    "getItems",
    ()=>getItems,
    "getServicesByVehicleNo",
    ()=>getServicesByVehicleNo,
    "getSupplierInvoices",
    ()=>getSupplierInvoices,
    "getSuppliers",
    ()=>getSuppliers,
    "getVehicles",
    ()=>getVehicles,
    "recordSupplierPayment",
    ()=>recordSupplierPayment,
    "updateVehicle",
    ()=>updateVehicle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Vehicle.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Item.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ServiceRecord.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Supplier.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/SupplierInvoice.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockStore.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
async function getVehicles() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                createdAt: -1
            }).lean();
            if (docs.length === 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockVehicles"].map(({ _id, ...rest })=>rest));
                docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                    createdAt: -1
                }).lean();
            }
            return docs.map((d)=>({
                    ...d,
                    id: d._id.toString()
                }));
        }
    } catch (err) {
        console.warn('Fallback to memory for getVehicles:', err.message);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockVehicles"])().map((v)=>({
            ...v,
            id: v._id || v.id
        }));
}
async function createVehicle(data) {
    const cleanData = {
        ...data,
        vehicleNo: data.vehicleNo.trim().toUpperCase(),
        rNo: data.rNo || `R-${String(Date.now()).slice(-3)}`
    };
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(cleanData);
            return {
                ...doc.toObject(),
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for createVehicle:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockVehicles"])();
    const newObj = {
        _id: 'veh_' + Date.now(),
        id: 'veh_' + Date.now(),
        ...cleanData,
        createdAt: new Date().toISOString()
    };
    list.unshift(newObj);
    return newObj;
}
async function updateVehicle(id, data) {
    if (data.vehicleNo) data.vehicleNo = data.vehicleNo.trim().toUpperCase();
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, data, {
                new: true
            }).lean();
            if (doc) return {
                ...doc,
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for updateVehicle:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockVehicles"])();
    const idx = list.findIndex((v)=>v._id === id || v.id === id || v.vehicleNo === id);
    if (idx !== -1) {
        list[idx] = {
            ...list[idx],
            ...data
        };
        return list[idx];
    }
    return null;
}
async function deleteVehicle(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
            return true;
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteVehicle:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockVehicles"])();
    const idx = list.findIndex((v)=>v._id === id || v.id === id || v.vehicleNo === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        return true;
    }
    return false;
}
async function getItems() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                itemCode: 1
            }).lean();
            if (docs.length === 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockItems"].map(({ _id, ...rest })=>rest));
                docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                    itemCode: 1
                }).lean();
            }
            return docs.map((d)=>({
                    ...d,
                    id: d._id.toString()
                }));
        }
    } catch (err) {
        console.warn('Fallback to memory for getItems:', err.message);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockItems"])().map((i)=>({
            ...i,
            id: i._id || i.id
        }));
}
async function getServicesByVehicleNo(vehicleNo) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let query = {};
            if (vehicleNo) {
                query.vehicleNo = vehicleNo.trim().toUpperCase();
            }
            let docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).sort({
                serviceDate: -1,
                createdAt: -1
            }).lean();
            if (docs.length === 0 && !vehicleNo) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockServices"].map(({ _id, ...rest })=>rest));
                docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                    serviceDate: -1,
                    createdAt: -1
                }).lean();
            }
            return docs.map((d)=>({
                    ...d,
                    id: d._id.toString()
                }));
        }
    } catch (err) {
        console.warn('Fallback to memory for getServices:', err.message);
    }
    let list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockServices"])();
    if (vehicleNo) {
        const vNo = vehicleNo.trim().toUpperCase();
        list = list.filter((s)=>s.vehicleNo.toUpperCase() === vNo);
    }
    list.sort((a, b)=>new Date(b.serviceDate) - new Date(a.serviceDate));
    return list.map((s)=>({
            ...s,
            id: s._id || s.id
        }));
}
async function createServiceRecord(data) {
    const cleanData = {
        ...data,
        vehicleNo: data.vehicleNo.trim().toUpperCase(),
        invoiceNo: data.invoiceNo || `INV-N${Math.floor(8000 + Math.random() * 1999)}`,
        serviceDate: data.serviceDate || new Date().toISOString().split('T')[0],
        serviceTime: data.serviceTime || new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }),
        meterReading: Number(data.meterReading) || 0,
        partsTotal: Number(data.partsTotal) || 0,
        jobTotal: Number(data.jobTotal) || 0,
        totalAmount: Number(data.totalAmount) || 0,
        discountPercent: Number(data.discountPercent) || 0,
        totalDis: Number(data.totalDis) || 0,
        grandTotal: Number(data.grandTotal) || 0,
        billTotal: Number(data.billTotal) || Number(data.grandTotal) || 0,
        nextServiceMeter: Number(data.nextServiceMeter) || Number(data.meterReading) + 5000
    };
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(cleanData);
            return {
                ...doc.toObject(),
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for createServiceRecord:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockServices"])();
    const newObj = {
        _id: 'srv_' + Date.now(),
        id: 'srv_' + Date.now(),
        ...cleanData,
        createdAt: new Date().toISOString()
    };
    list.unshift(newObj);
    return newObj;
}
async function deleteServiceRecord(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
            return true;
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteServiceRecord:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockServices"])();
    const idx = list.findIndex((s)=>s._id === id || s.id === id || s.invoiceNo === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        return true;
    }
    return false;
}
async function getSuppliers() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                supplierName: 1
            }).lean();
            if (docs.length === 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockSuppliers"].map(({ _id, ...rest })=>rest));
                docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                    supplierName: 1
                }).lean();
            }
            return docs.map((d)=>({
                    ...d,
                    id: d._id.toString()
                }));
        }
    } catch (err) {
        console.warn('Fallback to memory for getSuppliers:', err.message);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSuppliers"])().map((s)=>({
            ...s,
            id: s._id || s.id
        }));
}
async function createSupplier(data) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(data);
            return {
                ...doc.toObject(),
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for createSupplier:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSuppliers"])();
    const newObj = {
        _id: 'sup_' + Date.now(),
        id: 'sup_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString()
    };
    list.push(newObj);
    return newObj;
}
// Helper: Calculate Due Date & Overdue Status dynamically
function calculateOverdueMetrics(inv) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(inv.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let status = 'ONGOING';
    let daysToDue = diffDays;
    let daysOverdue = 0;
    if (Number(inv.balance) <= 0) {
        status = 'PAID';
        daysToDue = 0;
    } else if (diffDays < 0) {
        status = 'OVERDUE';
        daysOverdue = Math.abs(diffDays);
    }
    return {
        ...inv,
        status,
        daysToDue,
        daysOverdue
    };
}
async function getSupplierInvoices() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                dueDate: 1
            }).lean();
            if (docs.length === 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockSupplierInvoices"].map(({ _id, ...rest })=>rest));
                docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                    dueDate: 1
                }).lean();
            }
            return docs.map((d)=>calculateOverdueMetrics({
                    ...d,
                    id: d._id.toString()
                }));
        }
    } catch (err) {
        console.warn('Fallback to memory for getSupplierInvoices:', err.message);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSupplierInvoices"])().map((inv)=>calculateOverdueMetrics({
            ...inv,
            id: inv._id || inv.id
        }));
}
async function createSupplierInvoice(data) {
    // Auto-calculate Due Date if not supplied: invoiceDate + creditDays
    let dueDate = data.dueDate;
    if (!dueDate && data.invoiceDate && data.creditDays) {
        const invDate = new Date(data.invoiceDate);
        invDate.setDate(invDate.getDate() + Number(data.creditDays));
        dueDate = invDate.toISOString().split('T')[0];
    }
    const invoiceAmount = Number(data.invoiceAmount) || 0;
    const amountPaid = Number(data.amountPaid) || 0;
    const balance = Math.max(0, invoiceAmount - amountPaid);
    const cleanData = {
        ...data,
        invoiceId: data.invoiceId || String(210 + Math.floor(Math.random() * 80)),
        invoiceAmount,
        amountPaid,
        balance,
        dueDate: dueDate || data.invoiceDate,
        payments: data.payments || []
    };
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(cleanData);
            return calculateOverdueMetrics({
                ...doc.toObject(),
                id: doc._id.toString()
            });
        }
    } catch (err) {
        console.warn('Fallback to memory for createSupplierInvoice:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSupplierInvoices"])();
    const newObj = calculateOverdueMetrics({
        _id: 'sinv_' + Date.now(),
        id: 'sinv_' + Date.now(),
        ...cleanData,
        createdAt: new Date().toISOString()
    });
    list.unshift(newObj);
    return newObj;
}
async function recordSupplierPayment(invoiceId, paymentData) {
    const amount = Number(paymentData.amount) || 0;
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const inv = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                $or: [
                    {
                        _id: invoiceId
                    },
                    {
                        invoiceId: invoiceId
                    }
                ]
            });
            if (inv) {
                const newPaid = Number(inv.amountPaid || 0) + amount;
                const newBalance = Math.max(0, Number(inv.invoiceAmount || 0) - newPaid);
                inv.amountPaid = newPaid;
                inv.balance = newBalance;
                inv.status = newBalance <= 0 ? 'PAID' : new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING';
                inv.payments.push({
                    paymentId: paymentData.paymentId || `P${Math.floor(190 + Math.random() * 50)}`,
                    paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
                    amount,
                    method: paymentData.method || 'Cheque',
                    chequeNo: paymentData.chequeNo || '',
                    chequeIssueDate: paymentData.chequeIssueDate || paymentData.paymentDate || '',
                    chequeStatus: paymentData.chequeStatus || 'Issued',
                    clearedDate: paymentData.clearedDate || '',
                    bankAccount: paymentData.bankAccount || '',
                    notes: paymentData.notes || ''
                });
                await inv.save();
                return calculateOverdueMetrics({
                    ...inv.toObject(),
                    id: inv._id.toString()
                });
            }
        }
    } catch (err) {
        console.warn('Fallback to memory for recordSupplierPayment:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSupplierInvoices"])();
    const found = list.find((i)=>i._id === invoiceId || i.id === invoiceId || i.invoiceId === invoiceId);
    if (found) {
        found.amountPaid = Number(found.amountPaid || 0) + amount;
        found.balance = Math.max(0, Number(found.invoiceAmount || 0) - found.amountPaid);
        found.payments = found.payments || [];
        found.payments.push({
            paymentId: paymentData.paymentId || `P${Math.floor(190 + Math.random() * 50)}`,
            paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
            amount,
            method: paymentData.method || 'Cheque',
            chequeNo: paymentData.chequeNo || '',
            chequeIssueDate: paymentData.chequeIssueDate || paymentData.paymentDate || '',
            chequeStatus: paymentData.chequeStatus || 'Issued',
            clearedDate: paymentData.clearedDate || '',
            bankAccount: paymentData.bankAccount || '',
            notes: paymentData.notes || ''
        });
        return calculateOverdueMetrics(found);
    }
    return null;
}
}),
"[project]/src/lib/mockStore.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMockItems",
    ()=>getMockItems,
    "getMockServices",
    ()=>getMockServices,
    "getMockSupplierInvoices",
    ()=>getMockSupplierInvoices,
    "getMockSuppliers",
    ()=>getMockSuppliers,
    "getMockVehicles",
    ()=>getMockVehicles,
    "mockItems",
    ()=>mockItems,
    "mockServices",
    ()=>mockServices,
    "mockSupplierInvoices",
    ()=>mockSupplierInvoices,
    "mockSuppliers",
    ()=>mockSuppliers,
    "mockVehicles",
    ()=>mockVehicles
]);
const mockSuppliers = [
    {
        _id: 'sup_01',
        supplierName: 'Freshline Auto',
        contactPerson: 'Nimal Bandara',
        telephone: '011-2891234',
        email: 'sales@freshlineauto.lk',
        address: '45 Panchikawatta Rd, Colombo 10',
        defaultCreditDays: 30,
        suppliedCategories: [
            'Filters',
            'Spare Parts'
        ]
    },
    {
        _id: 'sup_02',
        supplierName: 'Dash-Air Freshner',
        contactPerson: 'Priyantha',
        telephone: '077-3344556',
        email: 'orders@dashair.lk',
        address: '12 Kandy Rd, Kelaniya',
        defaultCreditDays: 30,
        suppliedCategories: [
            'Air Freshners',
            'Car Care'
        ]
    },
    {
        _id: 'sup_03',
        supplierName: 'Shell Lubricants',
        contactPerson: 'Rohan Silva',
        telephone: '011-4567890',
        email: 'lubes@shell.lk',
        address: '88 Union Place, Colombo 02',
        defaultCreditDays: 60,
        suppliedCategories: [
            'Oils',
            'Lubricants',
            'Fluids'
        ]
    },
    {
        _id: 'sup_04',
        supplierName: 'Petromin',
        contactPerson: 'Ashen Perera',
        telephone: '071-2233445',
        email: 'sales@petromin.lk',
        address: '102 Baseline Rd, Colombo 09',
        defaultCreditDays: 90,
        suppliedCategories: [
            'Synthetic Oils',
            'Transmission Fluids'
        ]
    },
    {
        _id: 'sup_05',
        supplierName: 'Caltex (Chevron)',
        contactPerson: 'Dhammika',
        telephone: '011-7890123',
        email: 'inquiries@caltex.lk',
        address: 'Chevron House, Colombo 03',
        defaultCreditDays: 30,
        suppliedCategories: [
            'Engine Oils',
            'Brake Fluids',
            'Coolants'
        ]
    },
    {
        _id: 'sup_06',
        supplierName: 'Vindya Chemical',
        contactPerson: 'Vindya',
        telephone: '076-8899001',
        email: 'info@vindyachemical.lk',
        address: '18 Industrial Zone, Ekala',
        defaultCreditDays: 30,
        suppliedCategories: [
            'Chemicals',
            'Wash Shampoos'
        ]
    },
    {
        _id: 'sup_07',
        supplierName: 'Mobil Lubricants',
        contactPerson: 'Sunil',
        telephone: '011-3456789',
        email: 'mobil@mclarens.lk',
        address: 'McLarens Bldg, Colombo 03',
        defaultCreditDays: 30,
        suppliedCategories: [
            'Mobil 1',
            'Synthetic Oils'
        ]
    }
];
const mockSupplierInvoices = [
    {
        _id: 'sinv_198',
        invoiceId: '198',
        supplierName: 'Freshline Auto',
        invoiceNo: '285',
        poGrnNo: 'ACSC199',
        receivedDate: '2026-10-13',
        invoiceDate: '2026-10-13',
        invoiceAmount: 14400.00,
        creditDays: 30,
        dueDate: '2026-11-12',
        amountPaid: 0.00,
        balance: 14400.00,
        status: 'OVERDUE',
        items: [
            {
                itemCode: 'FLT-AIR-01',
                description: 'ENGINE AIR CLEANER FILTER',
                quantity: 4,
                unitPrice: 3600,
                total: 14400
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_199',
        invoiceId: '199',
        supplierName: 'Dash-Air Freshner',
        invoiceNo: '2836',
        poGrnNo: 'ACSC200',
        receivedDate: '2026-09-09',
        invoiceDate: '2026-09-09',
        invoiceAmount: 2543.00,
        creditDays: 30,
        dueDate: '2026-10-09',
        amountPaid: 0.00,
        balance: 2543.00,
        status: 'OVERDUE',
        items: [
            {
                itemCode: 'DSH-FRSH-01',
                description: 'Dash Organic Can Air Freshner',
                quantity: 5,
                unitPrice: 508.60,
                total: 2543
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_200',
        invoiceId: '200',
        supplierName: 'Shell Lubricants',
        invoiceNo: '1613',
        poGrnNo: 'ACSC201',
        receivedDate: '2026-10-07',
        invoiceDate: '2026-10-12',
        invoiceAmount: 134748.55,
        creditDays: 60,
        dueDate: '2026-12-11',
        amountPaid: 0.00,
        balance: 134748.55,
        status: 'ONGOING',
        items: [
            {
                itemCode: 'SHL-HX8-4L',
                description: 'Shell Helix Ultra 5W-40 (4L Drum)',
                quantity: 8,
                unitPrice: 16843.56,
                total: 134748.55
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_201',
        invoiceId: '201',
        supplierName: 'Petromin',
        invoiceNo: 'PETG011541',
        poGrnNo: 'ACSC202',
        receivedDate: '2026-10-04',
        invoiceDate: '2026-10-04',
        invoiceAmount: 33750.00,
        creditDays: 60,
        dueDate: '2026-12-03',
        amountPaid: 0.00,
        balance: 33750.00,
        status: 'ONGOING',
        items: [
            {
                itemCode: 'PET-ATF-4L',
                description: 'Petromin ATF Multi-Vehicle (4L)',
                quantity: 3,
                unitPrice: 11250,
                total: 33750
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_202',
        invoiceId: '202',
        supplierName: 'Caltex (Chevron)',
        invoiceNo: 'INGAL010935',
        poGrnNo: 'ACSC203',
        receivedDate: '2026-10-07',
        invoiceDate: '2026-10-07',
        invoiceAmount: 86757.51,
        creditDays: 30,
        dueDate: '2026-11-06',
        amountPaid: 0.00,
        balance: 86757.51,
        status: 'OVERDUE',
        items: [
            {
                itemCode: 'CTX-SYN-4L',
                description: 'Caltex Havoline ProDS 5W-30 (4L)',
                quantity: 6,
                unitPrice: 14459.58,
                total: 86757.51
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_203',
        invoiceId: '203',
        supplierName: 'Vindya Chemical',
        invoiceNo: '18258',
        poGrnNo: 'ACSC204',
        receivedDate: '2026-10-19',
        invoiceDate: '2026-10-19',
        invoiceAmount: 18500.00,
        creditDays: 30,
        dueDate: '2026-11-18',
        amountPaid: 0.00,
        balance: 18500.00,
        status: 'OVERDUE',
        items: [
            {
                itemCode: 'VND-WSH-20L',
                description: 'High Foam Car Wash Shampoo (20L Can)',
                quantity: 2,
                unitPrice: 9250,
                total: 18500
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_204',
        invoiceId: '204',
        supplierName: 'Petromin',
        invoiceNo: 'PETG01557',
        poGrnNo: 'ACSC205',
        receivedDate: '2026-10-22',
        invoiceDate: '2026-10-19',
        invoiceAmount: 106200.00,
        creditDays: 90,
        dueDate: '2027-01-17',
        amountPaid: 0.00,
        balance: 106200.00,
        status: 'ONGOING',
        items: [
            {
                itemCode: 'PET-0W20-4L',
                description: 'Petromin Supersyn 0W-20 (4L Pack of 6)',
                quantity: 6,
                unitPrice: 17700,
                total: 106200
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_205',
        invoiceId: '205',
        supplierName: 'Dash-Air Freshner',
        invoiceNo: '3265',
        poGrnNo: 'ACSC206',
        receivedDate: '2026-10-21',
        invoiceDate: '2026-10-19',
        invoiceAmount: 6284.00,
        creditDays: 30,
        dueDate: '2026-11-18',
        amountPaid: 0.00,
        balance: 6284.00,
        status: 'OVERDUE',
        items: [
            {
                itemCode: 'DSH-GEL-02',
                description: 'Dash Aroma Air Freshener Gel Canister',
                quantity: 8,
                unitPrice: 785.50,
                total: 6284
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_206',
        invoiceId: '206',
        supplierName: 'Caltex (Chevron)',
        invoiceNo: '223',
        poGrnNo: 'ACSC207',
        receivedDate: '2026-10-23',
        invoiceDate: '2026-10-23',
        invoiceAmount: 93331.50,
        creditDays: 30,
        dueDate: '2026-11-22',
        amountPaid: 0.00,
        balance: 93331.50,
        status: 'OVERDUE',
        items: [
            {
                itemCode: 'CTX-DEL-15W',
                description: 'Caltex Delo 400 15W-40 (5L)',
                quantity: 9,
                unitPrice: 10370.16,
                total: 93331.50
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_207',
        invoiceId: '207',
        supplierName: 'Petromin',
        invoiceNo: 'PETGO1564',
        poGrnNo: 'ACSC208',
        receivedDate: '2026-10-23',
        invoiceDate: '2026-10-22',
        invoiceAmount: 110985.00,
        creditDays: 90,
        dueDate: '2027-01-20',
        amountPaid: 0.00,
        balance: 110985.00,
        status: 'ONGOING',
        items: [
            {
                itemCode: 'PET-GEAR-4L',
                description: 'Petromin Gear Oil GL-5 80W-90 (4L)',
                quantity: 15,
                unitPrice: 7399,
                total: 110985
            }
        ],
        payments: []
    },
    {
        _id: 'sinv_208',
        invoiceId: '208',
        supplierName: 'Petromin',
        invoiceNo: 'NAT/3812',
        poGrnNo: 'ACSC209',
        receivedDate: '2026-10-22',
        invoiceDate: '2026-10-22',
        invoiceAmount: 42500.00,
        creditDays: 90,
        dueDate: '2027-01-20',
        amountPaid: 0.00,
        balance: 42500.00,
        status: 'ONGOING',
        items: [
            {
                itemCode: 'GB-FLT-01',
                description: 'GEAR BOX OIL FILTER',
                quantity: 5,
                unitPrice: 8500,
                total: 42500
            }
        ],
        payments: []
    }
];
const mockItems = [
    {
        _id: 'itm_01',
        itemCode: 'GB-FLT-01',
        barcode: '8801928371',
        description: 'GEAR BOX OIL FILTER',
        qtyOnHand: 18,
        sellingPrice: 8500,
        category: 'Filters'
    },
    {
        _id: 'itm_02',
        itemCode: 'OIL-SYN-4L',
        barcode: '8801928372',
        description: 'TOYOTA 0W-20 FULL SYNTHETIC (4L)',
        qtyOnHand: 34,
        sellingPrice: 19500,
        category: 'Oils'
    },
    {
        _id: 'itm_03',
        itemCode: 'FLT-ENG-02',
        barcode: '8801928373',
        description: 'GENUINE OIL FILTER 90915-10003',
        qtyOnHand: 45,
        sellingPrice: 3400,
        category: 'Filters'
    },
    {
        _id: 'itm_04',
        itemCode: 'FLT-AIR-01',
        barcode: '8801928374',
        description: 'ENGINE AIR CLEANER FILTER',
        qtyOnHand: 22,
        sellingPrice: 4200,
        category: 'Filters'
    },
    {
        _id: 'itm_05',
        itemCode: 'BRK-PAD-FR',
        barcode: '8801928375',
        description: 'FRONT CERAMIC BRAKE PADS SET',
        qtyOnHand: 12,
        sellingPrice: 22500,
        category: 'Brakes'
    },
    {
        _id: 'itm_06',
        itemCode: 'FLD-BRK-1L',
        barcode: '8801928376',
        description: 'BRAKE FLUID DOT 4 (1L)',
        qtyOnHand: 29,
        sellingPrice: 4500,
        category: 'Fluids'
    },
    {
        _id: 'itm_07',
        itemCode: 'SPK-IRID-4',
        barcode: '8801928377',
        description: 'DENSO IRIDIUM SPARK PLUGS (SET OF 4)',
        qtyOnHand: 15,
        sellingPrice: 16000,
        category: 'Ignition'
    }
];
const mockVehicles = [
    {
        _id: 'veh_01',
        rNo: 'R-001',
        vehicleNo: 'WP CAB-4521',
        tagNo: 'TAG-101',
        csName: 'Kamal Perera',
        address: 'No 45/2, Galle Road, Colombo 03',
        mobileTel: '077-1234567',
        homeTel: '011-2345678',
        officeTel: '011-2987654',
        city: 'Colombo',
        csStatus: 'VIP',
        vType: 'Car',
        vModel: 'Toyota Prius',
        colour: 'Pearl White',
        engineNo: '2ZR-FXE-892144',
        chassisNo: 'ZVW50-0192842',
        birthDay: '1985-06-14',
        deliveryDate: '2026-11-26',
        createdAt: new Date('2026-11-20').toISOString()
    },
    {
        _id: 'veh_02',
        rNo: 'R-002',
        vehicleNo: 'WP CBA-8890',
        tagNo: 'TAG-102',
        csName: 'Sunil Fernando',
        address: '12 Temple Lane, Kandy',
        mobileTel: '071-8765432',
        homeTel: '081-2233445',
        officeTel: '081-4455667',
        city: 'Kandy',
        csStatus: 'Regular',
        vType: 'SUV',
        vModel: 'Honda Vezel',
        colour: 'Metallic Black',
        engineNo: 'LEB-H1-452890',
        chassisNo: 'RU3-1209384',
        birthDay: '1979-11-22',
        deliveryDate: '2026-11-25',
        createdAt: new Date('2026-11-21').toISOString()
    },
    {
        _id: 'veh_03',
        rNo: 'R-003',
        vehicleNo: 'SP CAR-3312',
        tagNo: 'TAG-103',
        csName: 'Nimal Jayawardena',
        address: '78 High Level Road, Maharagama',
        mobileTel: '076-5544332',
        homeTel: '011-4567890',
        officeTel: '',
        city: 'Maharagama',
        csStatus: 'Regular',
        vType: 'Van',
        vModel: 'Toyota KDH',
        colour: 'Silver',
        engineNo: '1KD-FTV-334120',
        chassisNo: 'KDH201-0045129',
        birthDay: '1990-03-08',
        deliveryDate: '2026-11-27',
        createdAt: new Date('2026-11-22').toISOString()
    }
];
const mockServices = [
    {
        _id: 'srv_01',
        invoiceNo: 'INV-N8598',
        vehicleNo: 'WP CAB-4521',
        customerType: 'VIP',
        csName: 'Kamal Perera',
        csAddress: 'No 45/2, Galle Road, Colombo 03',
        telephone: '077-1234567',
        city: 'Colombo',
        vModel: 'Toyota Prius',
        engineNo: '2ZR-FXE-892144',
        chassisNo: 'ZVW50-0192842',
        jobDetails: 'Full periodic maintenance, engine oil & filter replacement, brake inspection',
        meterReading: 45200,
        jobDone: 'Completed',
        serviceDate: '2026-05-14',
        serviceTime: '10:45 AM',
        billingType: 'Normal',
        partsTotal: 22900,
        jobTotal: 6500,
        totalAmount: 29400,
        discountPercent: 0,
        totalDis: 1000,
        grandTotal: 28400,
        vat: 0,
        nbt: 0,
        billTotal: 28400,
        paymentType: 'CASH',
        nextServiceDate: '2026-11-14',
        nextServiceMeter: 50200,
        status: 'Invoiced',
        items: [
            {
                no: 1,
                code: 'OIL-SYN-4L',
                description: 'TOYOTA 0W-20 FULL SYNTHETIC (4L)',
                qty: 1,
                rate: 19500,
                dis: 0,
                amount: 19500,
                itemType: 'item'
            },
            {
                no: 2,
                code: 'FLT-ENG-02',
                description: 'GENUINE OIL FILTER 90915-10003',
                qty: 1,
                rate: 3400,
                dis: 0,
                amount: 3400,
                itemType: 'item'
            },
            {
                no: 3,
                code: 'JOB-SRV-01',
                description: 'Full Service Labor & 25-Point Safety Inspection',
                qty: 1,
                rate: 6500,
                dis: 0,
                amount: 6500,
                itemType: 'job'
            }
        ]
    },
    {
        _id: 'srv_02',
        invoiceNo: 'INV-N8640',
        vehicleNo: 'WP CAB-4521',
        customerType: 'VIP',
        csName: 'Kamal Perera',
        csAddress: 'No 45/2, Galle Road, Colombo 03',
        telephone: '077-1234567',
        city: 'Colombo',
        vModel: 'Toyota Prius',
        engineNo: '2ZR-FXE-892144',
        chassisNo: 'ZVW50-0192842',
        jobDetails: 'Gear box oil filter replacement & transmission service',
        meterReading: 50350,
        jobDone: 'Completed',
        serviceDate: '2026-11-18',
        serviceTime: '02:30 PM',
        billingType: 'Normal',
        partsTotal: 8500,
        jobTotal: 4500,
        totalAmount: 13000,
        discountPercent: 0,
        totalDis: 500,
        grandTotal: 12500,
        vat: 0,
        nbt: 0,
        billTotal: 12500,
        paymentType: 'CASH',
        nextServiceDate: '2027-05-18',
        nextServiceMeter: 55350,
        status: 'Invoiced',
        items: [
            {
                no: 1,
                code: 'GB-FLT-01',
                description: 'GEAR BOX OIL FILTER',
                qty: 1,
                rate: 8500,
                dis: 0,
                amount: 8500,
                itemType: 'item'
            },
            {
                no: 2,
                code: 'JOB-TRN-01',
                description: 'Gearbox Fluid Flushing & Filter Replacement Labor',
                qty: 1,
                rate: 4500,
                dis: 0,
                amount: 4500,
                itemType: 'job'
            }
        ]
    }
];
/*TURBOPACK member replacement*/ __turbopack_context__.g._mockSuppliers = /*TURBOPACK member replacement*/ __turbopack_context__.g._mockSuppliers || [
    ...mockSuppliers
];
/*TURBOPACK member replacement*/ __turbopack_context__.g._mockSupplierInvoices = /*TURBOPACK member replacement*/ __turbopack_context__.g._mockSupplierInvoices || [
    ...mockSupplierInvoices
];
/*TURBOPACK member replacement*/ __turbopack_context__.g._mockItems = /*TURBOPACK member replacement*/ __turbopack_context__.g._mockItems || [
    ...mockItems
];
/*TURBOPACK member replacement*/ __turbopack_context__.g._mockVehicles = /*TURBOPACK member replacement*/ __turbopack_context__.g._mockVehicles || [
    ...mockVehicles
];
/*TURBOPACK member replacement*/ __turbopack_context__.g._mockServices = /*TURBOPACK member replacement*/ __turbopack_context__.g._mockServices || [
    ...mockServices
];
function getMockSuppliers() {
    return /*TURBOPACK member replacement*/ __turbopack_context__.g._mockSuppliers;
}
function getMockSupplierInvoices() {
    return /*TURBOPACK member replacement*/ __turbopack_context__.g._mockSupplierInvoices;
}
function getMockItems() {
    return /*TURBOPACK member replacement*/ __turbopack_context__.g._mockItems;
}
function getMockVehicles() {
    return /*TURBOPACK member replacement*/ __turbopack_context__.g._mockVehicles;
}
function getMockServices() {
    return /*TURBOPACK member replacement*/ __turbopack_context__.g._mockServices;
}
}),
"[project]/src/lib/mongodb.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "isDbConnected",
    ()=>isDbConnected
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/service_center_db';
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null,
        isConnected: false
    };
}
async function connectToDatabase() {
    if (cached.conn) {
        cached.isConnected = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState === 1;
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 2000
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongooseInstance)=>{
            cached.isConnected = true;
            console.log('[MongoDB] Connected successfully');
            return mongooseInstance;
        }).catch((err)=>{
            cached.promise = null;
            cached.isConnected = false;
            console.log('[MongoDB] Note: Local/Remote MongoDB not responding (using standby memory mode):', err.message);
            return null;
        });
    }
    try {
        cached.conn = await cached.promise;
        cached.isConnected = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState === 1;
    } catch (e) {
        cached.promise = null;
        cached.conn = null;
        cached.isConnected = false;
    }
    return cached.conn;
}
function isDbConnected() {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState === 1;
}
}),
"[project]/src/models/Item.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const ItemSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    itemCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    barcode: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    qtyOnHand: {
        type: Number,
        default: 0
    },
    sellingPrice: {
        type: Number,
        default: 0
    },
    costPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Item || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Item', ItemSchema);
}),
"[project]/src/models/ServiceRecord.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const ServiceItemSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    no: {
        type: Number,
        default: 1
    },
    code: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        default: 1
    },
    rate: {
        type: Number,
        default: 0
    },
    dis: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    itemType: {
        type: String,
        default: 'item',
        enum: [
            'item',
            'job'
        ]
    }
}, {
    _id: false
});
const ServiceRecordSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    invoiceNo: {
        type: String,
        required: true,
        trim: true
    },
    vehicleNo: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        index: true
    },
    customerType: {
        type: String,
        default: 'Regular'
    },
    csName: {
        type: String,
        default: ''
    },
    csAddress: {
        type: String,
        default: ''
    },
    telephone: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    vModel: {
        type: String,
        default: ''
    },
    engineNo: {
        type: String,
        default: ''
    },
    chassisNo: {
        type: String,
        default: ''
    },
    jobDetails: {
        type: String,
        default: ''
    },
    meterReading: {
        type: Number,
        required: true,
        default: 0
    },
    jobDone: {
        type: String,
        default: 'Completed'
    },
    serviceDate: {
        type: String,
        required: true
    },
    serviceTime: {
        type: String,
        default: ''
    },
    billingType: {
        type: String,
        default: 'Normal'
    },
    partsTotal: {
        type: Number,
        default: 0
    },
    jobTotal: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    totalDis: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        default: 0
    },
    vat: {
        type: Number,
        default: 0
    },
    nbt: {
        type: Number,
        default: 0
    },
    billTotal: {
        type: Number,
        default: 0
    },
    paymentType: {
        type: String,
        default: 'CASH'
    },
    nextServiceDate: {
        type: String,
        default: ''
    },
    nextServiceMeter: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Invoiced'
    },
    items: [
        ServiceItemSchema
    ]
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.ServiceRecord || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('ServiceRecord', ServiceRecordSchema);
}),
"[project]/src/models/Supplier.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const SupplierSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    supplierName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    contactPerson: {
        type: String,
        default: '',
        trim: true
    },
    telephone: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true
    },
    address: {
        type: String,
        default: '',
        trim: true
    },
    defaultCreditDays: {
        type: Number,
        default: 30
    },
    suppliedCategories: [
        {
            type: String
        }
    ],
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Supplier || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Supplier', SupplierSchema);
}),
"[project]/src/models/SupplierInvoice.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const SupplierPaymentSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    paymentId: {
        type: String,
        required: true
    },
    paymentDate: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        default: 'Cheque',
        enum: [
            'Cheque',
            'Cash',
            'Bank Transfer'
        ]
    },
    chequeNo: {
        type: String,
        default: ''
    },
    chequeIssueDate: {
        type: String,
        default: ''
    },
    chequeStatus: {
        type: String,
        default: 'Issued',
        enum: [
            'Issued',
            'Cleared',
            'Bounced'
        ]
    },
    clearedDate: {
        type: String,
        default: ''
    },
    bankAccount: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    _id: false
});
const SupplierInvoiceItemSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    itemCode: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
}, {
    _id: false
});
const SupplierInvoiceSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    invoiceId: {
        type: String,
        required: true,
        trim: true
    },
    supplierName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    invoiceNo: {
        type: String,
        required: true,
        trim: true
    },
    poGrnNo: {
        type: String,
        default: '',
        trim: true
    },
    receivedDate: {
        type: String,
        required: true
    },
    invoiceDate: {
        type: String,
        required: true
    },
    invoiceAmount: {
        type: Number,
        required: true,
        default: 0
    },
    creditDays: {
        type: Number,
        default: 30
    },
    dueDate: {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'ONGOING',
        enum: [
            'ONGOING',
            'OVERDUE',
            'PAID'
        ]
    },
    items: [
        SupplierInvoiceItemSchema
    ],
    payments: [
        SupplierPaymentSchema
    ],
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.SupplierInvoice || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('SupplierInvoice', SupplierInvoiceSchema);
}),
"[project]/src/models/Vehicle.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const VehicleSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    rNo: {
        type: String,
        required: true,
        trim: true
    },
    vehicleNo: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    tagNo: {
        type: String,
        default: '',
        trim: true
    },
    csName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        default: '',
        trim: true
    },
    mobileTel: {
        type: String,
        default: '',
        trim: true
    },
    homeTel: {
        type: String,
        default: '',
        trim: true
    },
    officeTel: {
        type: String,
        default: '',
        trim: true
    },
    city: {
        type: String,
        default: 'Colombo',
        trim: true
    },
    csStatus: {
        type: String,
        default: 'Regular',
        trim: true
    },
    vType: {
        type: String,
        default: 'Car',
        trim: true
    },
    vModel: {
        type: String,
        default: 'Toyota Prius',
        trim: true
    },
    colour: {
        type: String,
        default: 'Pearl White',
        trim: true
    },
    engineNo: {
        type: String,
        default: '',
        trim: true
    },
    chassisNo: {
        type: String,
        default: '',
        trim: true
    },
    birthDay: {
        type: String,
        default: ''
    },
    deliveryDate: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Vehicle || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Vehicle', VehicleSchema);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1b-r-xkv_1isn._.js.map