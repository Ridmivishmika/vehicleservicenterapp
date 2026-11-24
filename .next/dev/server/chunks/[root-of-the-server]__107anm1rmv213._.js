module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

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
"[project]/src/app/api/vehicles/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dataStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dataStore.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('q');
        let vehicles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dataStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVehicles"])();
        if (search) {
            const q = search.toLowerCase();
            vehicles = vehicles.filter((v)=>v.vehicleNo && v.vehicleNo.toLowerCase().includes(q) || v.csName && v.csName.toLowerCase().includes(q) || v.tagNo && v.tagNo.toLowerCase().includes(q) || v.vModel && v.vModel.toLowerCase().includes(q) || v.city && v.city.toLowerCase().includes(q));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            database: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])() ? 'mongodb' : 'standby_cache',
            data: vehicles
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
        if (!body.vehicleNo || !body.csName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Vehicle Number and Customer Name are required.'
            }, {
                status: 400
            });
        }
        const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dataStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createVehicle"])(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            database: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])() ? 'mongodb' : 'standby_cache',
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
    "createExpense",
    ()=>createExpense,
    "createItem",
    ()=>createItem,
    "createJob",
    ()=>createJob,
    "createServiceRecord",
    ()=>createServiceRecord,
    "createSupplier",
    ()=>createSupplier,
    "createSupplierInvoice",
    ()=>createSupplierInvoice,
    "createVehicle",
    ()=>createVehicle,
    "deleteExpense",
    ()=>deleteExpense,
    "deleteItem",
    ()=>deleteItem,
    "deleteJob",
    ()=>deleteJob,
    "deleteServiceRecord",
    ()=>deleteServiceRecord,
    "deleteSupplier",
    ()=>deleteSupplier,
    "deleteSupplierInvoice",
    ()=>deleteSupplierInvoice,
    "deleteSupplierPayment",
    ()=>deleteSupplierPayment,
    "deleteVehicle",
    ()=>deleteVehicle,
    "generateUniqueId",
    ()=>generateUniqueId,
    "getExpenses",
    ()=>getExpenses,
    "getFinancialAnalytics",
    ()=>getFinancialAnalytics,
    "getItems",
    ()=>getItems,
    "getJobs",
    ()=>getJobs,
    "getServiceRecordById",
    ()=>getServiceRecordById,
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
    "updateExpense",
    ()=>updateExpense,
    "updateItem",
    ()=>updateItem,
    "updateJob",
    ()=>updateJob,
    "updateServiceRecord",
    ()=>updateServiceRecord,
    "updateSupplier",
    ()=>updateSupplier,
    "updateSupplierInvoice",
    ()=>updateSupplierInvoice,
    "updateSupplierPayment",
    ()=>updateSupplierPayment,
    "updateVehicle",
    ()=>updateVehicle
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Vehicle.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Item.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ServiceRecord.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Supplier.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/SupplierInvoice.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Expense$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Expense.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Job$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Job.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockStore.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
let idCounter = 0;
function generateUniqueId(prefix = 'id') {
    idCounter = (idCounter + 1) % 100000;
    return `${prefix}_${Date.now()}_${idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}
async function getVehicles() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Vehicle$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                createdAt: -1
            }).lean();
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
    const uid = generateUniqueId('veh');
    const newObj = {
        _id: uid,
        id: uid,
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
            const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                itemCode: 1
            }).lean();
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
async function createItem(data) {
    const cleanData = {
        itemCode: (data.itemCode || `ITM-${String(Date.now()).slice(-4)}`).trim().toUpperCase(),
        barcode: (data.barcode || '').trim(),
        description: (data.description || '').trim(),
        supplierName: (data.supplierName || '').trim(),
        category: (data.category || 'General').trim(),
        qtyOnHand: Number(data.qtyOnHand) || 0,
        costPrice: Number(data.costPrice) || 0,
        sellingPrice: Number(data.sellingPrice) || 0
    };
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(cleanData);
            return {
                ...doc.toObject(),
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for createItem:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockItems"])();
    const uid = generateUniqueId('itm');
    const newObj = {
        _id: uid,
        id: uid,
        ...cleanData,
        createdAt: new Date().toISOString()
    };
    list.push(newObj);
    return newObj;
}
async function updateItem(id, data) {
    if (data.itemCode) data.itemCode = data.itemCode.trim().toUpperCase();
    if (data.qtyOnHand !== undefined) data.qtyOnHand = Number(data.qtyOnHand);
    if (data.costPrice !== undefined) data.costPrice = Number(data.costPrice);
    if (data.sellingPrice !== undefined) data.sellingPrice = Number(data.sellingPrice);
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, data, {
                new: true
            }).lean();
            if (doc) return {
                ...doc,
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for updateItem:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockItems"])();
    const idx = list.findIndex((i)=>i._id === id || i.id === id || i.itemCode === id);
    if (idx !== -1) {
        list[idx] = {
            ...list[idx],
            ...data,
            updatedAt: new Date().toISOString()
        };
        return list[idx];
    }
    return null;
}
async function deleteItem(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
            return true;
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteItem:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockItems"])();
    const idx = list.findIndex((i)=>i._id === id || i.id === id || i.itemCode === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        return true;
    }
    return false;
}
async function getServicesByVehicleNo(vehicleNo) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let query = {};
            if (vehicleNo) {
                query.vehicleNo = vehicleNo.trim().toUpperCase();
            }
            const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).sort({
                serviceDate: -1,
                createdAt: -1
            }).lean();
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
async function getServiceRecordById(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let doc = null;
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Types.ObjectId.isValid(id)) {
                doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id).lean();
            }
            if (!doc) {
                doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                    $or: [
                        {
                            invoiceNo: id
                        },
                        {
                            serviceNo: id
                        },
                        {
                            _id: id
                        }
                    ]
                }).lean();
            }
            if (doc) return {
                ...doc,
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for getServiceRecordById:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockServices"])();
    const found = list.find((s)=>s._id === id || s.id === id || s.invoiceNo === id || s.serviceNo === id);
    return found ? {
        ...found,
        id: found._id || found.id
    } : null;
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
    const uid = generateUniqueId('srv');
    const newObj = {
        _id: uid,
        id: uid,
        ...cleanData,
        createdAt: new Date().toISOString()
    };
    list.unshift(newObj);
    return newObj;
}
async function updateServiceRecord(id, data) {
    const cleanData = {
        ...data
    };
    if (cleanData.vehicleNo) cleanData.vehicleNo = cleanData.vehicleNo.trim().toUpperCase();
    if (cleanData.partsTotal !== undefined) cleanData.partsTotal = Number(cleanData.partsTotal) || 0;
    if (cleanData.jobTotal !== undefined) cleanData.jobTotal = Number(cleanData.jobTotal) || 0;
    if (cleanData.totalAmount !== undefined) cleanData.totalAmount = Number(cleanData.totalAmount) || 0;
    if (cleanData.grandTotal !== undefined) cleanData.grandTotal = Number(cleanData.grandTotal) || 0;
    if (cleanData.billTotal !== undefined) cleanData.billTotal = Number(cleanData.billTotal) || Number(cleanData.grandTotal) || 0;
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ServiceRecord$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, cleanData, {
                new: true
            }).lean();
            if (doc) return {
                ...doc,
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for updateServiceRecord:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockServices"])();
    const idx = list.findIndex((s)=>s._id === id || s.id === id || s.invoiceNo === id);
    if (idx !== -1) {
        list[idx] = {
            ...list[idx],
            ...cleanData,
            updatedAt: new Date().toISOString()
        };
        return list[idx];
    }
    return null;
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
async function getJobs() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Job$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                jobName: 1
            }).lean();
            return docs.map((d)=>({
                    ...d,
                    id: d._id.toString()
                }));
        }
    } catch (err) {
        console.warn('Fallback to memory for getJobs:', err.message);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockJobs"])().map((j)=>({
            ...j,
            id: j._id || j.id
        }));
}
async function createJob(data) {
    const cleanData = {
        ...data,
        jobCode: (data.jobCode || `JOB-${String(Date.now()).slice(-4)}`).trim().toUpperCase(),
        jobName: data.jobName.trim(),
        standardLaborFee: Number(data.standardLaborFee) || 0,
        defaultChecklist: Array.isArray(data.defaultChecklist) ? data.defaultChecklist : []
    };
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Job$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(cleanData);
            return {
                ...doc.toObject(),
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for createJob:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockJobs"])();
    const uid = generateUniqueId('job');
    const newObj = {
        _id: uid,
        id: uid,
        ...cleanData,
        createdAt: new Date().toISOString()
    };
    list.unshift(newObj);
    return newObj;
}
async function updateJob(id, data) {
    if (data.jobCode) data.jobCode = data.jobCode.trim().toUpperCase();
    if (data.standardLaborFee !== undefined) data.standardLaborFee = Number(data.standardLaborFee) || 0;
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Job$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, data, {
                new: true
            }).lean();
            if (doc) return {
                ...doc,
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for updateJob:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockJobs"])();
    const idx = list.findIndex((j)=>j._id === id || j.id === id || j.jobCode === id);
    if (idx !== -1) {
        list[idx] = {
            ...list[idx],
            ...data
        };
        return list[idx];
    }
    return null;
}
async function deleteJob(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Job$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
            return true;
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteJob:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockJobs"])();
    const idx = list.findIndex((j)=>j._id === id || j.id === id || j.jobCode === id);
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
            const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                supplierName: 1
            }).lean();
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
    const uid = generateUniqueId('sup');
    const newObj = {
        _id: uid,
        id: uid,
        ...data,
        createdAt: new Date().toISOString()
    };
    list.push(newObj);
    return newObj;
}
async function updateSupplier(id, data) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const { _id, id: sid, ...cleanData } = data;
            let oldSupplier = null;
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].isValidObjectId(id)) {
                oldSupplier = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id).lean();
            }
            if (!oldSupplier) {
                oldSupplier = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                    $or: [
                        {
                            _id: id
                        },
                        {
                            id: id
                        },
                        {
                            supplierName: id
                        }
                    ]
                }).lean();
            }
            let doc = null;
            if (oldSupplier) {
                doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(oldSupplier._id, cleanData, {
                    new: true
                }).lean();
            } else if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].isValidObjectId(id)) {
                doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, cleanData, {
                    new: true
                }).lean();
            }
            if (doc) {
                // Cascade supplier name change to Item and SupplierInvoice collections
                if (oldSupplier && oldSupplier.supplierName && cleanData.supplierName && oldSupplier.supplierName !== cleanData.supplierName) {
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Item$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateMany({
                            supplierName: oldSupplier.supplierName
                        }, {
                            supplierName: cleanData.supplierName
                        });
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].updateMany({
                            supplierName: oldSupplier.supplierName
                        }, {
                            supplierName: cleanData.supplierName
                        });
                    } catch (cascadeErr) {
                        console.warn('Could not cascade supplier name update:', cascadeErr.message);
                    }
                }
                return {
                    ...doc,
                    id: doc._id.toString()
                };
            }
        }
    } catch (err) {
        console.warn('Fallback to memory for updateSupplier:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSuppliers"])();
    const idx = list.findIndex((s)=>s._id === id || s.id === id || s.supplierName === id);
    if (idx !== -1) {
        const { _id, id: sid, ...cleanData } = data;
        list[idx] = {
            ...list[idx],
            ...cleanData,
            updatedAt: new Date().toISOString()
        };
        return list[idx];
    }
    return null;
}
async function deleteSupplier(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Supplier$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
            return true;
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteSupplier:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSuppliers"])();
    const idx = list.findIndex((s)=>s._id === id || s.id === id || s.supplierName === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        return true;
    }
    return false;
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
    let reminderStatus = '';
    if (Number(inv.balance) <= 0) {
        status = 'PAID';
        daysToDue = 0;
    } else if (diffDays < 0) {
        status = 'OVERDUE';
        daysOverdue = Math.abs(diffDays);
        reminderStatus = 'URGENT';
    } else if (diffDays === 0) {
        status = 'ONGOING';
        reminderStatus = 'DUE TODAY';
    }
    return {
        ...inv,
        status,
        daysToDue,
        daysOverdue,
        reminderStatus: inv.reminderStatus || reminderStatus
    };
}
async function getSupplierInvoices() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                dueDate: 1
            }).lean();
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
    let dueDate = data.dueDate;
    if (!dueDate || !dueDate.trim()) {
        const invDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date();
        invDate.setDate(invDate.getDate() + Number(data.creditDays || 0));
        dueDate = invDate.toISOString().split('T')[0];
    }
    const invoiceAmount = Number(data.invoiceAmount) || 0;
    const amountPaid = Number(data.amountPaid) || 0;
    const balance = Math.max(0, invoiceAmount - amountPaid);
    const cleanItems = (Array.isArray(data.items) ? data.items : []).filter((it)=>it && (it.description?.trim() || it.itemCode?.trim() || Number(it.total) > 0 || Number(it.unitPrice) > 0)).map((it)=>({
            itemCode: (it.itemCode || '').trim(),
            description: (it.description || it.itemCode || 'Invoice Item').trim(),
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unitPrice) || 0,
            total: Number(it.total) || Number(it.quantity || 1) * Number(it.unitPrice || 0)
        }));
    const { _id, id: sid, ...restData } = data;
    const cleanData = {
        ...restData,
        invoiceId: (data.invoiceId || `INV-${String(Date.now()).slice(-4)}`).trim(),
        supplierName: (data.supplierName || '').trim(),
        invoiceNo: (data.invoiceNo || '').trim(),
        poGrnNo: (data.poGrnNo || '').trim(),
        receivedDate: data.receivedDate || data.invoiceDate || new Date().toISOString().split('T')[0],
        invoiceDate: data.invoiceDate || new Date().toISOString().split('T')[0],
        creditDays: data.creditDays !== undefined && data.creditDays !== '' ? Number(data.creditDays) : 30,
        invoiceAmount,
        amountPaid,
        balance,
        dueDate,
        status: balance <= 0 ? 'PAID' : new Date(dueDate) < new Date() ? 'OVERDUE' : 'ONGOING',
        items: cleanItems,
        payments: Array.isArray(data.payments) ? data.payments : [],
        notes: (data.notes || '').trim()
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
    const uid = generateUniqueId('sinv');
    const newObj = calculateOverdueMetrics({
        _id: uid,
        id: uid,
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
async function updateSupplierInvoice(id, data) {
    const { _id, id: sid, ...cleanData } = data;
    if (cleanData.invoiceAmount !== undefined || cleanData.amountPaid !== undefined) {
        const invAmount = Number(cleanData.invoiceAmount !== undefined ? cleanData.invoiceAmount : 0);
        const paid = Number(cleanData.amountPaid !== undefined ? cleanData.amountPaid : 0);
        cleanData.balance = Math.max(0, invAmount - paid);
        cleanData.status = cleanData.balance <= 0 ? 'PAID' : new Date(cleanData.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING';
    }
    if (Array.isArray(cleanData.items)) {
        cleanData.items = cleanData.items.filter((it)=>it && (it.description?.trim() || it.itemCode?.trim() || Number(it.total) > 0)).map((it)=>({
                itemCode: (it.itemCode || '').trim(),
                description: (it.description || it.itemCode || 'Invoice Item').trim(),
                quantity: Number(it.quantity) || 1,
                unitPrice: Number(it.unitPrice) || 0,
                total: Number(it.total) || Number(it.quantity || 1) * Number(it.unitPrice || 0)
            }));
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            let doc = null;
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].isValidObjectId(id)) {
                doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, cleanData, {
                    new: true
                }).lean();
            }
            if (!doc) {
                doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
                    invoiceId: id
                }, cleanData, {
                    new: true
                }).lean();
            }
            if (doc) return calculateOverdueMetrics({
                ...doc,
                id: doc._id.toString()
            });
        }
    } catch (err) {
        console.warn('Fallback to memory for updateSupplierInvoice:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSupplierInvoices"])();
    const idx = list.findIndex((i)=>i._id === id || i.id === id || i.invoiceId === id);
    if (idx !== -1) {
        list[idx] = calculateOverdueMetrics({
            ...list[idx],
            ...cleanData,
            updatedAt: new Date().toISOString()
        });
        return list[idx];
    }
    return null;
}
async function deleteSupplierInvoice(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].isValidObjectId(id)) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$SupplierInvoice$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndDelete({
                    invoiceId: id
                });
            }
            return true;
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteSupplierInvoice:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSupplierInvoices"])();
    const idx = list.findIndex((i)=>i._id === id || i.id === id || i.invoiceId === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        return true;
    }
    return false;
}
async function updateSupplierPayment(invoiceId, paymentId, paymentData) {
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
                const pIndex = inv.payments.findIndex((p)=>p.paymentId === paymentId);
                if (pIndex !== -1) {
                    inv.payments[pIndex] = {
                        ...inv.payments[pIndex].toObject(),
                        ...paymentData
                    };
                    const totalPaid = inv.payments.reduce((sum, p)=>sum + (Number(p.amount) || 0), 0);
                    inv.amountPaid = totalPaid;
                    inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
                    inv.status = inv.balance <= 0 ? 'PAID' : new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING';
                    await inv.save();
                    return calculateOverdueMetrics({
                        ...inv.toObject(),
                        id: inv._id.toString()
                    });
                }
            }
        }
    } catch (err) {
        console.warn('Fallback to memory for updateSupplierPayment:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSupplierInvoices"])();
    const inv = list.find((i)=>i._id === invoiceId || i.id === invoiceId || i.invoiceId === invoiceId);
    if (inv && inv.payments) {
        const pIdx = inv.payments.findIndex((p)=>p.paymentId === paymentId);
        if (pIdx !== -1) {
            inv.payments[pIdx] = {
                ...inv.payments[pIdx],
                ...paymentData
            };
            const totalPaid = inv.payments.reduce((sum, p)=>sum + (Number(p.amount) || 0), 0);
            inv.amountPaid = totalPaid;
            inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
            inv.status = inv.balance <= 0 ? 'PAID' : new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING';
            return calculateOverdueMetrics(inv);
        }
    }
    return null;
}
async function deleteSupplierPayment(invoiceId, paymentId) {
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
                inv.payments = inv.payments.filter((p)=>p.paymentId !== paymentId);
                const totalPaid = inv.payments.reduce((sum, p)=>sum + (Number(p.amount) || 0), 0);
                inv.amountPaid = totalPaid;
                inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
                inv.status = inv.balance <= 0 ? 'PAID' : new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING';
                await inv.save();
                return calculateOverdueMetrics({
                    ...inv.toObject(),
                    id: inv._id.toString()
                });
            }
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteSupplierPayment:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockSupplierInvoices"])();
    const inv = list.find((i)=>i._id === invoiceId || i.id === invoiceId || i.invoiceId === invoiceId);
    if (inv && inv.payments) {
        inv.payments = inv.payments.filter((p)=>p.paymentId !== paymentId);
        const totalPaid = inv.payments.reduce((sum, p)=>sum + (Number(p.amount) || 0), 0);
        inv.amountPaid = totalPaid;
        inv.balance = Math.max(0, Number(inv.invoiceAmount || 0) - totalPaid);
        inv.status = inv.balance <= 0 ? 'PAID' : new Date(inv.dueDate) < new Date() ? 'OVERDUE' : 'ONGOING';
        return calculateOverdueMetrics(inv);
    }
    return null;
}
async function getExpenses() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const docs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Expense$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find().sort({
                expenseDate: -1,
                createdAt: -1
            }).lean();
            return docs.map((d)=>({
                    ...d,
                    id: d._id.toString()
                }));
        }
    } catch (err) {
        console.warn('Fallback to memory for getExpenses:', err.message);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockExpenses"])().map((e)=>({
            ...e,
            id: e._id || e.id
        }));
}
async function createExpense(data) {
    const cleanData = {
        ...data,
        expenseNo: data.expenseNo || `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        expenseDate: data.expenseDate || new Date().toISOString().split('T')[0],
        amount: Number(data.amount) || 0
    };
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Expense$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(cleanData);
            return {
                ...doc.toObject(),
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for createExpense:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockExpenses"])();
    const uid = generateUniqueId('exp');
    const newObj = {
        _id: uid,
        id: uid,
        ...cleanData,
        createdAt: new Date().toISOString()
    };
    list.unshift(newObj);
    return newObj;
}
async function deleteExpense(id) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Expense$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(id);
            return true;
        }
    } catch (err) {
        console.warn('Fallback to memory for deleteExpense:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockExpenses"])();
    const idx = list.findIndex((e)=>e._id === id || e.id === id || e.expenseNo === id);
    if (idx !== -1) {
        list.splice(idx, 1);
        return true;
    }
    return false;
}
async function updateExpense(id, data) {
    if (data.amount !== undefined) data.amount = Number(data.amount);
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDbConnected"])()) {
            const doc = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Expense$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, data, {
                new: true
            }).lean();
            if (doc) return {
                ...doc,
                id: doc._id.toString()
            };
        }
    } catch (err) {
        console.warn('Fallback to memory for updateExpense:', err.message);
    }
    const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockStore$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockExpenses"])();
    const idx = list.findIndex((e)=>e._id === id || e.id === id || e.expenseNo === id);
    if (idx !== -1) {
        list[idx] = {
            ...list[idx],
            ...data,
            updatedAt: new Date().toISOString()
        };
        return list[idx];
    }
    return null;
}
async function getFinancialAnalytics() {
    const todayStr = new Date().toISOString().split('T')[0];
    // Fetch all live records
    const [services, invoices, expenses] = await Promise.all([
        getServicesByVehicleNo(),
        getSupplierInvoices(),
        getExpenses()
    ]);
    // 1. REVENUE CALCULATIONS
    let totalRevenue = 0;
    let revenueToday = 0;
    let revenueThisMonth = 0;
    const currentMonthPrefix = todayStr.slice(0, 7); // e.g. "2026-11"
    services.forEach((srv)=>{
        const amt = Number(srv.billTotal || srv.grandTotal || srv.totalAmount) || 0;
        totalRevenue += amt;
        if (srv.serviceDate === todayStr) {
            revenueToday += amt;
        }
        if (srv.serviceDate && srv.serviceDate.startsWith(currentMonthPrefix)) {
            revenueThisMonth += amt;
        }
    });
    // 2. EXPENSES & SHOULD PAY TODAY CALCULATIONS
    let supplierPayablesTotal = 0;
    let expensesShouldPayToday = 0;
    let paymentsRequiringAttentionToday = [];
    invoices.forEach((inv)=>{
        const bal = Number(inv.balance) || 0;
        if (bal > 0) {
            supplierPayablesTotal += bal;
            const isOverdue = inv.status === 'OVERDUE' || inv.dueDate && inv.dueDate < todayStr;
            const isDueToday = inv.dueDate === todayStr;
            if (isOverdue || isDueToday) {
                expensesShouldPayToday += bal;
                paymentsRequiringAttentionToday.push({
                    ...inv,
                    attentionReason: isDueToday ? 'DUE TODAY' : 'OVERDUE'
                });
            }
        }
    });
    // Also check pending operating expenses due today
    let operatingExpensesPaidTotal = 0;
    let operatingExpensesPaidToday = 0;
    expenses.forEach((exp)=>{
        const amt = Number(exp.amount) || 0;
        if (exp.status === 'Paid') {
            operatingExpensesPaidTotal += amt;
            if (exp.expenseDate === todayStr) {
                operatingExpensesPaidToday += amt;
            }
        } else if (exp.status === 'Should Pay Today' || exp.dueDate === todayStr || exp.dueDate && exp.dueDate < todayStr) {
            expensesShouldPayToday += amt;
        }
    });
    // Total Supplier Payments already cleared
    let supplierPaymentsMadeTotal = 0;
    let supplierPaymentsMadeToday = 0;
    invoices.forEach((inv)=>{
        if (Array.isArray(inv.payments)) {
            inv.payments.forEach((p)=>{
                const pAmt = Number(p.amount) || 0;
                supplierPaymentsMadeTotal += pAmt;
                if (p.paymentDate === todayStr) {
                    supplierPaymentsMadeToday += pAmt;
                }
            });
        }
    });
    const totalExpensesPaid = supplierPaymentsMadeTotal + operatingExpensesPaidTotal;
    const expensesPaidToday = supplierPaymentsMadeToday + operatingExpensesPaidToday;
    const netOperatingProfit = totalRevenue - totalExpensesPaid;
    // Sort attention reminders: Overdue first, then largest balance
    paymentsRequiringAttentionToday.sort((a, b)=>(b.daysOverdue || 0) - (a.daysOverdue || 0));
    return {
        todayStr,
        totalRevenue,
        revenueToday,
        revenueThisMonth,
        expensesShouldPayToday,
        supplierPayablesTotal,
        totalExpensesPaid,
        expensesPaidToday,
        netOperatingProfit,
        paymentsRequiringAttentionToday,
        recentServicesCount: services.length,
        activeSuppliersCount: (await getSuppliers()).length
    };
}
}),
"[project]/src/lib/mockStore.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Clean In-Memory Fallback Stores (Zero Hardcoded Data)
// All initial arrays are completely empty. Only data added by the user will exist.
__turbopack_context__.s([
    "getMockExpenses",
    ()=>getMockExpenses,
    "getMockItems",
    ()=>getMockItems,
    "getMockJobs",
    ()=>getMockJobs,
    "getMockServices",
    ()=>getMockServices,
    "getMockSupplierInvoices",
    ()=>getMockSupplierInvoices,
    "getMockSuppliers",
    ()=>getMockSuppliers,
    "getMockVehicles",
    ()=>getMockVehicles,
    "mockExpenses",
    ()=>mockExpenses,
    "mockItems",
    ()=>mockItems,
    "mockJobs",
    ()=>mockJobs,
    "mockServices",
    ()=>mockServices,
    "mockSupplierInvoices",
    ()=>mockSupplierInvoices,
    "mockSuppliers",
    ()=>mockSuppliers,
    "mockVehicles",
    ()=>mockVehicles
]);
const mockExpenses = [];
const mockVehicles = [];
const mockItems = [];
const mockServices = [];
const mockSuppliers = [];
const mockSupplierInvoices = [];
const mockJobs = [];
const getMockExpenses = ()=>mockExpenses;
const getMockVehicles = ()=>mockVehicles;
const getMockItems = ()=>mockItems;
const getMockServices = ()=>mockServices;
const getMockSuppliers = ()=>mockSuppliers;
const getMockSupplierInvoices = ()=>mockSupplierInvoices;
const getMockJobs = ()=>mockJobs;
}),
"[project]/src/lib/mongodb.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "getActiveUri",
    ()=>getActiveUri,
    "getDbStatus",
    ()=>getDbStatus,
    "isDbConnected",
    ()=>isDbConnected,
    "maskUri",
    ()=>maskUri,
    "updateMongoUri",
    ()=>updateMongoUri
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Read from process.env or .env.local file directly as fallback
function getInitialUri() {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) {
        return process.env.MONGODB_URI.trim();
    }
    try {
        const envPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '.env.local');
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(envPath)) {
            const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(envPath, 'utf8');
            const match = content.match(/^MONGODB_URI=(.*)$/m);
            if (match && match[1] && match[1].trim()) {
                return match[1].trim();
            }
        }
    } catch (err) {
        console.warn('[MongoDB] Could not read .env.local:', err.message);
    }
    return '';
}
let activeUri = getInitialUri();
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null,
        isConnected: false,
        lastError: null
    };
}
function maskUri(uri) {
    if (!uri) return '';
    return uri.replace(/:([^:@]+)@/, ':••••••••@');
}
function getActiveUri() {
    return activeUri;
}
async function connectToDatabase(overrideUri = null) {
    const uriToUse = (overrideUri || activeUri || '').trim();
    if (!uriToUse) {
        cached.isConnected = false;
        cached.lastError = 'No MongoDB URI configured. Please provide your connection link in .env.local or via Database Settings.';
        return null;
    }
    if (cached.conn && __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState === 1 && activeUri === uriToUse) {
        cached.isConnected = true;
        return cached.conn;
    }
    // If URI changed or disconnected, reset connection
    if (overrideUri && overrideUri !== activeUri) {
        activeUri = overrideUri;
        try {
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState !== 0) {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].disconnect();
            }
        } catch  {}
        cached.conn = null;
        cached.promise = null;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            tlsAllowInvalidCertificates: true,
            dbName: 'service_center_db'
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(uriToUse, opts).then((mongooseInstance)=>{
            cached.isConnected = true;
            cached.lastError = null;
            console.log(`[MongoDB] Connected successfully to: ${maskUri(uriToUse)}`);
            return mongooseInstance;
        }).catch((err)=>{
            cached.promise = null;
            cached.isConnected = false;
            cached.lastError = err.message;
            console.log('[MongoDB] Connection error:', err.message);
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
        cached.lastError = e.message;
    }
    return cached.conn;
}
function isDbConnected() {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState === 1;
}
function getDbStatus() {
    const isConn = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState === 1;
    return {
        connected: isConn,
        readyState: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState,
        host: isConn ? __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.host : null,
        port: isConn ? __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.port : null,
        name: isConn ? __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.name : null,
        uriMasked: maskUri(activeUri),
        configured: Boolean(activeUri && activeUri.trim()),
        error: cached?.lastError || null
    };
}
async function updateMongoUri(newUri) {
    const cleanUri = (newUri || '').trim();
    activeUri = cleanUri;
    process.env.MONGODB_URI = cleanUri;
    // Persist to .env.local
    try {
        const envPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '.env.local');
        const content = `# ==============================================================================
# MONGODB CONNECTION STRING
# ==============================================================================
# Paste your MongoDB link below (MongoDB Atlas or Local MongoDB).
#
# Examples:
# MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/service_center_db?retryWrites=true&w=majority
#
# Local MongoDB:
# MONGODB_URI=mongodb://127.0.0.1:27017/service_center_db
# ==============================================================================
MONGODB_URI=${cleanUri}
`;
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(envPath, content, 'utf8');
    } catch (err) {
        console.error('Failed to write .env.local:', err.message);
    }
    // Reconnect
    try {
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState !== 0) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].disconnect();
        }
    } catch  {}
    cached.conn = null;
    cached.promise = null;
    if (cleanUri) {
        await connectToDatabase(cleanUri);
    } else {
        cached.isConnected = false;
        cached.lastError = 'MongoDB link cleared.';
    }
    return getDbStatus();
}
}),
"[project]/src/models/Expense.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const ExpenseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    expenseNo: {
        type: String,
        required: true,
        trim: true
    },
    expenseDate: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: 'Maintenance',
        enum: [
            'Supplier',
            'Electricity',
            'Telephone',
            'Salary',
            'Medicine',
            'Maintenance',
            'Tea & Sugar',
            'Staff',
            'Meals',
            'Kerosine oil',
            'Rent',
            'Hardware',
            'Government / Tax',
            'Other'
        ]
    },
    payee: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    paymentMethod: {
        type: String,
        default: 'Cash',
        enum: [
            'Cash',
            'Card',
            'Bank Transfer',
            'Cheque'
        ]
    },
    status: {
        type: String,
        default: 'Paid',
        enum: [
            'Paid',
            'Should Pay Today',
            'Pending'
        ]
    },
    dueDate: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Expense || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Expense', ExpenseSchema);
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
    supplierName: {
        type: String,
        default: '',
        trim: true,
        index: true
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
"[project]/src/models/Job.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const JobSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    jobCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    jobName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: 'Vehicle Service',
        trim: true
    },
    standardLaborFee: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    estimatedDuration: {
        type: String,
        default: '1 Hour'
    },
    description: {
        type: String,
        default: ''
    },
    defaultChecklist: {
        type: [
            String
        ],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Job || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Job', JobSchema);
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
    supplierName: {
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
const ServicePartSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    code: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    supplier: {
        type: String,
        default: ''
    },
    supplierName: {
        type: String,
        default: ''
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
const ServiceRecordSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    serviceNo: {
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
    serviceDate: {
        type: String,
        required: true
    },
    serviceTime: {
        type: String,
        default: ''
    },
    serviceType: {
        type: String,
        default: 'Full Service'
    },
    billingType: {
        type: String,
        default: 'Normal'
    },
    laborCharges: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    technician: {
        type: String,
        default: ''
    },
    technicianNotes: {
        type: String,
        default: ''
    },
    checklist: [
        {
            type: String
        }
    ],
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
    technician: {
        type: String,
        default: 'Senior Tech',
        trim: true
    },
    status: {
        type: String,
        default: 'Completed',
        enum: [
            'Completed',
            'In Progress',
            'Pending Delivery'
        ]
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
    parts: [
        ServicePartSchema
    ],
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
        default: ''
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

//# sourceMappingURL=%5Broot-of-the-server%5D__107anm1rmv213._.js.map