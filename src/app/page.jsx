'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Car,
  Wrench,
  Calendar,
  Clock,
  Gauge,
  User,
  Phone,
  MapPin,
  Save,
  Plus,
  RefreshCw,
  Trash2,
  Edit3,
  FileText,
  Download,
  Printer,
  History,
  CheckCircle2,
  AlertCircle,
  Database,
  X,
  Receipt,
  Package,
  Calculator,
  ChevronDown,
  Sparkles,
  Truck,
  CreditCard,
  AlertTriangle,
  Check,
  Search,
  Eye,
  Building2,
  ArrowRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Layers,
  PieChart,
  CalendarCheck,
  BellRing,
  Info,
  Mail
} from 'lucide-react';

// Standard Service Package Definitions (Inspection & Service Checklist Options)
const SERVICE_PACKAGES = [
  {
    name: 'Full Service',
    baseFee: 6500,
    description: 'Comprehensive 25-point inspection, fluid checks, filter & engine servicing',
    recommendedItems: [],
    checklist: [
      'Engine Oil Replaced',
      'Engine Oil Filter Replaced',
      'Air Filter Cleaned / Replaced',
      'Cabin / AC Filter Replaced',
      'Brake Fluid Checked & Flushed',
      'Coolant Level & Radiator Checked',
      'Battery Voltage & Terminals Tested',
      'Tire Pressure & Rotation Done',
      'Underbody Wash & Detailing'
    ]
  },
  {
    name: 'Oil & Filter Change',
    baseFee: 3500,
    description: 'Lube service, engine oil replacement, oil filter replacement and level inspection',
    recommendedItems: [],
    checklist: [
      'Engine Oil Replaced',
      'Engine Oil Filter Replaced',
      'Underbody Inspection',
      'Tire Pressure Checked'
    ]
  },
  {
    name: 'Brake Service',
    baseFee: 5000,
    description: 'Brake pad replacement, rotor skim check, brake line flush & cleaning',
    recommendedItems: [],
    checklist: [
      'Brake Pads Inspected / Replaced',
      'Brake Fluid Checked & Flushed',
      'Wheel Alignment & Balancing'
    ]
  },
  {
    name: 'Transmission Service',
    baseFee: 4500,
    description: 'Automatic / CVT transmission fluid change & gearbox oil filter replacement',
    recommendedItems: [],
    checklist: [
      'Transmission / Gear Oil Inspected',
      'Gearbox Filter Replaced',
      'Underbody Inspection'
    ]
  },
  {
    name: 'Engine Tuning',
    baseFee: 6000,
    description: 'Ignition timing, spark plugs inspection, throttle body cleaning & diagnostic scan',
    recommendedItems: [],
    checklist: [
      'Spark Plugs Checked / Replaced',
      'Battery Voltage & Terminals Tested',
      'Electronic Diagnostic Scan'
    ]
  },
  {
    name: 'General Repair',
    baseFee: 4000,
    description: 'Custom repair or diagnostic service',
    recommendedItems: [],
    checklist: []
  }
];

const ALL_CHECKLIST_OPTIONS = [
  'Engine Oil Replaced',
  'Engine Oil Filter Replaced',
  'Air Filter Cleaned / Replaced',
  'Cabin / AC Filter Replaced',
  'Brake Fluid Checked & Flushed',
  'Brake Pads Inspected / Replaced',
  'Spark Plugs Checked / Replaced',
  'Coolant Level & Radiator Checked',
  'Battery Voltage & Terminals Tested',
  'Tire Pressure & Rotation Done',
  'Wheel Alignment & Balancing',
  'Transmission / Gear Oil Inspected',
  'Gearbox Filter Replaced',
  'Suspension & Shock Absorbers Inspected',
  'Underbody Wash & Detailing',
  'Electronic Diagnostic Scan'
];

export default function ServiceCenterApp() {
  // Navigation Tabs: Only 4 Main Tabs (Vehicle Registration | Service | Suppliers | Expenses)
  const [activeTab, setActiveTab] = useState('Cs/Vehicle');
  const [expenseSubTab, setExpenseSubTab] = useState('expenses'); // 'expenses' | 'pay_today' | 'analysis'
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'Checking...', uriMasked: '', host: '', name: '' });
  const [showDbConfigModal, setShowDbConfigModal] = useState(false);
  const [dbConfigUri, setDbConfigUri] = useState('');
  const [dbSaving, setDbSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ pendingCount: 0, lastSyncedAt: null, lastSyncError: null, syncing: false });

  // Vehicles state
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [savingService, setSavingService] = useState(false);

  // Items catalog
  const [catalogItems, setCatalogItems] = useState([]);
  const emptyItemForm = {
    id: '',
    itemCode: '',
    barcode: '',
    description: '',
    supplierName: '',
    category: 'Oils & Fluids',
    qtyOnHand: 0,
    stockUnit: 'Bottles',
    costPrice: 0,
    sellingPrice: 0,
    stockDate: '',
    stockTime: ''
  };
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [itemCategories, setItemCategories] = useState([
    'Oils & Fluids',
    'Filters',
    'Brake Components',
    'Batteries',
    'Engine Parts',
    'Accessories',
    'General',
    'Other'
  ]);
  const [customItemCategory, setCustomItemCategory] = useState('');
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemRowId, setEditingItemRowId] = useState(null);
  const [editingItemRowData, setEditingItemRowData] = useState({});
  const [showItemForm, setShowItemForm] = useState(false);
  const [supplierItemFilter, setSupplierItemFilter] = useState('ALL');
  const [stockEntryForm, setStockEntryForm] = useState({
    selectedItemId: '',
    costPrice: '',
    sellingPrice: '',
    qtyToAdd: '',
    stockUnit: 'Bottles',
    customStockUnit: '',
    stockDate: new Date().toISOString().split('T')[0],
    stockTime: new Date().toTimeString().slice(0, 5)
  });

  // Quick Part selector for Vehicle Service Logger
  const [quickSelectedPartCode, setQuickSelectedPartCode] = useState('');
  const [quickPartQty, setQuickPartQty] = useState(1);
  const [quickPartSupplierFilter, setQuickPartSupplierFilter] = useState('ALL');
  const [showAddCustomSupplierPartModal, setShowAddCustomSupplierPartModal] = useState(false);
  const [customSupplierPartForm, setCustomSupplierPartForm] = useState({
    supplierName: '',
    description: '',
    itemCode: '',
    quantity: 1,
    unitPrice: '',
    saveToCatalog: true
  });

  // Modal to add parts to an already existing service visit in history while servicing:
  const [serviceToAppendParts, setServiceToAppendParts] = useState(null);
  const [appendPartSelectedCode, setAppendPartSelectedCode] = useState('');
  const [appendPartSupplierFilter, setAppendPartSupplierFilter] = useState('ALL');
  const [appendPartQty, setAppendPartQty] = useState(1);

  // Suppliers & Invoices state
  const [suppliers, setSuppliers] = useState([]);
  const [supplierInvoices, setSupplierInvoices] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [supplierSubTab, setSupplierSubTab] = useState('register'); // 'register' | 'items' | 'add_invoice' | 'tracker' | 'payments'
  const [supplierFilterStatus, setSupplierFilterStatus] = useState('ALL'); // 'ALL' | 'OVERDUE' | 'ONGOING' | 'PAID'
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
  const [registerItemSupplierSearch, setRegisterItemSupplierSearch] = useState('');
  const [stockEntrySupplierSearch, setStockEntrySupplierSearch] = useState('');
  const [stockEntrySupplierFilter, setStockEntrySupplierFilter] = useState('');
  const [stockEntryItemSearch, setStockEntryItemSearch] = useState('');

  // Supplier & Invoice Editing states
  const [isEditingSupplier, setIsEditingSupplier] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  // Expense Editing state
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  // Payment Modal state for Supplier Invoices
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'Cheque', // Cheque | Cash | Bank Transfer
    chequeNo: '',
    chequeIssueDate: new Date().toISOString().split('T')[0],
    chequeStatus: 'Issued',
    clearedDate: '',
    bankAccount: 'Commercial Bank - Main',
    notes: ''
  });

  // New Supplier Form
  const [newSupplierData, setNewSupplierData] = useState({
    supplierName: '',
    contactPerson: '',
    telephone: '',
    email: '',
    address: '',
    defaultCreditDays: 30,
    suppliedCategories: 'Oils, Filters'
  });

  // New Supplier Invoice Form
  const [newInvoiceData, setNewInvoiceData] = useState({
    supplierName: '',
    invoiceNo: '',
    poGrnNo: '',
    receivedDate: new Date().toISOString().split('T')[0],
    invoiceDate: new Date().toISOString().split('T')[0],
    creditDays: 30,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    invoiceAmount: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    notes: ''
  });

  // Vehicle Form State (Cs/Vehicle - Exact match to user screenshot)
  const emptyVehicleForm = {
    id: '',
    rNo: '',
    vehicleNo: '',
    editVehicleNo: '',
    tagNo: '',
    csName: '',
    address: '',
    mobileTel: '',
    homeTel: '',
    officeTel: '',
    email: '',
    city: 'Colombo',
    csStatus: 'Regular',
    vType: 'Car',
    vModel: '',
    colour: '',
    engineNo: '',
    chassisNo: '',
    birthDay: '',
    deliveryDate: ''
  };
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');

  // Lookups
  const [cities, setCities] = useState(['Colombo', 'Kandy', 'Galle', 'Negombo', 'Maharagama', 'Gampaha', 'Kurunegala']);
  const [statuses, setStatuses] = useState(['Regular', 'VIP', 'Corporate', 'New Customer', 'Priority']);
  const [colours, setColours] = useState(['Pearl White', 'Metallic Black', 'Silver', 'Deep Blue', 'Crimson Red', 'Gunmetal Grey', 'Beige']);
  const [types] = useState(['Car', 'SUV', 'Van', 'Motorcycle', 'Lorry', 'Cab / Pickup', 'Bus', 'Three-Wheeler']);
  const [modalType, setModalType] = useState(null);
  const [modalNewItem, setModalNewItem] = useState('');

  // Table Filters (Cs/Vehicle)
  const [vehicleFilters, setVehicleFilters] = useState({
    vehicleNumber: '',
    tagNumber: '',
    csName: '',
    city: '',
    vehicleModel: '',
    deliveryDate: ''
  });

  // Service Module State
  const [selectedServiceVehicleNo, setSelectedServiceVehicleNo] = useState('');
  const [serviceVehicleSearchQuery, setServiceVehicleSearchQuery] = useState('');
  const [serviceTypeSearchQuery, setServiceTypeSearchQuery] = useState('');
  const [showServicePickerDropdown, setShowServicePickerDropdown] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [vehicleSubTab, setVehicleSubTab] = useState('registration'); // 'registration' | 'service' | 'history' | 'catalog'
  const [serviceSubTab, setServiceSubTab] = useState('add'); // 'add' | 'catalog' | 'history'

  // Period Financial Report State (Revenue & Expenses by Date/Month)
  const [reportFilterType, setReportFilterType] = useState('month'); // 'date' | 'range' | 'month' | 'all'
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportStartDate, setReportStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7)); // 'YYYY-MM'
  const [reportViewTab, setReportViewTab] = useState('all'); // 'all' | 'revenue' | 'expenses'

  // Jobs / Services Catalog Master State (Separately managed jobs)
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobFilterCategory, setJobFilterCategory] = useState('ALL');
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const emptyJobForm = {
    jobCode: '',
    jobName: '',
    category: 'Vehicle Service', // Vehicle Service | Car Wash | Mechanical | Diagnostics | Other
    standardLaborFee: '',
    nextServiceOdometer: '',
    description: '',
    checklistText: ''
  };
  const [jobForm, setJobForm] = useState(emptyJobForm);

  // Service Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const initialFullServicePkg = SERVICE_PACKAGES[0]; // Full Service

  const [serviceForm, setServiceForm] = useState({
    serviceNo: '',
    serviceDate: todayStr,
    serviceTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    meterReading: '',
    serviceType: 'Full Service',
    selectedServices: [],
    paymentMethod: 'Cash', // Cash | Card | Bank Transfer | Cheque | Credit (Pay Later)
    laborCharges: initialFullServicePkg.baseFee, // 6500
    checklist: [...initialFullServicePkg.checklist],
    parts: [],
    discount: 0,
    technician: '',
    status: 'Completed',
    nextServiceDate: '',
    nextServiceMeter: '',
    jobDetails: 'Full periodic maintenance inspection and servicing',
    technicianNotes: ''
  });

  // Invoice / Bill Modal
  const [invoiceRecord, setInvoiceRecord] = useState(null);

  // Toast notification
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Financial Analytics & Dynamic Revenue / Should Pay Today
  const [financials, setFinancials] = useState({
    todayStr: new Date().toISOString().split('T')[0],
    totalRevenue: 0,
    revenueToday: 0,
    revenueThisMonth: 0,
    expensesShouldPayToday: 0,
    supplierPayablesTotal: 0,
    totalExpensesPaid: 0,
    expensesPaidToday: 0,
    netOperatingProfit: 0,
    paymentsRequiringAttentionToday: [],
    recentServicesCount: 0,
    activeSuppliersCount: 0
  });
  const [loadingFinancials, setLoadingFinancials] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expenseFilterCategory, setExpenseFilterCategory] = useState('ALL');
  const [expenseFilterStatus, setExpenseFilterStatus] = useState('ALL');
  const [attentionFilter, setAttentionFilter] = useState('ALL'); // 'ALL' | 'OVERDUE' | 'DUE_TODAY'

  // Operating Expense Categories matching user's Excel photo (Daily Sale.xlsx Lists):
  const [expenseCategories, setExpenseCategories] = useState([
    'Supplier',
    'Electricity',
    'Telephone',
    'CCS Bank',
    'Salary',
    'Medicine',
    'Maintenance',
    'Tea & Sugar',
    'Staff',
    'Meals',
    'Kerosine oil',
    'Cash payments',
    'Seylan',
    'Other'
  ]);
  const [customExpenseCategory, setCustomExpenseCategory] = useState('');
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');

  const INCOME_CATEGORIES = [
    'Vehicle Service',
    'Car Wash',
    'Mechanical',
    'Diagnostics',
    'Other'
  ];

  const [newExpenseData, setNewExpenseData] = useState({
    category: 'Electricity',
    description: '',
    payeeType: 'Other',
    payee: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    txnType: 'Expense',
    paymentMethod: 'Cash',
    status: 'Should Pay Today',
    notes: ''
  });

  // Initial load
  useEffect(() => {
    fetchDbStatus();
    fetchSyncStatus();
    loadVehicles();
    loadCatalogItems();
    loadSuppliers();
    loadSupplierInvoices();
    loadFinancials();
    loadExpenses();
    loadJobs();
    loadAllServices();
    checkAndSendServiceReminders();

    const onOnline = () => {
      handleSyncNow(true);
    };
    window.addEventListener('online', onOnline);
    const intervalId = setInterval(() => {
      fetchSyncStatus(true);
    }, 30000);
    return () => {
      window.removeEventListener('online', onOnline);
      clearInterval(intervalId);
    };
  }, []);

  const checkAndSendServiceReminders = async () => {
    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'auto' })
      });
      const json = await res.json();
      if (json.success && json.sentCount > 0) {
        showNotification(`Sent ${json.sentCount} service reminder email(s) for vehicles due within 7 days!`);
        loadAllServices();
      }
    } catch (err) {
      console.error('Auto service reminder check failed:', err);
    }
  };

  const handleSendServiceReminder = async (srv) => {
    const serviceId = srv._id || srv.id;
    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, mode: 'manual', force: Boolean(srv.reminderSent) })
      });
      const json = await res.json();
      if (json.success && json.sentCount > 0) {
        showNotification(`Reminder email sent to vehicle owner (${srv.vehicleNo})!`);
        await Promise.all([
          fetchServiceHistory(srv.vehicleNo),
          loadAllServices()
        ]);
      } else {
        showNotification(json.message || 'Could not send reminder email', 'error');
      }
    } catch (err) {
      showNotification('Email error: ' + err.message, 'error');
    }
  };

  const loadAllServices = async () => {
    try {
      const res = await fetch('/api/services');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAllServices(json.data);
      }
    } catch (err) {
      console.error('Failed to load all services:', err);
    }
  };

  // Seed standard services from user's Daily Sale.xlsx lists
  const handleSeedStandardJobs = async () => {
    const standardServices = [
      { code: 'JOB-FS-01', name: 'Full Service (Package)', category: 'Vehicle Service', fee: 6500, duration: '2 Hours', checklist: ['Engine Oil Replaced', 'Oil Filter Replaced', 'Air Filter Cleaned', 'Brake Fluid Checked', 'Battery Tested', 'Underbody Wash'] },
      { code: 'JOB-WSH-01', name: 'Body Wash', category: 'Car Wash', fee: 1200, duration: '30 mins', checklist: ['Body Shampoo Wash', 'Glass Detailing', 'Tire Dressing'] },
      { code: 'JOB-WSH-02', name: 'Under Wash', category: 'Car Wash', fee: 1500, duration: '30 mins', checklist: ['High-Pressure Chassis Wash', 'Mud & Grease Removal'] },
      { code: 'JOB-WSH-03', name: 'Exterior Wash', category: 'Car Wash', fee: 1000, duration: '20 mins', checklist: ['Exterior Foam Wash', 'Rinse & Dry'] },
      { code: 'JOB-WSH-04', name: 'Interior Wash / Cleaning', category: 'Car Wash', fee: 3000, duration: '1 Hour', checklist: ['Vacuum Carpets & Seats', 'Dashboard Polish', 'Door Panels Cleaning'] },
      { code: 'JOB-TUN-01', name: 'Engine Tuning', category: 'Diagnostics', fee: 5500, duration: '1.5 Hours', checklist: ['Spark Plugs Tested', 'Throttle Body Cleaned', 'OBD-II Scan'] },
      { code: 'JOB-INJ-01', name: 'Injector Cleaning', category: 'Mechanical', fee: 4500, duration: '1 Hour', checklist: ['Ultrasonic Injector Flush', 'Flow Rate Test'] },
      { code: 'JOB-BRK-01', name: 'Brake Service', category: 'Mechanical', fee: 4000, duration: '1 Hour', checklist: ['Brake Pads Checked', 'Caliper Grease Lubrication', 'Brake Fluid Flush'] },
      { code: 'JOB-TRN-01', name: 'Transmission Service', category: 'Vehicle Service', fee: 4500, duration: '1.5 Hours', checklist: ['Gearbox Oil Drained & Replaced', 'Transmission Filter Inspected'] },
      { code: 'JOB-OIL-01', name: 'Engine Oil & Filter Change only', category: 'Vehicle Service', fee: 2500, duration: '30 mins', checklist: ['Engine Oil Replaced', 'Filter Replaced'] },
      { code: 'JOB-POL-01', name: 'Cut & Polish', category: 'Car Wash', fee: 8500, duration: '3 Hours', checklist: ['Machine Compound Polish', 'Wax Coat Application', 'Swirl Marks Removal'] },
      { code: 'JOB-SIL-01', name: 'Silencer Wash', category: 'Car Wash', fee: 800, duration: '20 mins', checklist: ['Exhaust Pipe & Silencer Wash'] }
    ];

    try {
      let added = 0;
      for (const s of standardServices) {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobCode: s.code,
            jobName: s.name,
            category: s.category,
            standardLaborFee: s.fee,
            estimatedDuration: s.duration,
            description: `Standard ${s.name} procedure`,
            defaultChecklist: s.checklist
          })
        });
        if (res.ok) added++;
      }
      showNotification(`Added ${added} standard services from reference catalog!`);
      const resAfter = await fetch('/api/jobs');
      const jsonAfter = await resAfter.json();
      if (jsonAfter.success && Array.isArray(jsonAfter.data)) {
        const seen = new Set();
        const uniqueJobs = jsonAfter.data.filter(j => {
          const key = j.jobCode || j.id || j._id;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setJobs(uniqueJobs);
      }
    } catch (err) {
      console.error('Error seeding services:', err);
    }
  };

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await fetch('/api/jobs');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        if (json.data.length === 0) {
          await handleSeedStandardJobs();
        } else {
          const seen = new Set();
          const uniqueJobs = json.data.filter(j => {
            const key = j.jobCode || j.id || j._id;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setJobs(uniqueJobs);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSaveJob = async (e) => {
    if (e) e.preventDefault();
    if (!jobForm.jobName.trim()) {
      showNotification('Service / Job Name is required!', 'error');
      return;
    }

    const checklist = jobForm.checklistText
      ? jobForm.checklistText.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      jobCode: jobForm.jobCode.trim() || `JOB-${String(Date.now()).slice(-4)}`,
      jobName: jobForm.jobName.trim(),
      category: jobForm.category || 'Vehicle Service',
      standardLaborFee: Number(jobForm.standardLaborFee) || 0,
      nextServiceOdometer: Number(jobForm.nextServiceOdometer) || 0,
      description: jobForm.description || '',
      defaultChecklist: checklist
    };

    try {
      const url = isEditingJob && editingJobId ? `/api/jobs/${editingJobId}` : '/api/jobs';
      const method = isEditingJob && editingJobId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        showNotification(isEditingJob ? `Updated job "${payload.jobName}"` : `Added job "${payload.jobName}" to catalog!`);
        setJobForm(emptyJobForm);
        setIsEditingJob(false);
        setEditingJobId(null);
        await loadJobs();
      } else {
        showNotification(json.message || 'Error saving job', 'error');
      }
    } catch (err) {
      showNotification('Error saving job: ' + err.message, 'error');
    }
  };

  const handleEditJob = (job) => {
    setJobForm({
      jobCode: job.jobCode || '',
      jobName: job.jobName || '',
      category: job.category || 'Vehicle Service',
      standardLaborFee: job.standardLaborFee !== undefined ? String(job.standardLaborFee) : '',
      nextServiceOdometer: job.nextServiceOdometer ? String(job.nextServiceOdometer) : '',
      description: job.description || '',
      checklistText: Array.isArray(job.defaultChecklist) ? job.defaultChecklist.join('\n') : ''
    });
    setIsEditingJob(true);
    setEditingJobId(job.id || job._id);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job from the catalog?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification('Job deleted from catalog');
        await loadJobs();
      } else {
        showNotification(json.message || 'Failed to delete job', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const loadFinancials = async () => {
    try {
      setLoadingFinancials(true);
      const res = await fetch('/api/financials');
      const data = await res.json();
      if (data && !data.error) {
        setFinancials(data);
      }
    } catch (err) {
      console.error('Failed to load financials:', err);
    } finally {
      setLoadingFinancials(false);
    }
  };

  const loadExpenses = async () => {
    try {
      setLoadingExpenses(true);
      const res = await fetch('/api/expenses');
      const data = await res.json();
      if (Array.isArray(data)) {
        setExpenses(data);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const handleAddCustomExpenseCategory = () => {
    const trimmed = customExpenseCategory.trim();
    if (!trimmed) {
      showNotification('Please enter a custom category name', 'error');
      return;
    }
    if (!expenseCategories.includes(trimmed)) {
      setExpenseCategories((prev) => {
        const withoutOther = prev.filter((c) => c !== 'Other');
        return [...withoutOther, trimmed, 'Other'];
      });
    }
    setNewExpenseData((prev) => ({ ...prev, category: trimmed }));
    setCustomExpenseCategory('');
    showNotification(`Category "${trimmed}" added!`);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!newExpenseData.description || !newExpenseData.amount) {
      showNotification('Description and amount are required', 'error');
      return;
    }
    let finalCategory = newExpenseData.category;
    if (finalCategory === 'Other' && customExpenseCategory.trim()) {
      finalCategory = customExpenseCategory.trim();
      if (!expenseCategories.includes(finalCategory)) {
        setExpenseCategories((prev) => {
          const withoutOther = prev.filter((c) => c !== 'Other');
          return [...withoutOther, finalCategory, 'Other'];
        });
      }
    }
    try {
      const url = isEditingExpense && editingExpenseId ? `/api/expenses?id=${editingExpenseId}` : '/api/expenses';
      const method = isEditingExpense && editingExpenseId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExpenseData,
          category: finalCategory,
          amount: Number(newExpenseData.amount)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(isEditingExpense ? 'Expense updated!' : `Expense logged: LKR ${Number(newExpenseData.amount).toLocaleString()}`);
        setNewExpenseData({
          category: 'Electricity',
          description: '',
          payeeType: 'Other',
          payee: '',
          amount: '',
          expenseDate: new Date().toISOString().split('T')[0],
          dueDate: new Date().toISOString().split('T')[0],
          txnType: 'Expense',
          paymentMethod: 'Cash',
          status: 'Should Pay Today',
          notes: ''
        });
        setCustomExpenseCategory('');
        setIsEditingExpense(false);
        setEditingExpenseId(null);
        await Promise.all([loadExpenses(), loadFinancials()]);
      } else {
        showNotification(data.error || 'Failed to save expense', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleEditExpense = (exp) => {
    const cat = exp.category || 'Electricity';
    if (cat && !expenseCategories.includes(cat)) {
      setExpenseCategories((prev) => {
        const withoutOther = prev.filter((c) => c !== 'Other');
        return [...withoutOther, cat, 'Other'];
      });
    }
    setNewExpenseData({
      category: cat,
      description: exp.description || '',
      payeeType: exp.payeeType === 'Worker' ? 'Worker' : 'Other',
      payee: exp.payee || '',
      amount: exp.amount || '',
      expenseDate: exp.expenseDate || new Date().toISOString().split('T')[0],
      dueDate: exp.dueDate || new Date().toISOString().split('T')[0],
      txnType: exp.txnType || 'Expense',
      paymentMethod: exp.paymentMethod || 'Cash',
      status: exp.status || 'Should Pay Today',
      notes: exp.notes || ''
    });
    setIsEditingExpense(true);
    setEditingExpenseId(exp.id || exp._id);
    window.scrollTo({ top: 200, behavior: 'smooth' });
    showNotification(`Editing expense "${exp.description}"`);
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense entry?')) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Expense deleted');
        await Promise.all([loadExpenses(), loadFinancials()]);
      }
    } catch (err) {
      showNotification('Error deleting expense: ' + err.message, 'error');
    }
  };

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/database/config');
      const data = await res.json();
      setDbStatus(data);
      if (data.uriMasked && !dbConfigUri) {
        setDbConfigUri(data.uriMasked);
      }
    } catch {
      setDbStatus({ connected: false, mode: 'Offline' });
    }
  };

  const fetchSyncStatus = async (autoSyncIfOnline = false) => {
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      setSyncStatus(prev => ({
        ...prev,
        pendingCount: data.pendingCount || 0,
        lastSyncedAt: data.lastSyncedAt || null,
        lastSyncError: data.lastSyncError || null
      }));
      if (typeof data.connected === 'boolean') {
        setDbStatus(prev => ({ ...prev, connected: data.connected }));
      }
      if (autoSyncIfOnline && data.connected && (data.pendingCount || 0) > 0) {
        await handleSyncNow(true);
      }
    } catch {
      // ignore offline polling errors
    }
  };

  const handleSyncNow = async (silent = false) => {
    setSyncStatus(prev => ({ ...prev, syncing: true }));
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      setSyncStatus({
        pendingCount: data.pendingCount || 0,
        lastSyncedAt: data.lastSyncedAt || null,
        lastSyncError: data.error || data.lastSyncError || null,
        syncing: false
      });
      await fetchDbStatus();
      if (data.success) {
        await Promise.all([
          loadVehicles(),
          loadCatalogItems(),
          loadSuppliers(),
          loadSupplierInvoices(),
          loadFinancials(),
          loadExpenses(),
          loadJobs(),
          loadAllServices()
        ]);
        if (!silent || (data.syncedCount || 0) > 0) {
          showNotification(
            (data.syncedCount || 0) > 0
              ? `Synced ${data.syncedCount} offline change(s) & pulled latest online data!`
              : 'Synced & refreshed latest online data!'
          );
        }
      } else if (!silent) {
        showNotification(data.error || 'Still offline. Changes remain saved locally.', 'error');
      }
    } catch (err) {
      setSyncStatus(prev => ({ ...prev, syncing: false }));
      if (!silent) {
        showNotification('Sync failed: ' + err.message, 'error');
      }
    }
  };

  const handleSaveDbUri = async (e) => {
    if (e) e.preventDefault();
    if (!dbConfigUri.trim()) {
      showNotification('Please enter a MongoDB connection string!', 'error');
      return;
    }
    try {
      setDbSaving(true);
      const res = await fetch('/api/database/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: dbConfigUri.trim() })
      });
      const data = await res.json();
      setDbStatus(data);
      if (data.connected) {
        showNotification('Successfully connected to MongoDB! Connection link saved.');
        setShowDbConfigModal(false);
      } else {
        showNotification(data.message || 'Connection failed. Please check credentials or network access.', 'error');
      }
      await Promise.all([
        loadVehicles(),
        loadCatalogItems(),
        loadSuppliers(),
        loadSupplierInvoices(),
        loadFinancials(),
        loadExpenses()
      ]);
    } catch (err) {
      showNotification('Error saving DB link: ' + err.message, 'error');
    } finally {
      setDbSaving(false);
    }
  };

  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const res = await fetch('/api/vehicles');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setVehicles(json.data);
      }
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const loadCatalogItems = async () => {
    try {
      const res = await fetch('/api/items');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCatalogItems(json.data);
      }
    } catch (err) {
      console.error('Failed to load catalog items:', err);
    }
  };

  const loadSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const res = await fetch('/api/suppliers');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSuppliers(json.data);
      }
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const loadSupplierInvoices = async () => {
    try {
      const res = await fetch('/api/supplier-invoices');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSupplierInvoices(json.data);
      }
    } catch (err) {
      console.error('Failed to load supplier invoices:', err);
    }
  };

  // When selected vehicle changes, fetch service history
  useEffect(() => {
    if (selectedServiceVehicleNo) {
      fetchServiceHistory(selectedServiceVehicleNo);
      const selectedVeh = vehicles.find(v => v.vehicleNo.toUpperCase() === selectedServiceVehicleNo.toUpperCase());
      if (selectedVeh) {
        setServiceForm(prev => ({
          ...prev,
          vehicleNo: selectedVeh.vehicleNo
        }));
      }
    } else {
      setServiceHistory([]);
    }
  }, [selectedServiceVehicleNo]);

  const fetchServiceHistory = async (vehNo) => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`/api/services?vehicleNo=${encodeURIComponent(vehNo)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setServiceHistory(json.data);
        if (json.data.length > 0) {
          const lastOdo = json.data[0].meterReading || json.data[0].odometer || 0;
          setServiceForm(prev => ({
            ...prev,
            meterReading: prev.meterReading || (lastOdo ? lastOdo + 5000 : ''),
            nextServiceMeter: lastOdo ? lastOdo + 10000 : ''
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const currentServiceVehicle = useMemo(() => {
    return vehicles.find(v => v.vehicleNo.toUpperCase() === selectedServiceVehicleNo.toUpperCase()) || null;
  }, [vehicles, selectedServiceVehicleNo]);

  // When user selects/adds a Service Type (supports multiple services from Job Master)
  const handleServiceTypeChange = (typeName) => {
    if (!typeName) return;
    const registeredJob = jobs.find(j => j.jobName === typeName || j.jobCode === typeName);
    const pkg = !registeredJob ? SERVICE_PACKAGES.find(p => p.name === typeName) : null;

    const jobName = registeredJob ? registeredJob.jobName : (pkg ? pkg.name : typeName);
    const jobCode = registeredJob ? (registeredJob.jobCode || '') : '';
    const laborFee = registeredJob
      ? (Number(registeredJob.standardLaborFee) || 0)
      : (pkg ? Number(pkg.baseFee) || 0 : 4000);
    const nextOdo = registeredJob ? (Number(registeredJob.nextServiceOdometer) || 0) : 0;
    const newChecklist = registeredJob
      ? (registeredJob.defaultChecklist || [])
      : (pkg ? pkg.checklist || [] : []);
    const desc = registeredJob
      ? (registeredJob.description || `${jobName} service`)
      : (pkg?.description || '');

    setServiceForm(prev => {
      const currentList = Array.isArray(prev.selectedServices) ? prev.selectedServices : [];
      if (currentList.some(s => s.jobName === jobName)) {
        return prev;
      }
      const updatedList = [...currentList, { jobCode, jobName, laborFee, nextServiceOdometer: nextOdo }];
      const totalLabor = updatedList.reduce((sum, s) => sum + (Number(s.laborFee) || 0), 0);
      const mergedChecklist = Array.from(new Set([...(prev.checklist || []), ...newChecklist]));
      return {
        ...prev,
        selectedServices: updatedList,
        serviceType: updatedList.map(s => s.jobName).join(' + '),
        laborCharges: totalLabor,
        nextServiceMeter: nextOdo > 0 ? String(nextOdo) : prev.nextServiceMeter,
        checklist: mergedChecklist.length > 0 ? mergedChecklist : prev.checklist,
        jobDetails: updatedList.length === 1 && desc ? desc : updatedList.map(s => s.jobName).join(', ')
      };
    });

    showNotification(`Added "${jobName}" (LKR ${laborFee.toLocaleString()})`);
  };

  const handleRemoveSelectedService = (jobName) => {
    setServiceForm(prev => {
      const currentList = Array.isArray(prev.selectedServices) ? prev.selectedServices : [];
      const updatedList = currentList.filter(s => s.jobName !== jobName);
      const totalLabor = updatedList.reduce((sum, s) => sum + (Number(s.laborFee) || 0), 0);
      return {
        ...prev,
        selectedServices: updatedList,
        serviceType: updatedList.map(s => s.jobName).join(' + '),
        laborCharges: totalLabor
      };
    });
  };

  // Auto-fill recommended items for the selected package (e.g. Full Service items)
  const handleApplyRecommendedPackageItems = () => {
    const pkg = SERVICE_PACKAGES.find(p => p.name === serviceForm.serviceType);
    if (!pkg || pkg.recommendedItems.length === 0) {
      showNotification('No preset items for this service type. You can add items manually below.', 'error');
      return;
    }
    setServiceForm(prev => ({
      ...prev,
      parts: [...pkg.recommendedItems]
    }));
    showNotification(`Applied ${pkg.recommendedItems.length} recommended items for ${pkg.name}!`);
  };

  // Used Items calculations
  const handleAddCustomPart = () => {
    setServiceForm(prev => ({
      ...prev,
      parts: [
        ...prev.parts,
        { code: '', name: '', supplier: '', supplierName: '', quantity: 1, unitPrice: 0, total: 0 }
      ]
    }));
  };

  const handleSelectCatalogItem = (index, selectedVal) => {
    const found = catalogItems.find(
      i => i.id === selectedVal || i._id === selectedVal || i.itemCode === selectedVal
    );
    if (!found) return;

    setServiceForm(prev => {
      const updated = [...prev.parts];
      const qty = updated[index]?.quantity || 1;
      const price = found.sellingPrice || 0;
      updated[index] = {
        itemId: found.id || found._id || '',
        code: found.itemCode,
        name: found.description,
        supplier: found.supplierName || 'General',
        supplierName: found.supplierName || 'General',
        quantity: qty,
        unitPrice: price,
        total: qty * price
      };
      return { ...prev, parts: updated };
    });
  };

  // Add custom on-the-spot part from supplier during active servicing
  const handleSaveCustomSupplierPart = async (e) => {
    if (e) e.preventDefault();
    if (!customSupplierPartForm.description) {
      showNotification('Please enter the part name/description!', 'error');
      return;
    }
    const qty = Number(customSupplierPartForm.quantity) > 0 ? Number(customSupplierPartForm.quantity) : 1;
    const price = Number(customSupplierPartForm.unitPrice) || 0;
    const supName = customSupplierPartForm.supplierName.trim() || 'General';
    const code = customSupplierPartForm.itemCode.trim() || `PART-${Date.now().toString().slice(-5)}`;

    setServiceForm(prev => ({
      ...prev,
      parts: [
        ...prev.parts,
        {
          code,
          name: customSupplierPartForm.description,
          supplier: supName,
          supplierName: supName,
          quantity: qty,
          unitPrice: price,
          total: qty * price
        }
      ]
    }));

    if (customSupplierPartForm.saveToCatalog) {
      try {
        await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supplierName: supName,
            itemCode: code,
            description: customSupplierPartForm.description,
            category: 'Auto Parts',
            sellingPrice: price,
            costPrice: price * 0.75,
            qtyOnHand: 10
          })
        });
        await loadCatalogItems();
      } catch (err) {
        console.warn('Could not save part to catalog:', err);
      }
    }

    showNotification(`Added ${qty}x "${customSupplierPartForm.description}" (${supName}) to service bill!`);
    setShowAddCustomSupplierPartModal(false);
    setCustomSupplierPartForm({
      supplierName: '',
      description: '',
      itemCode: '',
      quantity: 1,
      unitPrice: '',
      saveToCatalog: true
    });
  };

  // Add supplier part to an already logged service record while job finishes
  const handleAddPartToExistingService = async (serviceRecord) => {
    if (!appendPartSelectedCode) {
      showNotification('Please select a supplier part to add!', 'error');
      return;
    }
    const found = catalogItems.find(
      i => i.id === appendPartSelectedCode || i._id === appendPartSelectedCode || i.itemCode === appendPartSelectedCode
    );
    if (!found) return;

    const foundId = found.id || found._id || '';
    const foundSupplier = found.supplierName || 'General';
    const qty = Number(appendPartQty) > 0 ? Number(appendPartQty) : 1;
    const price = Number(found.sellingPrice) || 0;
    const addedTotal = qty * price;

    const existingParts = serviceRecord.parts || [];
    const updatedParts = [...existingParts];
    const existingIdx = updatedParts.findIndex(p => {
      const sameItem = foundId && p.itemId ? p.itemId === foundId : p.code === found.itemCode;
      const samePrice = Number(p.unitPrice || p.rate || 0) === price;
      const sameSupplier = (p.supplierName || p.supplier || 'General') === foundSupplier;
      return sameItem && samePrice && sameSupplier;
    });
    if (existingIdx !== -1) {
      const cur = updatedParts[existingIdx];
      const newQty = (cur.quantity || cur.qty || 1) + qty;
      updatedParts[existingIdx] = {
        ...cur,
        supplier: foundSupplier,
        supplierName: foundSupplier,
        quantity: newQty,
        total: newQty * (cur.unitPrice || cur.rate || price)
      };
    } else {
      updatedParts.push({
        itemId: foundId,
        code: found.itemCode,
        name: found.description,
        supplier: foundSupplier,
        supplierName: foundSupplier,
        quantity: qty,
        unitPrice: price,
        total: addedTotal
      });
    }

    const newPartsTotal = updatedParts.reduce((s, p) => s + (Number(p.total) || 0), 0);
    const labor = Number(serviceRecord.jobTotal || serviceRecord.laborCharges || 0);
    const dis = Number(serviceRecord.totalDis || serviceRecord.discount || 0);
    const newGrandTotal = Math.max(0, labor + newPartsTotal - dis);

    const updatedItems = [
      ...updatedParts.map((p, i) => ({
        no: i + 1,
        code: p.code || `ITEM-${i + 1}`,
        supplierName: p.supplier || p.supplierName || '',
        description: p.name,
        qty: p.quantity,
        rate: p.unitPrice,
        dis: 0,
        amount: p.total,
        itemType: 'item'
      })),
      {
        no: updatedParts.length + 1,
        code: 'JOB-SVC-FEE',
        description: `${serviceRecord.serviceType || 'Service'} Labor Charge`,
        qty: 1,
        rate: labor,
        dis: 0,
        amount: labor,
        itemType: 'job'
      }
    ];

    try {
      const res = await fetch(`/api/services/${serviceRecord._id || serviceRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parts: updatedParts,
          items: updatedItems,
          partsTotal: newPartsTotal,
          totalAmount: labor + newPartsTotal,
          grandTotal: newGrandTotal,
          billTotal: newGrandTotal
        })
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Added ${qty}x "${found.description}" to bill #${serviceRecord.invoiceNo}! Total is now LKR ${newGrandTotal.toLocaleString()}`);
        setServiceToAppendParts(null);
        setAppendPartSelectedCode('');
        setAppendPartQty(1);
        if (selectedServiceVehicleNo) {
          await fetchServiceHistory(selectedServiceVehicleNo);
        }
        await loadFinancials();
      } else {
        showNotification(json.message || 'Could not update service bill', 'error');
      }
    } catch (err) {
      showNotification('Error updating bill: ' + err.message, 'error');
    }
  };

  const handlePartFieldChange = (index, field, value) => {
    setServiceForm(prev => {
      const updated = [...prev.parts];
      const cur = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        const q = Number(field === 'quantity' ? value : cur.quantity) || 0;
        const p = Number(field === 'unitPrice' ? value : cur.unitPrice) || 0;
        cur.total = q * p;
      }
      updated[index] = cur;
      return { ...prev, parts: updated };
    });
  };

  const handleRemovePart = (index) => {
    setServiceForm(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index)
    }));
  };

  // REAL-TIME TOTAL CALCULATIONS:
  const usedItemsSubtotal = useMemo(() => {
    return serviceForm.parts.reduce((sum, p) => sum + (Number(p.total) || 0), 0);
  }, [serviceForm.parts]);

  const serviceLaborCharge = useMemo(() => {
    return Number(serviceForm.laborCharges) || 0;
  }, [serviceForm.laborCharges]);

  const discountAmount = useMemo(() => {
    return Number(serviceForm.discount) || 0;
  }, [serviceForm.discount]);

  const totalServiceCharges = useMemo(() => {
    return Math.max(0, serviceLaborCharge + usedItemsSubtotal - discountAmount);
  }, [serviceLaborCharge, usedItemsSubtotal, discountAmount]);

  const toggleChecklist = (task) => {
    setServiceForm(prev => {
      const has = prev.checklist.includes(task);
      return {
        ...prev,
        checklist: has ? prev.checklist.filter(t => t !== task) : [...prev.checklist, task]
      };
    });
  };

  // SAVE SERVICE TO MONGODB
  const handleSaveServiceRecord = async (e) => {
    if (e) e.preventDefault();
    if (!selectedServiceVehicleNo) {
      showNotification('Please select a vehicle first!', 'error');
      return;
    }
    if (!serviceForm.serviceDate) {
      showNotification('Please select the Service Date!', 'error');
      return;
    }
    if (!serviceForm.meterReading) {
      showNotification('Please enter the current odometer / mileage reading (KM)!', 'error');
      return;
    }
    if (!serviceForm.serviceType) {
      showNotification('Please select a Service / Job Type!', 'error');
      return;
    }

    setSavingService(true);
    try {
      const payload = {
        vehicleNo: selectedServiceVehicleNo.toUpperCase(),
        invoiceNo: serviceForm.serviceNo || `INV-N${Math.floor(8000 + Math.random() * 1999)}`,
        customerType: currentServiceVehicle?.csStatus || 'Regular',
        csName: currentServiceVehicle?.csName || '',
        csAddress: currentServiceVehicle?.address || '',
        telephone: currentServiceVehicle?.mobileTel || currentServiceVehicle?.homeTel || '',
        city: currentServiceVehicle?.city || '',
        vModel: currentServiceVehicle?.vModel || '',
        engineNo: currentServiceVehicle?.engineNo || '',
        chassisNo: currentServiceVehicle?.chassisNo || '',
        jobDetails: serviceForm.jobDetails || `${serviceForm.serviceType} performed with used parts`,
        meterReading: Number(serviceForm.meterReading) || 0,
        jobDone: 'Completed',
        serviceDate: serviceForm.serviceDate || todayStr,
        serviceTime: serviceForm.serviceTime,
        serviceType: serviceForm.serviceType,
        paymentType: serviceForm.paymentMethod || 'CASH',
        // Breakdown calculations:
        partsTotal: usedItemsSubtotal,
        jobTotal: serviceLaborCharge,
        totalAmount: serviceLaborCharge + usedItemsSubtotal,
        totalDis: discountAmount,
        grandTotal: totalServiceCharges,
        billTotal: totalServiceCharges,
        nextServiceDate: serviceForm.nextServiceDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextServiceMeter: Number(serviceForm.nextServiceMeter) || (Number(serviceForm.meterReading) + 5000),
        status: 'Invoiced',
        checklist: serviceForm.checklist,
        parts: serviceForm.parts.map(p => ({
          itemId: p.itemId || '',
          code: p.code || '',
          name: p.name || '',
          supplier: p.supplier || p.supplierName || 'General',
          supplierName: p.supplier || p.supplierName || 'General',
          quantity: Number(p.quantity) || 1,
          unitPrice: Number(p.unitPrice) || 0,
          total: Number(p.total) || 0
        })),
        technician: serviceForm.technician,
        technicianNotes: serviceForm.technicianNotes,
        items: [
          ...serviceForm.parts.map((p, i) => ({
            no: i + 1,
            code: p.code || `ITEM-${i + 1}`,
            supplierName: p.supplier || p.supplierName || 'General',
            description: p.name,
            qty: Number(p.quantity) || 1,
            rate: Number(p.unitPrice) || 0,
            dis: 0,
            amount: Number(p.total) || 0,
            itemType: 'item'
          })),
          ...(Array.isArray(serviceForm.selectedServices) && serviceForm.selectedServices.length > 0
            ? serviceForm.selectedServices.map((srv, idx) => ({
                no: serviceForm.parts.length + idx + 1,
                code: srv.jobCode || `JOB-${idx + 1}`,
                description: srv.jobName,
                qty: 1,
                rate: Number(srv.laborFee) || 0,
                dis: 0,
                amount: Number(srv.laborFee) || 0,
                itemType: 'job'
              }))
            : [{
                no: serviceForm.parts.length + 1,
                code: 'JOB-SVC-FEE',
                description: `${serviceForm.serviceType} Base Labor & Safety Inspection Fee`,
                qty: 1,
                rate: serviceLaborCharge,
                dis: 0,
                amount: serviceLaborCharge,
                itemType: 'job'
              }])
        ]
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (res.ok && json.success) {
        await Promise.all([
          fetchServiceHistory(selectedServiceVehicleNo),
          loadFinancials(),
          loadAllServices(),
          loadCatalogItems(),
          fetchSyncStatus()
        ]);
        // Automatically open the printable invoice / customer bill in another page
        const billKey = json.data._id || json.data.id || json.data.invoiceNo;
        let popupBlocked = false;
        if (typeof window !== 'undefined') {
          const popup = window.open(`/bill/${encodeURIComponent(billKey)}`, '_blank');
          if (!popup) popupBlocked = true;
        }
        showNotification(
          popupBlocked
            ? `Service saved (LKR ${totalServiceCharges.toLocaleString()})! Tap "Print Bill" in History to view invoice.`
            : `Service recorded! Total Charges: LKR ${totalServiceCharges.toLocaleString()}`
        );
        setVehicleSubTab('history');
        setServiceSubTab('history');
      } else {
        showNotification(json.message || 'Error saving service', 'error');
      }
    } catch (err) {
      showNotification('Save error: ' + err.message, 'error');
    } finally {
      setSavingService(false);
    }
  };

  // --- VEHICLE REGISTRATION CRUD (Cs/Vehicle) ---
  const handleSaveVehicle = async (e) => {
    if (e) e.preventDefault();
    if (isEditingVehicle) {
      return handleUpdateVehicle();
    }
    if (!vehicleForm.vehicleNo.trim() || !vehicleForm.csName.trim()) {
      showNotification('Vehicle Number and Customer Name are required!', 'error');
      return;
    }

    try {
      const payload = {
        ...vehicleForm,
        rNo: vehicleForm.rNo || `R-${String(vehicles.length + 1).padStart(3, '0')}`,
        vehicleNo: vehicleForm.vehicleNo.trim().toUpperCase(),
        tagNo: vehicleForm.tagNo || `TAG-${Math.floor(100 + Math.random() * 900)}`
      };

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        showNotification(`Vehicle ${payload.vehicleNo} saved successfully!`);
        await loadVehicles();
        setVehicleForm({ ...payload, id: json.data._id || json.data.id });
        setIsEditingVehicle(true);
      } else {
        showNotification(json.message || 'Failed to save', 'error');
      }
    } catch (err) {
      showNotification('Error saving: ' + err.message, 'error');
    }
  };

  const handleUpdateVehicle = async () => {
    const targetId = vehicleForm.id || vehicleForm._id;
    if (!targetId) return showNotification('Please select an existing vehicle to update.', 'error');

    try {
      const res = await fetch(`/api/vehicles/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm)
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Vehicle ${vehicleForm.vehicleNo} updated.`);
        await loadVehicles();
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleDeleteVehicle = async () => {
    const targetId = vehicleForm.id || vehicleForm._id;
    if (!targetId) return showNotification('No vehicle selected to delete', 'error');
    if (!confirm(`Delete vehicle ${vehicleForm.vehicleNo}?`)) return;

    try {
      const res = await fetch(`/api/vehicles/${targetId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification(`Vehicle ${vehicleForm.vehicleNo} deleted.`);
        await loadVehicles();
        handleClearVehicleForm();
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleClearVehicleForm = () => {
    setVehicleForm({
      ...emptyVehicleForm,
      rNo: `R-${String(vehicles.length + 1).padStart(3, '0')}`
    });
    setIsEditingVehicle(false);
  };

  const handleLoadVehicleIntoForm = (row) => {
    setVehicleForm({
      ...row,
      email: row.email || '',
      id: row._id || row.id,
      editVehicleNo: row.vehicleNo
    });
    setIsEditingVehicle(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
    showNotification(`Loaded vehicle ${row.vehicleNo}`);
  };

  // --- SUPPLIER ACTIONS (ADD, EDIT, DELETE) ---
  const handleSaveSupplier = async (e) => {
    if (e) e.preventDefault();
    if (!newSupplierData.supplierName || !newSupplierData.supplierName.trim()) {
      showNotification('Supplier Name is required!', 'error');
      return;
    }
    try {
      const payload = {
        supplierName: newSupplierData.supplierName.trim(),
        contactPerson: (newSupplierData.contactPerson || '').trim(),
        telephone: (newSupplierData.telephone || '').trim(),
        email: (newSupplierData.email || '').trim(),
        address: (newSupplierData.address || '').trim(),
        defaultCreditDays: newSupplierData.defaultCreditDays === '' ? 0 : Math.max(0, parseInt(newSupplierData.defaultCreditDays, 10) || 0),
        suppliedCategories: typeof newSupplierData.suppliedCategories === 'string'
          ? newSupplierData.suppliedCategories.split(',').map(s => s.trim()).filter(Boolean)
          : (Array.isArray(newSupplierData.suppliedCategories) ? newSupplierData.suppliedCategories : [])
      };

      const url = isEditingSupplier && editingSupplierId ? `/api/suppliers/${editingSupplierId}` : '/api/suppliers';
      const method = isEditingSupplier && editingSupplierId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        showNotification(isEditingSupplier ? `Supplier "${payload.supplierName}" updated successfully!` : `Supplier "${payload.supplierName}" registered!`);
        await loadSuppliers();
        await loadCatalogItems();
        setNewSupplierData({
          supplierName: '',
          contactPerson: '',
          telephone: '',
          email: '',
          address: '',
          defaultCreditDays: 30,
          suppliedCategories: 'Oils, Filters'
        });
        setIsEditingSupplier(false);
        setEditingSupplierId(null);
      } else {
        showNotification(json.message || 'Failed to save supplier', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleEditSupplier = (sup) => {
    setNewSupplierData({
      supplierName: sup.supplierName || '',
      contactPerson: sup.contactPerson || '',
      telephone: sup.telephone || '',
      email: sup.email || '',
      address: sup.address || '',
      defaultCreditDays: sup.defaultCreditDays !== undefined ? sup.defaultCreditDays : 30,
      suppliedCategories: Array.isArray(sup.suppliedCategories) ? sup.suppliedCategories.join(', ') : (sup.suppliedCategories || '')
    });
    setIsEditingSupplier(true);
    setEditingSupplierId(sup._id || sup.id);
    setActiveTab('Supplier');
    setSupplierSubTab('register');
    setTimeout(() => {
      const el = document.getElementById('supplier-edit-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
    }, 100);
    showNotification(`Editing supplier "${sup.supplierName}". Make your changes and click Save.`);
  };

  const handleDeleteSupplier = async (id, name) => {
    if (!confirm(`Are you sure you want to delete supplier "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification(`Supplier "${name}" deleted`);
        await loadSuppliers();
      } else {
        showNotification(json.message || 'Failed to delete supplier', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  // --- SUPPLIER INVOICE ACTIONS (ADD, EDIT, DELETE) ---
  const handleSaveSupplierInvoice = async (e) => {
    if (e) e.preventDefault();
    if (!newInvoiceData.supplierName || !newInvoiceData.invoiceNo || !newInvoiceData.invoiceAmount) {
      showNotification('Please fill all required invoice fields (Supplier, Invoice No, and Total Amount)!', 'error');
      return;
    }
    try {
      let finalDueDate = newInvoiceData.dueDate;
      if (!finalDueDate || !finalDueDate.trim()) {
        const invDate = newInvoiceData.invoiceDate ? new Date(newInvoiceData.invoiceDate) : new Date();
        invDate.setDate(invDate.getDate() + (Number(newInvoiceData.creditDays) || 0));
        finalDueDate = invDate.toISOString().split('T')[0];
      }

      const payload = {
        ...newInvoiceData,
        supplierName: newInvoiceData.supplierName.trim(),
        invoiceNo: newInvoiceData.invoiceNo.trim(),
        poGrnNo: (newInvoiceData.poGrnNo || '').trim(),
        invoiceAmount: Number(newInvoiceData.invoiceAmount) || 0,
        creditDays: newInvoiceData.creditDays !== undefined && newInvoiceData.creditDays !== '' ? Number(newInvoiceData.creditDays) : 30,
        dueDate: finalDueDate,
        items: (newInvoiceData.items || [])
          .filter(it => it && (it.description?.trim() || it.itemCode?.trim() || Number(it.total) > 0 || Number(it.unitPrice) > 0))
          .map(it => ({
            itemCode: (it.itemCode || '').trim(),
            description: (it.description || it.itemCode || 'Invoice Item').trim(),
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unitPrice) || 0,
            total: Number(it.total) || (Number(it.quantity || 1) * Number(it.unitPrice || 0))
          }))
      };

      const url = isEditingInvoice && editingInvoiceId ? `/api/supplier-invoices/${editingInvoiceId}` : '/api/supplier-invoices';
      const method = isEditingInvoice && editingInvoiceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        showNotification(isEditingInvoice ? `Invoice #${newInvoiceData.invoiceNo} updated!` : `Invoice #${newInvoiceData.invoiceNo} saved to database! Due on: ${json.data.dueDate}`);
        await Promise.all([loadSupplierInvoices(), loadFinancials()]);
        setNewInvoiceData({
          supplierName: '',
          invoiceNo: '',
          poGrnNo: '',
          receivedDate: new Date().toISOString().split('T')[0],
          invoiceDate: new Date().toISOString().split('T')[0],
          creditDays: 30,
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          invoiceAmount: '',
          items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
          notes: ''
        });
        setIsEditingInvoice(false);
        setEditingInvoiceId(null);
        setSupplierSubTab('tracker');
      } else {
        showNotification(json.message || 'Failed to save invoice', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleEditSupplierInvoice = (inv) => {
    setNewInvoiceData({
      supplierName: inv.supplierName || '',
      invoiceNo: inv.invoiceNo || '',
      poGrnNo: inv.poGrnNo || '',
      receivedDate: inv.receivedDate || new Date().toISOString().split('T')[0],
      invoiceDate: inv.invoiceDate || new Date().toISOString().split('T')[0],
      creditDays: inv.creditDays || 30,
      dueDate: inv.dueDate || '',
      invoiceAmount: inv.invoiceAmount || '',
      items: inv.items && inv.items.length > 0 ? inv.items : [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      notes: inv.notes || ''
    });
    setIsEditingInvoice(true);
    setEditingInvoiceId(inv.id || inv._id || inv.invoiceId);
    setSupplierSubTab('add_invoice');
    window.scrollTo({ top: 120, behavior: 'smooth' });
    showNotification(`Editing invoice #${inv.invoiceNo}`);
  };

  const handleDeleteSupplierInvoice = async (id, invoiceNo) => {
    if (!confirm(`Are you sure you want to delete invoice #${invoiceNo}?`)) return;
    try {
      const res = await fetch(`/api/supplier-invoices/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification(`Invoice #${invoiceNo} deleted`);
        await Promise.all([loadSupplierInvoices(), loadFinancials()]);
      } else {
        showNotification(json.message || 'Failed to delete invoice', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  // --- SUPPLIER PAYMENT & CHEQUE ACTIONS ---
  const handleUpdatePaymentStatus = async (invoiceId, paymentId, newStatus) => {
    try {
      const res = await fetch(`/api/supplier-invoices/${invoiceId}/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chequeStatus: newStatus,
          clearedDate: newStatus === 'Cleared' ? new Date().toISOString().split('T')[0] : ''
        })
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Payment status updated to ${newStatus}`);
        await Promise.all([loadSupplierInvoices(), loadFinancials()]);
      } else {
        showNotification(json.message || 'Failed to update payment status', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleDeletePayment = async (invoiceId, paymentId) => {
    if (!confirm('Are you sure you want to delete this payment record? The amount will be restored to the invoice balance.')) return;
    try {
      const res = await fetch(`/api/supplier-invoices/${invoiceId}/payments/${paymentId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        showNotification('Payment record deleted and invoice balance restored');
        await Promise.all([loadSupplierInvoices(), loadFinancials()]);
      } else {
        showNotification(json.message || 'Failed to delete payment', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  // --- ITEM CATALOG ACTIONS (ADD, EDIT, DELETE) ---
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.description.trim()) {
      showNotification('Item description is required', 'error');
      return;
    }
    let finalCategory = itemForm.category || 'General';
    if (finalCategory === 'Other') {
      const trimmed = customItemCategory.trim();
      if (!trimmed) {
        showNotification('Please enter the new category name!', 'error');
        return;
      }
      finalCategory = trimmed;
      if (!itemCategories.includes(trimmed)) {
        setItemCategories(prev => {
          const withoutOther = prev.filter(c => c !== 'Other');
          return [...withoutOther, trimmed, 'Other'];
        });
      }
    }
    try {
      const url = isEditingItem && editingItemId ? `/api/items/${editingItemId}` : '/api/items';
      const method = isEditingItem && editingItemId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itemForm, category: finalCategory })
      });
      const json = await res.json();
      if (json.success) {
        showNotification(isEditingItem ? `Item "${itemForm.description}" updated!` : `Item "${itemForm.description}" registered! Now add price & stock in Part 2.`);
        await loadCatalogItems();
        if (!isEditingItem && json.data) {
          setStockEntrySupplierFilter(json.data.supplierName || '');
          setStockEntryItemSearch('');
          setStockEntryForm((prev) => ({
            ...prev,
            selectedItemId: json.data.id || json.data._id || '',
            costPrice: json.data.costPrice || '',
            sellingPrice: json.data.sellingPrice || '',
            qtyToAdd: '',
            stockDate: new Date().toISOString().split('T')[0],
            stockTime: new Date().toTimeString().slice(0, 5)
          }));
        }
        setItemForm(emptyItemForm);
        setCustomItemCategory('');
        setIsEditingItem(false);
        setEditingItemId(null);
        setRegisterItemSupplierSearch('');
      } else {
        showNotification(json.message || 'Failed to save item', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleAddItemStock = async (e) => {
    e.preventDefault();
    if (!stockEntryForm.selectedItemId) {
      showNotification('Please select a registered item first!', 'error');
      return;
    }
    const targetItem = catalogItems.find(
      (i) => (i.id || i._id) === stockEntryForm.selectedItemId
    );
    if (!targetItem) {
      showNotification('Selected item not found', 'error');
      return;
    }
    const addedQty = Number(stockEntryForm.qtyToAdd) || 0;
    const finalStockUnit = stockEntryForm.stockUnit === 'Other'
      ? (stockEntryForm.customStockUnit || '').trim()
      : (stockEntryForm.stockUnit || targetItem.stockUnit || 'Bottles');
    if (stockEntryForm.stockUnit === 'Other' && !finalStockUnit) {
      showNotification('Please enter the custom unit / measurement name!', 'error');
      return;
    }
    const stockDate = stockEntryForm.stockDate || new Date().toISOString().split('T')[0];
    const stockTime = stockEntryForm.stockTime || new Date().toTimeString().slice(0, 5);
    const isInitialUnstocked =
      Number(targetItem.qtyOnHand || 0) === 0 &&
      Number(targetItem.costPrice || 0) === 0 &&
      Number(targetItem.sellingPrice || 0) === 0 &&
      !targetItem.stockDate;

    try {
      const res = isInitialUnstocked
        ? await fetch(`/api/items/${targetItem.id || targetItem._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              costPrice: Number(stockEntryForm.costPrice) || 0,
              sellingPrice: Number(stockEntryForm.sellingPrice) || 0,
              qtyOnHand: addedQty,
              stockUnit: finalStockUnit,
              stockDate,
              stockTime
            })
          })
        : await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              itemCode: targetItem.itemCode,
              barcode: targetItem.barcode || '',
              description: targetItem.description,
              supplierName: targetItem.supplierName || '',
              category: targetItem.category || 'General',
              costPrice: Number(stockEntryForm.costPrice) || 0,
              sellingPrice: Number(stockEntryForm.sellingPrice) || 0,
              qtyOnHand: addedQty,
              stockUnit: finalStockUnit,
              stockDate,
              stockTime
            })
          });
      const json = await res.json();
      if (json.success) {
        showNotification(
          isInitialUnstocked
            ? `Saved "${targetItem.description}" stock (+${addedQty} ${finalStockUnit}) & pricing!`
            : `Added new stock & price entry for "${targetItem.description}" (+${addedQty} ${finalStockUnit})!`
        );
        await loadCatalogItems();
        setStockEntryItemSearch('');
        setStockEntryForm({
          selectedItemId: '',
          costPrice: '',
          sellingPrice: '',
          qtyToAdd: '',
          stockUnit: 'Bottles',
          customStockUnit: '',
          stockDate: new Date().toISOString().split('T')[0],
          stockTime: new Date().toTimeString().slice(0, 5)
        });
      } else {
        showNotification(json.message || 'Failed to save stock & price', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleEditItem = (item, fromSupplierTab = false) => {
    setItemForm({
      id: item.id || item._id,
      itemCode: item.itemCode || '',
      barcode: item.barcode || '',
      description: item.description || '',
      supplierName: item.supplierName || '',
      category: item.category || 'Oils & Fluids',
      qtyOnHand: item.qtyOnHand || 0,
      costPrice: item.costPrice || 0,
      sellingPrice: item.sellingPrice || 0
    });
    setIsEditingItem(true);
    setEditingItemId(item.id || item._id);
    setShowItemForm(true);
    if (fromSupplierTab) {
      setSupplierSubTab('items');
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleStartInlineItemEdit = (item) => {
    const rowId = item.id || item._id || item.itemCode;
    setEditingItemRowId(rowId);
    setEditingItemRowData({
      supplierName: item.supplierName || '',
      itemCode: item.itemCode || '',
      barcode: item.barcode || '',
      description: item.description || '',
      category: item.category || 'General',
      qtyOnHand: item.qtyOnHand ?? 0,
      stockUnit: item.stockUnit || 'Bottles',
      costPrice: item.costPrice ?? 0,
      sellingPrice: item.sellingPrice ?? 0,
      stockDate: item.stockDate || '',
      stockTime: item.stockTime || ''
    });
  };

  const handleSaveInlineItemEdit = async (id) => {
    try {
      const res = await fetch(`/api/items/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingItemRowData,
          qtyOnHand: Number(editingItemRowData.qtyOnHand) || 0,
          costPrice: Number(editingItemRowData.costPrice) || 0,
          sellingPrice: Number(editingItemRowData.sellingPrice) || 0
        })
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Updated "${editingItemRowData.description}"!`);
        setEditingItemRowId(null);
        setEditingItemRowData({});
        await loadCatalogItems();
      } else {
        showNotification(json.message || 'Failed to update item', 'error');
      }
    } catch (err) {
      showNotification('Error updating item: ' + err.message, 'error');
    }
  };

  const handleCancelInlineItemEdit = () => {
    setEditingItemRowId(null);
    setEditingItemRowData({});
  };

  const handleQuickAddPartToService = () => {
    if (!quickSelectedPartCode) {
      showNotification('Please select an item from the dropdown first!', 'error');
      return;
    }
    const found = catalogItems.find(
      i => i.id === quickSelectedPartCode || i._id === quickSelectedPartCode || i.itemCode === quickSelectedPartCode
    );
    if (!found) return;

    const foundId = found.id || found._id || '';
    const foundSupplier = found.supplierName || 'General';
    const qty = Number(quickPartQty) > 0 ? Number(quickPartQty) : 1;
    const price = Number(found.sellingPrice) || 0;

    setServiceForm(prev => {
      const existingIdx = prev.parts.findIndex(p => {
        const sameItem = foundId && p.itemId ? p.itemId === foundId : p.code === found.itemCode;
        const samePrice = Number(p.unitPrice) === price;
        const sameSupplier = (p.supplierName || p.supplier || 'General') === foundSupplier;
        return sameItem && samePrice && sameSupplier;
      });
      if (existingIdx !== -1) {
        const updated = [...prev.parts];
        const newQty = updated[existingIdx].quantity + qty;
        updated[existingIdx] = {
          ...updated[existingIdx],
          supplier: foundSupplier,
          supplierName: foundSupplier,
          quantity: newQty,
          total: newQty * updated[existingIdx].unitPrice
        };
        return { ...prev, parts: updated };
      }

      return {
        ...prev,
        parts: [
          ...prev.parts,
          {
            itemId: foundId,
            code: found.itemCode,
            name: found.description,
            supplier: foundSupplier,
            supplierName: foundSupplier,
            quantity: qty,
            unitPrice: price,
            total: qty * price
          }
        ]
      };
    });

    showNotification(`Added ${qty}x "${found.description}" (${found.supplierName || 'General'}) to bill (LKR ${(qty * price).toLocaleString()})`);
    setQuickSelectedPartCode('');
    setQuickPartQty(1);
  };

  const handleDeleteItem = async (id, description) => {
    if (!confirm(`Are you sure you want to delete item "${description}"?`)) return;
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification(`Item "${description}" deleted`);
        await loadCatalogItems();
      } else {
        showNotification(json.message || 'Failed to delete item', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  const handleOpenPaymentModal = (invoice) => {
    setPayingInvoice(invoice);
    setPaymentFormData({
      amount: invoice.balance,
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'Cheque',
      chequeNo: `CHQ-${Math.floor(100000 + Math.random() * 900000)}`,
      chequeIssueDate: new Date().toISOString().split('T')[0],
      chequeStatus: 'Issued',
      clearedDate: '',
      bankAccount: 'Commercial Bank - Main',
      notes: `Settlement for Invoice #${invoice.invoiceNo}`
    });
  };

  const handleSubmitSupplierPayment = async (e) => {
    e.preventDefault();
    if (!payingInvoice) return;
    try {
      const res = await fetch(`/api/supplier-invoices/${payingInvoice.id || payingInvoice._id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentFormData)
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Payment of LKR ${Number(paymentFormData.amount).toLocaleString()} recorded for ${payingInvoice.supplierName}!`);
        await Promise.all([loadSupplierInvoices(), loadFinancials()]);
        setPayingInvoice(null);
      } else {
        showNotification(json.message || 'Payment recording failed', 'error');
      }
    } catch (err) {
      showNotification('Error: ' + err.message, 'error');
    }
  };

  // Supplier metrics calculations
  const supplierMetrics = useMemo(() => {
    let totalOutstanding = 0;
    let overdueCount = 0;
    let overdueAmount = 0;
    let upcomingDueCount = 0;

    supplierInvoices.forEach(inv => {
      const bal = Number(inv.balance) || 0;
      totalOutstanding += bal;
      if (inv.status === 'OVERDUE' && bal > 0) {
        overdueCount++;
        overdueAmount += bal;
      } else if (inv.status === 'ONGOING' && bal > 0) {
        upcomingDueCount++;
      }
    });

    return { totalOutstanding, overdueCount, overdueAmount, upcomingDueCount };
  }, [supplierInvoices]);

  // Filtered supplier invoices
  const filteredSupplierInvoices = useMemo(() => {
    return supplierInvoices.filter(inv => {
      const matchStatus = supplierFilterStatus === 'ALL' || inv.status === supplierFilterStatus;
      const q = supplierSearchQuery.toLowerCase();
      const matchQuery = !q ||
        inv.supplierName.toLowerCase().includes(q) ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        (inv.poGrnNo && inv.poGrnNo.toLowerCase().includes(q)) ||
        inv.invoiceId.includes(q);
      return matchStatus && matchQuery;
    });
  }, [supplierInvoices, supplierFilterStatus, supplierSearchQuery]);

  // All recorded payments for Cheque Register
  const allRecordedPayments = useMemo(() => {
    const list = [];
    supplierInvoices.forEach(inv => {
      if (Array.isArray(inv.payments)) {
        inv.payments.forEach(p => {
          list.push({
            ...p,
            supplierName: inv.supplierName,
            invoiceNo: inv.invoiceNo,
            invoiceId: inv.invoiceId,
            invoiceDbId: inv.id || inv._id
          });
        });
      }
    });
    // Sort by paymentDate descending
    list.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
    return list;
  }, [supplierInvoices]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchVehNo = vehicleFilters.vehicleNumber
        ? v.vehicleNo.toLowerCase().includes(vehicleFilters.vehicleNumber.toLowerCase())
        : true;
      const matchTag = vehicleFilters.tagNumber
        ? v.tagNo.toLowerCase().includes(vehicleFilters.tagNumber.toLowerCase())
        : true;
      const matchCsName = vehicleFilters.csName
        ? v.csName.toLowerCase().includes(vehicleFilters.csName.toLowerCase())
        : true;
      const matchCity = vehicleFilters.city
        ? v.city.toLowerCase().includes(vehicleFilters.city.toLowerCase())
        : true;
      const matchModel = vehicleFilters.vehicleModel
        ? v.vModel.toLowerCase().includes(vehicleFilters.vehicleModel.toLowerCase())
        : true;
      const matchDelivery = vehicleFilters.deliveryDate
        ? v.deliveryDate === vehicleFilters.deliveryDate
        : true;

      return matchVehNo && matchTag && matchCsName && matchCity && matchModel && matchDelivery;
    });
  }, [vehicles, vehicleFilters]);

  // Period Financial Report Computations (Revenue & Expenses Filtered by Date / Range / Month)
  const periodFilteredServices = useMemo(() => {
    return allServices.filter(s => {
      const d = s.serviceDate || s.createdAt?.split('T')[0];
      if (!d) return false;
      if (reportFilterType === 'date') return d === reportDate;
      if (reportFilterType === 'range') return (!reportStartDate || d >= reportStartDate) && (!reportEndDate || d <= reportEndDate);
      if (reportFilterType === 'month') return d.startsWith(reportMonth);
      return true; // 'all'
    });
  }, [allServices, reportFilterType, reportDate, reportStartDate, reportEndDate, reportMonth]);

  const periodFilteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = e.expenseDate || e.createdAt?.split('T')[0];
      if (!d) return false;
      if (reportFilterType === 'date') return d === reportDate;
      if (reportFilterType === 'range') return (!reportStartDate || d >= reportStartDate) && (!reportEndDate || d <= reportEndDate);
      if (reportFilterType === 'month') return d.startsWith(reportMonth);
      return true; // 'all'
    });
  }, [expenses, reportFilterType, reportDate, reportStartDate, reportEndDate, reportMonth]);

  const periodFilteredSupplierPayments = useMemo(() => {
    return allRecordedPayments.filter(p => {
      const d = p.paymentDate || p.createdAt?.split('T')[0];
      if (!d) return false;
      if (reportFilterType === 'date') return d === reportDate;
      if (reportFilterType === 'range') return (!reportStartDate || d >= reportStartDate) && (!reportEndDate || d <= reportEndDate);
      if (reportFilterType === 'month') return d.startsWith(reportMonth);
      return true; // 'all'
    });
  }, [allRecordedPayments, reportFilterType, reportDate, reportStartDate, reportEndDate, reportMonth]);

  const periodRevenueTotal = useMemo(() => {
    return periodFilteredServices.reduce((sum, s) => sum + Number(s.billTotal || s.grandTotal || s.totalAmount || 0), 0);
  }, [periodFilteredServices]);

  const periodOperatingExpensesTotal = useMemo(() => {
    return periodFilteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [periodFilteredExpenses]);

  const periodSupplierPaymentsTotal = useMemo(() => {
    return periodFilteredSupplierPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [periodFilteredSupplierPayments]);

  const periodTotalExpenses = periodOperatingExpensesTotal + periodSupplierPaymentsTotal;
  const periodNetProfit = periodRevenueTotal - periodTotalExpenses;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 overflow-x-hidden">
      {/* Top Application Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Clean Brand Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="bg-blue-600 p-2 sm:p-2.5 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-sm sm:text-lg font-black tracking-wider text-white uppercase">
              AUTO CARE SERVICE CENTER
            </h1>
          </div>

          {/* Online/Offline Status, Pending Queue & Sync Now */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDbConfigModal(true)}
              title="Database Connection Settings"
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                dbStatus.connected
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span>{dbStatus.connected ? 'ONLINE' : 'OFFLINE CACHE'}</span>
              {syncStatus.pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black text-[10px]">
                  {syncStatus.pendingCount} pending
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSyncNow(false)}
              disabled={syncStatus.syncing}
              title={syncStatus.lastSyncedAt ? `Last synced: ${new Date(syncStatus.lastSyncedAt).toLocaleString()}` : 'Push offline changes & pull online updates'}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.syncing ? 'animate-spin' : ''}`} />
              <span>{syncStatus.syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Clean, Focused Main Navigation Tabs: Vehicle Registration, Suppliers, Expenses, Service */}
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 flex overflow-x-auto scrollbar-none">
          {[
            { id: 'Cs/Vehicle', label: 'Vehicle', icon: Car },
            { id: 'Supplier', label: 'Suppliers', icon: Truck },
            { id: 'Expenses', label: 'Expenses', icon: TrendingUp },
            { id: 'Job', label: 'Job', icon: History },
          ].map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  if (id === 'Cs/Vehicle') {
                    setVehicleSubTab('registration');
                  }
                }}
                className={`px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 sm:gap-2.5 cursor-pointer ${isActive
                  ? 'border-blue-500 text-white bg-slate-800/90 shadow-inner'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase">{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-16 sm:top-20 left-3 right-3 sm:left-auto sm:right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold transition-all transform animate-bounce ${notification.type === 'error'
            ? 'bg-rose-600 text-white shadow-rose-900/40'
            : 'bg-emerald-600 text-white shadow-emerald-900/40'
            }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* =========================================================================
            TAB: SUPPLIER PAYMENT TRACKER & SUPPLIER REGISTRATION (MATCHES USER EXCEL)
            ========================================================================= */}
        {activeTab === 'Supplier' && (
          <div className="space-y-6">

            {/* Supplier Navigation Sub-Navbar (5 Focused Tabs) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap items-center gap-2 shadow-sm">
              <button
                type="button"
                onClick={() => setSupplierSubTab('register')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${supplierSubTab === 'register'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <Building2 className="w-4 h-4" />
                1. Register Suppliers (Supplier Master)
                {suppliers.length > 0 && (
                  <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {suppliers.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSupplierSubTab('items')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${supplierSubTab === 'items'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <Package className="w-4 h-4" />
                2. Supplier Items & Parts Catalog ({catalogItems.length})
              </button>

              <button
                type="button"
                onClick={() => setSupplierSubTab('add_invoice')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${supplierSubTab === 'add_invoice'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <Plus className="w-4 h-4" />
                3. Add Supplier Invoice / GRN
                {isEditingInvoice && (
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    Editing
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSupplierSubTab('tracker')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${supplierSubTab === 'tracker'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <FileText className="w-4 h-4" />
                4. Supplier Payment Tracker (Due Dates & Overdue Monitor)
                {supplierMetrics.overdueCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {supplierMetrics.overdueCount} Overdue
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSupplierSubTab('payments')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${supplierSubTab === 'payments'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <CreditCard className="w-4 h-4" />
                5. Payments Log & Cheque Register
                {allRecordedPayments.length > 0 && (
                  <span className="bg-slate-700 text-slate-200 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {allRecordedPayments.length}
                  </span>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

              {/* =========================================================================
                  SUB-VIEW 1: SUPPLIER MASTER REGISTRATION & VENDOR LIST (ADD, EDIT, DELETE)
                  ========================================================================= */}
              {supplierSubTab === 'register' && (
                <div className="p-6 space-y-6">
                  {/* Edit Banner if in edit mode */}
                  {isEditingSupplier ? (
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-300 p-4 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <Edit3 className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="font-bold text-sm text-amber-900">
                            Editing Supplier: <span className="underline">{newSupplierData.supplierName}</span>
                          </h4>
                          <p className="text-xs text-amber-700">
                            Update contact person, credit days, telephone, or addresses and click "Update Supplier".
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingSupplier(false);
                          setEditingSupplierId(null);
                          setNewSupplierData({
                            supplierName: '',
                            contactPerson: '',
                            telephone: '',
                            email: '',
                            address: '',
                            defaultCreditDays: 30,
                            suppliedCategories: 'Oils, Filters'
                          });
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        Cancel Edit
                      </button>
                    </div>
                  ) : (
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Register Suppliers (Supplier Master)
                      </h3>
                    </div>
                  )}

                  {/* Supplier Registration / Edit Form */}
                  <form
                    id="supplier-edit-anchor"
                    onSubmit={handleSaveSupplier}
                    className={`space-y-4 max-w-4xl p-5 rounded-xl border transition-all ${isEditingSupplier
                      ? 'bg-amber-50/70 border-2 border-amber-400 shadow-md ring-2 ring-amber-200'
                      : 'bg-slate-50/70 border border-slate-200'
                      }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Supplier / Business Name *
                        </label>
                        <input
                          type="text"
                          value={newSupplierData.supplierName}
                          onChange={(e) => setNewSupplierData({ ...newSupplierData, supplierName: e.target.value })}
                          placeholder="e.g. Mobil Lubricants or Evac"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          value={newSupplierData.contactPerson}
                          onChange={(e) => setNewSupplierData({ ...newSupplierData, contactPerson: e.target.value })}
                          placeholder="Sales Representative / Manager"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Telephone / Mobile
                        </label>
                        <input
                          type="text"
                          value={newSupplierData.telephone}
                          onChange={(e) => setNewSupplierData({ ...newSupplierData, telephone: e.target.value })}
                          placeholder="e.g. 011-2345678"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newSupplierData.email}
                          onChange={(e) => setNewSupplierData({ ...newSupplierData, email: e.target.value })}
                          placeholder="sales@supplier.com"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Default Credit Days Allowed (Days)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={newSupplierData.defaultCreditDays !== undefined ? newSupplierData.defaultCreditDays : ''}
                            onChange={(e) => setNewSupplierData({ ...newSupplierData, defaultCreditDays: e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0) })}
                            placeholder="e.g. 30"
                            className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-16 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-xs"
                            required
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
                            Days
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Supplied Item Categories
                        </label>
                        <input
                          type="text"
                          value={newSupplierData.suppliedCategories}
                          onChange={(e) => setNewSupplierData({ ...newSupplierData, suppliedCategories: e.target.value })}
                          placeholder="e.g. Oils, Filters, Brake Pads..."
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Supplier Office Address
                        </label>
                        <input
                          type="text"
                          value={newSupplierData.address}
                          onChange={(e) => setNewSupplierData({ ...newSupplierData, address: e.target.value })}
                          placeholder="Street, City, Postal Code"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className={`font-bold py-2.5 px-6 rounded-lg text-sm shadow transition flex items-center gap-2 cursor-pointer ${isEditingSupplier ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                      >
                        <Save className="w-4 h-4" />
                        {isEditingSupplier ? `Save Changes (${newSupplierData.supplierName || 'Supplier'})` : 'Register Supplier in System'}
                      </button>

                      {isEditingSupplier && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingSupplier(false);
                            setEditingSupplierId(null);
                            setNewSupplierData({
                              supplierName: '',
                              contactPerson: '',
                              telephone: '',
                              email: '',
                              address: '',
                              defaultCreditDays: 30,
                              suppliedCategories: 'Oils, Filters'
                            });
                          }}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-lg text-sm transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Registered Suppliers Table with Edit & Delete */}
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        Registered Suppliers Directory ({suppliers.length})
                      </h4>
                      <span className="text-xs text-slate-500">
                        Supports Add, Edit, Delete in both Live Database and Offline Cache
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                            <th className="py-2.5 px-3">Supplier Name</th>
                            <th className="py-2.5 px-3">Contact Person</th>
                            <th className="py-2.5 px-3">Telephone</th>
                            <th className="py-2.5 px-3">Email</th>
                            <th className="py-2.5 px-3 text-center">Credit Terms</th>
                            <th className="py-2.5 px-3">Supplied Categories</th>
                            <th className="py-2.5 px-3">Address</th>
                            <th className="py-2.5 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {suppliers.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="py-8 text-center text-slate-400">
                                No suppliers registered yet. Use the form above to register your first supplier.
                              </td>
                            </tr>
                          ) : (
                            suppliers.map((sup) => (
                              <tr key={sup.id || sup._id} className="hover:bg-slate-50 transition">
                                <td className="py-2.5 px-3 font-bold text-slate-900">{sup.supplierName}</td>
                                <td className="py-2.5 px-3 text-slate-700">{sup.contactPerson || '-'}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-700">{sup.telephone || '-'}</td>
                                <td className="py-2.5 px-3 text-slate-600">{sup.email || '-'}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${Number(sup.defaultCreditDays) === 0
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                    {sup.defaultCreditDays !== undefined && sup.defaultCreditDays !== null && sup.defaultCreditDays !== ''
                                      ? `${sup.defaultCreditDays} Days`
                                      : '30 Days'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">
                                  {Array.isArray(sup.suppliedCategories)
                                    ? sup.suppliedCategories.join(', ')
                                    : (sup.suppliedCategories || '-')}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">{sup.address || '-'}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSupplierItemFilter(sup.supplierName);
                                        setSupplierSubTab('items');
                                      }}
                                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                                      title="View / Edit items supplied by this vendor"
                                    >
                                      <Package className="w-3 h-3" />
                                      Items ({catalogItems.filter(i => i.supplierName === sup.supplierName).length})
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditSupplier(sup)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                                      title="Edit Supplier"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSupplier(sup.id || sup._id, sup.supplierName)}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                                      title="Delete Supplier"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW 2: SUPPLIER ITEMS & PARTS CATALOG (VISIBLE & EDITABLE UNDER SUPPLIER)
                  ========================================================================= */}
              {supplierSubTab === 'items' && (
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Sub-view Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        Supplier Items & Parts Catalog ({catalogItems.length})
                      </h3>
                    </div>
                  </div>

                  {/* 2-Part Item Management: Part 1 (Register Item) & Part 2 (Add Stock & Pricing for Selected Item) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PART 1: Register Item */}
                    <form onSubmit={handleSaveItem} className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          {isEditingItem ? <Edit3 className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-indigo-600" />}
                          {isEditingItem ? `Edit Registered Item: ${itemForm.itemCode}` : '1. Register Item'}
                        </h4>
                        {isEditingItem && (
                          <button
                            type="button"
                            onClick={() => {
                              setItemForm(emptyItemForm);
                              setIsEditingItem(false);
                              setEditingItemId(null);
                              setRegisterItemSupplierSearch('');
                            }}
                            className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="relative">
                          <label className="block font-bold text-slate-700 mb-1">Supplied by Vendor *</label>
                          <div className="relative mb-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={registerItemSupplierSearch}
                              onChange={(e) => setRegisterItemSupplierSearch(e.target.value)}
                              placeholder="Search supplier..."
                              className="w-full bg-white border border-slate-300 rounded pl-8 pr-7 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            {registerItemSupplierSearch && (
                              <button
                                type="button"
                                onClick={() => setRegisterItemSupplierSearch('')}
                                className="text-slate-400 hover:text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                title="Clear supplier search"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {registerItemSupplierSearch.trim() && (() => {
                              const q = registerItemSupplierSearch.trim().toLowerCase();
                              const matches = suppliers.filter(s =>
                                (s.supplierName && s.supplierName.toLowerCase().includes(q)) ||
                                (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
                                (s.telephone && s.telephone.toLowerCase().includes(q))
                              );
                              return (
                                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-indigo-300 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                                  {matches.length === 0 ? (
                                    <div className="px-3 py-2 text-xs text-slate-400 italic">No supplier matching &quot;{registerItemSupplierSearch}&quot;</div>
                                  ) : (
                                    matches.map(s => (
                                      <button
                                        key={s.id || s._id}
                                        type="button"
                                        onClick={() => {
                                          setItemForm({ ...itemForm, supplierName: s.supplierName });
                                          setRegisterItemSupplierSearch('');
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 flex items-center justify-between cursor-pointer ${
                                          itemForm.supplierName === s.supplierName ? 'bg-indigo-50 font-bold text-indigo-800' : 'text-slate-800'
                                        }`}
                                      >
                                        <span className="font-semibold">{s.supplierName}</span>
                                        {s.telephone && <span className="text-[10px] text-slate-400 font-mono">{s.telephone}</span>}
                                      </button>
                                    ))
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                          <select
                            value={itemForm.supplierName}
                            onChange={(e) => setItemForm({ ...itemForm, supplierName: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                          >
                            <option value="">-- Select Vendor --</option>
                            {suppliers
                              .filter(s => {
                                if (s.supplierName === itemForm.supplierName) return true;
                                if (!registerItemSupplierSearch.trim()) return true;
                                const q = registerItemSupplierSearch.trim().toLowerCase();
                                return (
                                  (s.supplierName && s.supplierName.toLowerCase().includes(q)) ||
                                  (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
                                  (s.telephone && s.telephone.toLowerCase().includes(q))
                                );
                              })
                              .map(s => (
                                <option key={s.id || s._id} value={s.supplierName}>
                                  {s.supplierName}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Item Code *</label>
                          <input
                            type="text"
                            value={itemForm.itemCode}
                            onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value.toUpperCase() })}
                            placeholder="e.g. OIL-MOBIL-5W30"
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Barcode / Part Number</label>
                          <input
                            type="text"
                            value={itemForm.barcode}
                            onChange={(e) => setItemForm({ ...itemForm, barcode: e.target.value })}
                            placeholder="e.g. 890123456789"
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Category</label>
                          <select
                            value={itemForm.category}
                            onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-semibold outline-none"
                          >
                            {itemCategories.map(cat => (
                              <option key={cat} value={cat}>
                                {cat === 'General' ? 'General Consumables' : cat}
                              </option>
                            ))}
                          </select>
                          {itemForm.category === 'Other' && (
                            <input
                              type="text"
                              value={customItemCategory}
                              onChange={(e) => setCustomItemCategory(e.target.value)}
                              placeholder="Enter new category name..."
                              className="mt-1.5 w-full bg-white border border-indigo-400 rounded px-3 py-1.5 text-xs text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
                              required
                            />
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Description / Product Name *</label>
                          <input
                            type="text"
                            value={itemForm.description}
                            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                            placeholder="e.g. Mobil Super 3000 Fully Synthetic 5W-30 4L"
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-4 h-4" />
                          {isEditingItem ? 'Update Registered Item' : 'Register Item'}
                        </button>
                      </div>
                    </form>

                    {/* PART 2: Add Items (Stock, Cost, Selling Price, Date & Time) for Selected Item */}
                    <form onSubmit={handleAddItemStock} className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          2. Add Stock & Pricing for Selected Item
                        </h4>
                        {stockEntryForm.selectedItemId && (() => {
                          const sel = catalogItems.find((i) => (i.id || i._id) === stockEntryForm.selectedItemId);
                          if (!sel) return null;
                          const totalStock = catalogItems
                            .filter((i) => i.itemCode === sel.itemCode && (i.supplierName || '') === (sel.supplierName || ''))
                            .reduce((sum, i) => sum + (Number(i.qtyOnHand) || 0), 0);
                          return (
                            <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                              Total Stock: {totalStock}
                            </span>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Top-Left: Search & Select Supplier */}
                        <div className="relative">
                          <label className="block font-bold text-slate-700 mb-1">Filter by Vendor</label>
                          <div className="relative mb-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={stockEntrySupplierSearch}
                              onChange={(e) => setStockEntrySupplierSearch(e.target.value)}
                              placeholder="Search supplier..."
                              className="w-full bg-white border border-slate-300 rounded pl-8 pr-7 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {stockEntrySupplierSearch && (
                              <button
                                type="button"
                                onClick={() => setStockEntrySupplierSearch('')}
                                className="text-slate-400 hover:text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                title="Clear supplier search"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {stockEntrySupplierSearch.trim() && (() => {
                              const q = stockEntrySupplierSearch.trim().toLowerCase();
                              const matches = suppliers.filter(s =>
                                (s.supplierName && s.supplierName.toLowerCase().includes(q)) ||
                                (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
                                (s.telephone && s.telephone.toLowerCase().includes(q))
                              );
                              return (
                                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-blue-300 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                                  {matches.length === 0 ? (
                                    <div className="px-3 py-2 text-xs text-slate-400 italic">No supplier matching &quot;{stockEntrySupplierSearch}&quot;</div>
                                  ) : (
                                    matches.map(s => (
                                      <button
                                        key={s.id || s._id}
                                        type="button"
                                        onClick={() => {
                                          setStockEntrySupplierFilter(s.supplierName);
                                          setStockEntrySupplierSearch('');
                                          setStockEntryItemSearch('');
                                          setStockEntryForm({
                                            ...stockEntryForm,
                                            selectedItemId: '',
                                            costPrice: '',
                                            sellingPrice: ''
                                          });
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between cursor-pointer ${
                                          stockEntrySupplierFilter === s.supplierName ? 'bg-blue-50 font-bold text-blue-800' : 'text-slate-800'
                                        }`}
                                      >
                                        <span className="font-semibold">{s.supplierName}</span>
                                        {s.telephone && <span className="text-[10px] text-slate-400 font-mono">{s.telephone}</span>}
                                      </button>
                                    ))
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                          <select
                            value={stockEntrySupplierFilter}
                            onChange={(e) => {
                              const vendor = e.target.value;
                              setStockEntrySupplierFilter(vendor);
                              setStockEntryItemSearch('');
                              setStockEntryForm({
                                ...stockEntryForm,
                                selectedItemId: '',
                                costPrice: '',
                                sellingPrice: ''
                              });
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">-- All Vendors --</option>
                            {suppliers
                              .filter(s => {
                                if (s.supplierName === stockEntrySupplierFilter) return true;
                                if (!stockEntrySupplierSearch.trim()) return true;
                                const q = stockEntrySupplierSearch.trim().toLowerCase();
                                return (
                                  (s.supplierName && s.supplierName.toLowerCase().includes(q)) ||
                                  (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
                                  (s.telephone && s.telephone.toLowerCase().includes(q))
                                );
                              })
                              .map(s => (
                                <option key={s.id || s._id} value={s.supplierName}>
                                  {s.supplierName}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Top-Right: Search & Select Item for Selected Vendor */}
                        <div className="relative">
                          <label className="block font-bold text-slate-700 mb-1">Select Registered Item *</label>
                          <div className="relative mb-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={stockEntryItemSearch}
                              onChange={(e) => setStockEntryItemSearch(e.target.value)}
                              placeholder="Search item code or name..."
                              className="w-full bg-white border border-slate-300 rounded pl-8 pr-7 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {stockEntryItemSearch && (
                              <button
                                type="button"
                                onClick={() => setStockEntryItemSearch('')}
                                className="text-slate-400 hover:text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                title="Clear item search"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {stockEntryItemSearch.trim() && (() => {
                              const q = stockEntryItemSearch.trim().toLowerCase();
                              const uniqueItems = Array.from(
                                new Map(
                                  catalogItems.map((it) => [`${it.itemCode}__${it.supplierName || ''}`, it])
                                ).values()
                              );
                              const matches = uniqueItems.filter((it) => {
                                if (stockEntrySupplierFilter && (it.supplierName || '') !== stockEntrySupplierFilter) return false;
                                return (
                                  (it.itemCode && it.itemCode.toLowerCase().includes(q)) ||
                                  (it.description && it.description.toLowerCase().includes(q)) ||
                                  (it.barcode && it.barcode.toLowerCase().includes(q)) ||
                                  (it.supplierName && it.supplierName.toLowerCase().includes(q))
                                );
                              });
                              return (
                                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-blue-300 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                                  {matches.length === 0 ? (
                                    <div className="px-3 py-2 text-xs text-slate-400 italic">No item matching &quot;{stockEntryItemSearch}&quot;</div>
                                  ) : (
                                    matches.map((it) => (
                                      <button
                                        key={it.id || it._id || it.itemCode}
                                        type="button"
                                        onClick={() => {
                                          setStockEntryForm({
                                            ...stockEntryForm,
                                            selectedItemId: it.id || it._id || '',
                                            costPrice: it.costPrice ?? '',
                                            sellingPrice: it.sellingPrice ?? ''
                                          });
                                          setStockEntryItemSearch('');
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center justify-between gap-2 cursor-pointer ${
                                          stockEntryForm.selectedItemId === (it.id || it._id) ? 'bg-blue-50 font-bold text-blue-800' : 'text-slate-800'
                                        }`}
                                      >
                                        <span className="truncate">
                                          <span className="font-mono font-bold text-blue-700">{it.itemCode}</span> — {it.description}
                                        </span>
                                        <span className="text-[10px] text-slate-500 shrink-0">{it.supplierName || 'General'}</span>
                                      </button>
                                    ))
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                          <select
                            value={stockEntryForm.selectedItemId}
                            onChange={(e) => {
                              const id = e.target.value;
                              const sel = catalogItems.find((i) => (i.id || i._id) === id);
                              setStockEntryForm({
                                ...stockEntryForm,
                                selectedItemId: id,
                                costPrice: sel ? (sel.costPrice ?? '') : '',
                                sellingPrice: sel ? (sel.sellingPrice ?? '') : ''
                              });
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          >
                            <option value="">-- Choose Registered Item --</option>
                            {Array.from(
                              new Map(
                                catalogItems.map((it) => [`${it.itemCode}__${it.supplierName || ''}`, it])
                              ).values()
                            )
                              .filter((it) => {
                                if ((it.id || it._id) === stockEntryForm.selectedItemId) return true;
                                if (stockEntrySupplierFilter && (it.supplierName || '') !== stockEntrySupplierFilter) return false;
                                if (!stockEntryItemSearch.trim()) return true;
                                const q = stockEntryItemSearch.trim().toLowerCase();
                                return (
                                  (it.itemCode && it.itemCode.toLowerCase().includes(q)) ||
                                  (it.description && it.description.toLowerCase().includes(q)) ||
                                  (it.barcode && it.barcode.toLowerCase().includes(q)) ||
                                  (it.supplierName && it.supplierName.toLowerCase().includes(q))
                                );
                              })
                              .map((it) => (
                                <option key={it.id || it._id || it.itemCode} value={it.id || it._id}>
                                  {it.itemCode} — {it.description} ({it.supplierName || 'General'})
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Supplier Cost Price (LKR)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={stockEntryForm.costPrice}
                            onChange={(e) => setStockEntryForm({ ...stockEntryForm, costPrice: e.target.value })}
                            placeholder="0"
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Customer Selling Price (LKR) *</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={stockEntryForm.sellingPrice}
                            onChange={(e) => setStockEntryForm({ ...stockEntryForm, sellingPrice: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Quantity in Stock *</label>
                            <input
                              type="number"
                              min="0"
                              value={stockEntryForm.qtyToAdd}
                              onChange={(e) => setStockEntryForm({ ...stockEntryForm, qtyToAdd: e.target.value })}
                              placeholder="0"
                              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Unit / Measurement *</label>
                            <select
                              value={stockEntryForm.stockUnit}
                              onChange={(e) => setStockEntryForm({ ...stockEntryForm, stockUnit: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-2 text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Bottles">Bottles</option>
                              <option value="Barrels">Barrels</option>
                              <option value="Liters (L)">Liters (L)</option>
                              <option value="Milliliters (ml)">Milliliters (ml)</option>
                              <option value="Pieces">Pieces</option>
                              <option value="Packs">Packs</option>
                              <option value="Cans">Cans</option>
                              <option value="Kg">Kg</option>
                              <option value="Meters">Meters</option>
                              <option value="Units">Units</option>
                              <option value="Other">Other</option>
                            </select>
                            {stockEntryForm.stockUnit === 'Other' && (
                              <input
                                type="text"
                                value={stockEntryForm.customStockUnit || ''}
                                onChange={(e) => setStockEntryForm({ ...stockEntryForm, customStockUnit: e.target.value })}
                                placeholder="Enter unit name (e.g. Boxes, Drums)..."
                                className="mt-1.5 w-full bg-white border border-blue-400 rounded px-2.5 py-1.5 text-xs text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                required
                              />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Date</label>
                            <input
                              type="date"
                              value={stockEntryForm.stockDate}
                              onChange={(e) => setStockEntryForm({ ...stockEntryForm, stockDate: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2 py-2 text-slate-800 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Time</label>
                            <input
                              type="time"
                              value={stockEntryForm.stockTime}
                              onChange={(e) => setStockEntryForm({ ...stockEntryForm, stockTime: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2 py-2 text-slate-800 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          Add Stock & Save Price
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-slate-600 uppercase">Filter Supplier:</span>
                      <select
                        value={supplierItemFilter}
                        onChange={(e) => setSupplierItemFilter(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                      >
                        <option value="ALL">All Suppliers ({catalogItems.length} items)</option>
                        {suppliers.map(s => (
                          <option key={s.id || s._id} value={s.supplierName}>
                            {s.supplierName} ({catalogItems.filter(i => i.supplierName === s.supplierName).length})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        value={supplierSearchQuery}
                        onChange={(e) => setSupplierSearchQuery(e.target.value)}
                        placeholder="Search item code, description..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Table of Supplied Items */}
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                          <th className="py-2.5 px-3">Supplier Name</th>
                          <th className="py-2.5 px-3">Item Code</th>
                          <th className="py-2.5 px-3">Barcode</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3 text-center">Qty on Hand</th>
                          <th className="py-2.5 px-3 text-right">Cost Price (LKR)</th>
                          <th className="py-2.5 px-3 text-right">Selling Price (LKR)</th>
                          <th className="py-2.5 px-3 text-center">Date & Time</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {(() => {
                          const filtered = catalogItems
                            .filter(i => supplierItemFilter === 'ALL' || i.supplierName === supplierItemFilter)
                            .filter(i => {
                              if (!supplierSearchQuery) return true;
                              const q = supplierSearchQuery.toLowerCase();
                              return (
                                (i.itemCode && i.itemCode.toLowerCase().includes(q)) ||
                                (i.description && i.description.toLowerCase().includes(q)) ||
                                (i.supplierName && i.supplierName.toLowerCase().includes(q)) ||
                                (i.barcode && i.barcode.toLowerCase().includes(q))
                              );
                            });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan="10" className="py-8 text-center text-slate-400">
                                  No items found for the selected supplier. Use "1. Register Item" above to add items.
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((item) => {
                            const rowKey = item.id || item._id || item.itemCode;
                            const isRowEditing = editingItemRowId === rowKey;
                            if (isRowEditing) {
                              return (
                                <tr key={rowKey} className="bg-amber-50/70">
                                  <td className="p-1.5">
                                    <select
                                      value={editingItemRowData.supplierName}
                                      onChange={(e) => setEditingItemRowData({ ...editingItemRowData, supplierName: e.target.value })}
                                      className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px] font-semibold"
                                    >
                                      <option value="">General</option>
                                      {suppliers.map(s => (
                                        <option key={s.id || s._id} value={s.supplierName}>{s.supplierName}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="p-1.5">
                                    <input
                                      type="text"
                                      value={editingItemRowData.itemCode}
                                      onChange={(e) => setEditingItemRowData({ ...editingItemRowData, itemCode: e.target.value.toUpperCase() })}
                                      className="w-24 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] font-bold"
                                    />
                                  </td>
                                  <td className="p-1.5">
                                    <input
                                      type="text"
                                      value={editingItemRowData.barcode}
                                      onChange={(e) => setEditingItemRowData({ ...editingItemRowData, barcode: e.target.value })}
                                      className="w-24 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px]"
                                    />
                                  </td>
                                  <td className="p-1.5">
                                    <input
                                      type="text"
                                      value={editingItemRowData.description}
                                      onChange={(e) => setEditingItemRowData({ ...editingItemRowData, description: e.target.value })}
                                      className="w-full min-w-[140px] bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px] font-semibold"
                                    />
                                  </td>
                                  <td className="p-1.5">
                                    <select
                                      value={editingItemRowData.category}
                                      onChange={(e) => setEditingItemRowData({ ...editingItemRowData, category: e.target.value })}
                                      className="bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px]"
                                    >
                                      <option value="Oils & Fluids">Oils & Fluids</option>
                                      <option value="Filters">Filters</option>
                                      <option value="Brake Components">Brake Components</option>
                                      <option value="Batteries">Batteries</option>
                                      <option value="Engine Parts">Engine Parts</option>
                                      <option value="Accessories">Accessories</option>
                                      <option value="General">General</option>
                                    </select>
                                  </td>
                                  <td className="p-1.5">
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min="0"
                                        value={editingItemRowData.qtyOnHand}
                                        onChange={(e) => setEditingItemRowData({ ...editingItemRowData, qtyOnHand: e.target.value })}
                                        className="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] text-center font-bold"
                                      />
                                      <select
                                        value={editingItemRowData.stockUnit}
                                        onChange={(e) => setEditingItemRowData({ ...editingItemRowData, stockUnit: e.target.value })}
                                        className="bg-white border border-slate-300 rounded px-1 py-1 text-[10px]"
                                      >
                                        <option value="Bottles">Bottles</option>
                                        <option value="Barrels">Barrels</option>
                                        <option value="Liters (L)">Liters (L)</option>
                                        <option value="Milliliters (ml)">Milliliters (ml)</option>
                                        <option value="Pieces">Pieces</option>
                                        <option value="Packs">Packs</option>
                                        <option value="Cans">Cans</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Meters">Meters</option>
                                        <option value="Units">Units</option>
                                      </select>
                                    </div>
                                  </td>
                                  <td className="p-1.5">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={editingItemRowData.costPrice}
                                      onChange={(e) => setEditingItemRowData({ ...editingItemRowData, costPrice: e.target.value })}
                                      className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] text-right"
                                    />
                                  </td>
                                  <td className="p-1.5">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={editingItemRowData.sellingPrice}
                                      onChange={(e) => setEditingItemRowData({ ...editingItemRowData, sellingPrice: e.target.value })}
                                      className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] text-right font-bold"
                                    />
                                  </td>
                                  <td className="p-1.5">
                                    <div className="flex flex-col gap-1">
                                      <input
                                        type="date"
                                        value={editingItemRowData.stockDate}
                                        onChange={(e) => setEditingItemRowData({ ...editingItemRowData, stockDate: e.target.value })}
                                        className="bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px]"
                                      />
                                      <input
                                        type="time"
                                        value={editingItemRowData.stockTime}
                                        onChange={(e) => setEditingItemRowData({ ...editingItemRowData, stockTime: e.target.value })}
                                        className="bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px]"
                                      />
                                    </div>
                                  </td>
                                  <td className="p-1.5 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveInlineItemEdit(rowKey)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[11px] cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCancelInlineItemEdit}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded text-[11px] cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                            return (
                              <tr key={rowKey} className="hover:bg-slate-50 transition">
                                <td className="py-2.5 px-3">
                                  <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-2 py-0.5 rounded text-[11px]">
                                    {item.supplierName || 'General'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{item.itemCode}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">{item.barcode || '-'}</td>
                                <td className="py-2.5 px-3 font-bold text-slate-900">{item.description}</td>
                                <td className="py-2.5 px-3">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                                  {item.qtyOnHand} {item.stockUnit || ''}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                                  {Number(item.costPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                  {Number(item.sellingPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-600">
                                  {item.stockDate || item.updatedAt?.slice(0, 10) || '-'}
                                  {item.stockTime ? ` ${item.stockTime}` : ''}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleStartInlineItemEdit(item)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                                      title="Edit Item"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteItem(item.id || item._id || item.itemCode, item.description)}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                                      title="Delete Item"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW 3: ADD / EDIT SUPPLIER INVOICE & GRN
                  ========================================================================= */}
              {supplierSubTab === 'add_invoice' && (
                <div className="p-6 max-w-3xl space-y-5">
                  {isEditingInvoice ? (
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-300 p-4 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <Edit3 className="w-5 h-5 text-amber-600" />
                        <div>
                          <h4 className="font-bold text-sm text-amber-900">
                            Editing Invoice #{newInvoiceData.invoiceNo} ({newInvoiceData.supplierName})
                          </h4>
                          <p className="text-xs text-amber-700">
                            Update invoice amount, dates, or purchase reference and click "Update Supplier Invoice".
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingInvoice(false);
                          setEditingInvoiceId(null);
                          setNewInvoiceData({
                            supplierName: '',
                            invoiceNo: '',
                            poGrnNo: '',
                            receivedDate: new Date().toISOString().split('T')[0],
                            invoiceDate: new Date().toISOString().split('T')[0],
                            creditDays: 30,
                            dueDate: '',
                            invoiceAmount: '',
                            items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
                            notes: ''
                          });
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        Cancel Edit
                      </button>
                    </div>
                  ) : (
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" />
                        Add New Supplier Purchase Invoice / GRN
                      </h3>
                      <p className="text-xs text-slate-500">
                        Record supplier bill with credit days to track exact payment due date and prevent overdue interest.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSaveSupplierInvoice} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Supplier Name *
                        </label>
                        <select
                          value={newInvoiceData.supplierName}
                          onChange={(e) => {
                            const sel = suppliers.find(s => s.supplierName === e.target.value);
                            const crDays = sel ? (sel.defaultCreditDays !== undefined && sel.defaultCreditDays !== null && sel.defaultCreditDays !== '' ? Number(sel.defaultCreditDays) : 30) : 30;
                            const invDate = new Date(newInvoiceData.invoiceDate);
                            invDate.setDate(invDate.getDate() + crDays);
                            setNewInvoiceData({
                              ...newInvoiceData,
                              supplierName: e.target.value,
                              creditDays: crDays,
                              dueDate: invDate.toISOString().split('T')[0]
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- Choose Supplier --</option>
                          {suppliers.map(s => (
                            <option key={s.id || s._id} value={s.supplierName}>
                              {s.supplierName} ({s.defaultCreditDays !== undefined && s.defaultCreditDays !== null && s.defaultCreditDays !== '' ? s.defaultCreditDays : 30} Days Credit)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Invoice Number *
                        </label>
                        <input
                          type="text"
                          value={newInvoiceData.invoiceNo}
                          onChange={(e) => setNewInvoiceData({ ...newInvoiceData, invoiceNo: e.target.value })}
                          placeholder="e.g. 285 or PETG011541"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          PO / GRN Number
                        </label>
                        <input
                          type="text"
                          value={newInvoiceData.poGrnNo}
                          onChange={(e) => setNewInvoiceData({ ...newInvoiceData, poGrnNo: e.target.value })}
                          placeholder="e.g. ACSC200"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Total Invoice Amount (LKR) *
                        </label>
                        <input
                          type="number"
                          value={newInvoiceData.invoiceAmount}
                          onChange={(e) => setNewInvoiceData({ ...newInvoiceData, invoiceAmount: e.target.value })}
                          placeholder="e.g. 14400.00"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Received Date
                        </label>
                        <input
                          type="date"
                          value={newInvoiceData.receivedDate}
                          onChange={(e) => setNewInvoiceData({ ...newInvoiceData, receivedDate: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          value={newInvoiceData.invoiceDate}
                          onChange={(e) => {
                            const newInvDate = e.target.value;
                            const d = new Date(newInvDate);
                            d.setDate(d.getDate() + Number(newInvoiceData.creditDays || 30));
                            setNewInvoiceData({
                              ...newInvoiceData,
                              invoiceDate: newInvDate,
                              dueDate: d.toISOString().split('T')[0]
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Credit Days (Effective)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={newInvoiceData.creditDays !== undefined ? newInvoiceData.creditDays : ''}
                            onChange={(e) => {
                              const cr = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                              const baseDate = newInvoiceData.invoiceDate ? new Date(newInvoiceData.invoiceDate) : new Date();
                              baseDate.setDate(baseDate.getDate() + cr);
                              setNewInvoiceData({
                                ...newInvoiceData,
                                creditDays: e.target.value === '' ? '' : cr,
                                dueDate: baseDate.toISOString().split('T')[0]
                              });
                            }}
                            placeholder="e.g. 30"
                            className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-16 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-xs"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
                            Days
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Calculated Due Date (Pay By)
                        </label>
                        <input
                          type="date"
                          value={newInvoiceData.dueDate}
                          onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })}
                          className="w-full bg-blue-50 border border-blue-300 rounded-lg px-3 py-2 text-sm font-bold text-blue-900 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        {isEditingInvoice ? 'Update Supplier Invoice' : 'Save Supplier Invoice & Schedule Due Date'}
                      </button>

                      {isEditingInvoice && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingInvoice(false);
                            setEditingInvoiceId(null);
                            setNewInvoiceData({
                              supplierName: '',
                              invoiceNo: '',
                              poGrnNo: '',
                              receivedDate: new Date().toISOString().split('T')[0],
                              invoiceDate: new Date().toISOString().split('T')[0],
                              creditDays: 30,
                              dueDate: '',
                              invoiceAmount: '',
                              items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
                              notes: ''
                            });
                          }}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-lg text-sm transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW 3: SUPPLIER PAYMENT TRACKER & DUE DATE/OVERDUE MONITOR
                  ========================================================================= */}
              {supplierSubTab === 'tracker' && (
                <div className="p-5 space-y-4">
                  {/* Overdue Warning Alert Box if any invoices are past due */}
                  {supplierMetrics.overdueCount > 0 && (
                    <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white p-4 rounded-xl shadow-md flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm">Attention Required: Overdue Supplier Payments</h3>
                          <p className="text-xs text-rose-100">
                            You have {supplierMetrics.overdueCount} supplier invoices that have passed their payment due date (Total: LKR {supplierMetrics.overdueAmount.toLocaleString()}).
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSupplierFilterStatus('OVERDUE')}
                        className="bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm whitespace-nowrap transition cursor-pointer"
                      >
                        Filter Overdue Invoices
                      </button>
                    </div>
                  )}

                  {/* Search and Status Filters */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-slate-600 uppercase">Filter Status:</span>
                      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                        {['ALL', 'OVERDUE', 'ONGOING', 'PAID'].map(st => (
                          <button
                            key={st}
                            onClick={() => setSupplierFilterStatus(st)}
                            className={`px-3 py-1 font-bold rounded-md transition cursor-pointer ${supplierFilterStatus === st
                              ? st === 'OVERDUE'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : st === 'ONGOING'
                                  ? 'bg-teal-600 text-white shadow-xs'
                                  : 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        value={supplierSearchQuery}
                        onChange={(e) => setSupplierSearchQuery(e.target.value)}
                        placeholder="Search supplier, invoice no, GRN..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Excel Style Data Grid Matching Image 1 with Edit & Delete */}
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                          <th className="py-2.5 px-3">Invoice_ID</th>
                          <th className="py-2.5 px-3">Supplier_Name</th>
                          <th className="py-2.5 px-3">Invoice_No</th>
                          <th className="py-2.5 px-3">PO/GRN_No</th>
                          <th className="py-2.5 px-3">Received_Date</th>
                          <th className="py-2.5 px-3">Invoice_Date</th>
                          <th className="py-2.5 px-3 text-right">Invoice_Amount</th>
                          <th className="py-2.5 px-3 text-center">Credit_Days</th>
                          <th className="py-2.5 px-3">Due_Date</th>
                          <th className="py-2.5 px-3 text-right">Amount_Paid</th>
                          <th className="py-2.5 px-3 text-right">Balance</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-center">Days Due/Overdue</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {filteredSupplierInvoices.length === 0 ? (
                          <tr>
                            <td colSpan="14" className="py-8 text-center text-slate-400">
                              No supplier invoice records found matching your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredSupplierInvoices.map((inv) => {
                            const isOverdue = inv.status === 'OVERDUE';
                            const isPaid = inv.status === 'PAID';

                            return (
                              <tr
                                key={inv.id || inv._id || inv.invoiceId}
                                className={`transition-colors ${isOverdue
                                  ? 'bg-rose-50/60 hover:bg-rose-100/50'
                                  : isPaid
                                    ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
                                    : 'hover:bg-slate-50'
                                  }`}
                              >
                                <td className="py-2 px-3 font-mono font-bold text-slate-700">{inv.invoiceId}</td>
                                <td className="py-2 px-3 font-bold text-slate-900">{inv.supplierName}</td>
                                <td className="py-2 px-3 font-mono font-semibold text-slate-700">{inv.invoiceNo}</td>
                                <td className="py-2 px-3 font-mono text-slate-600">{inv.poGrnNo || '-'}</td>
                                <td className="py-2 px-3 font-mono text-slate-600">{inv.receivedDate}</td>
                                <td className="py-2 px-3 font-mono text-slate-600">{inv.invoiceDate}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  {Number(inv.invoiceAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2 px-3 text-center font-mono font-semibold text-slate-700">
                                  {inv.creditDays}
                                </td>
                                <td className="py-2 px-3 font-mono font-bold text-slate-800">
                                  <span className={isOverdue ? 'text-rose-700 font-extrabold underline' : ''}>
                                    {inv.dueDate}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-700">
                                  {Number(inv.amountPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  <span className={isOverdue ? 'text-rose-700 font-extrabold' : ''}>
                                    {Number(inv.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span
                                    className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${isOverdue
                                      ? 'bg-rose-600 text-white shadow-2xs'
                                      : isPaid
                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                        : 'bg-teal-600 text-white shadow-2xs'
                                      }`}
                                  >
                                    {inv.status}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-center font-mono">
                                  {isPaid ? (
                                    <span className="text-emerald-700 font-bold">Settled</span>
                                  ) : isOverdue ? (
                                    <span className="text-rose-700 font-extrabold bg-rose-100 px-2 py-0.5 rounded">
                                      {inv.daysOverdue} Days Overdue
                                    </span>
                                  ) : (
                                    <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
                                      {inv.daysToDue} Days Left
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {inv.balance > 0 ? (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenPaymentModal(inv)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-2xs flex items-center gap-1 transition cursor-pointer"
                                        title="Record Payment"
                                      >
                                        <CreditCard className="w-3 h-3" />
                                        Pay
                                      </button>
                                    ) : (
                                      <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-0.5">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        Paid
                                      </span>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleEditSupplierInvoice(inv)}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded transition cursor-pointer"
                                      title="Edit Invoice"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSupplierInvoice(inv.id || inv._id || inv.invoiceId, inv.invoiceNo)}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1 rounded transition cursor-pointer"
                                      title="Delete Invoice"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Showing {filteredSupplierInvoices.length} invoices</span>
                    <span className="text-[11px]">Due dates calculated automatically based on invoice date + supplier credit days</span>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SUB-VIEW 4: PAYMENTS HISTORY & CHEQUE REGISTER (MATCHES IMAGE 3 & 4)
                  ========================================================================= */}
              {supplierSubTab === 'payments' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Supplier Payments & Cheque Register
                      </h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                          <th className="py-2.5 px-3">Payment_ID</th>
                          <th className="py-2.5 px-3">Invoice_ID</th>
                          <th className="py-2.5 px-3">Supplier_Name</th>
                          <th className="py-2.5 px-3">Payment_Date</th>
                          <th className="py-2.5 px-3 text-right">Amount (LKR)</th>
                          <th className="py-2.5 px-3 text-center">Method</th>
                          <th className="py-2.5 px-3">Cheque_No</th>
                          <th className="py-2.5 px-3">Cheque_Issue_Date</th>
                          <th className="py-2.5 px-3 text-center">Cheque_Status</th>
                          <th className="py-2.5 px-3">Cleared_Date</th>
                          <th className="py-2.5 px-3">Bank_Account</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white font-mono">
                        {allRecordedPayments.length === 0 ? (
                          <tr>
                            <td colSpan="12" className="py-8 text-center text-slate-400 font-sans">
                              No payments recorded yet. Click "Pay" on any invoice in the tracker to log a payment.
                            </td>
                          </tr>
                        ) : (
                          allRecordedPayments.map((p, pIdx) => (
                            <tr key={pIdx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-bold text-blue-700">{p.paymentId || `P${pIdx + 1}`}</td>
                              <td className="py-2 px-3 font-semibold text-slate-700">{p.invoiceId}</td>
                              <td className="py-2 px-3 font-sans font-bold text-slate-900">{p.supplierName}</td>
                              <td className="py-2 px-3 text-slate-700">{p.paymentDate}</td>
                              <td className="py-2 px-3 text-right font-bold text-slate-900">
                                {Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-center font-sans">
                                <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">
                                  {p.method}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-semibold text-slate-800">{p.chequeNo || '-'}</td>
                              <td className="py-2 px-3 text-slate-600">{p.chequeIssueDate || '-'}</td>
                              <td className="py-2 px-3 text-center font-sans">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.chequeStatus === 'Cleared'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                                  }`}>
                                  {p.chequeStatus || 'Issued'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-700">{p.clearedDate || '-'}</td>
                              <td className="py-2 px-3 font-sans text-slate-600">{p.bankAccount || 'Main Account'}</td>
                              <td className="py-2 px-3 text-center font-sans">
                                <div className="flex items-center justify-center gap-1.5">
                                  {p.method === 'Cheque' && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdatePaymentStatus(p.invoiceDbId, p.paymentId, p.chequeStatus === 'Cleared' ? 'Issued' : 'Cleared')}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded transition cursor-pointer"
                                      title={p.chequeStatus === 'Cleared' ? 'Revert to Issued' : 'Mark Cheque as Cleared'}
                                    >
                                      {p.chequeStatus === 'Cleared' ? 'Mark Issued' : 'Mark Cleared'}
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleDeletePayment(p.invoiceDbId, p.paymentId)}
                                    className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                                    title="Delete Payment (Restores Invoice Balance)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: Cs/Vehicle (VEHICLE REGISTRATION, SERVICE & BILL, AND VEHICLE HISTORY)
            ========================================================================= */}
        {activeTab === 'Cs/Vehicle' && (
          <div className="space-y-6">
            {/* Sub-Navigation Bar for Vehicle Module: 3 Navigation Tabs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap items-center gap-2 shadow-sm">
              <button
                type="button"
                onClick={() => setVehicleSubTab('registration')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${vehicleSubTab === 'registration'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <Car className="w-4 h-4" />
                Vehicle Registration
              </button>
              <button
                type="button"
                onClick={() => {
                  setVehicleSubTab('service');
                  setServiceSubTab('add');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${vehicleSubTab === 'service'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Vehicle Service & Bill
              </button>
              <button
                type="button"
                onClick={() => {
                  setVehicleSubTab('history');
                  setServiceSubTab('history');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${vehicleSubTab === 'history'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <History className="w-4 h-4" />
                Vehicle History
                {serviceHistory.length > 0 && selectedServiceVehicleNo && (
                  <span className="ml-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {serviceHistory.length}
                  </span>
                )}
              </button>
            </div>

            {/* Sub-View 1: VEHICLE REGISTRATION */}
            {vehicleSubTab === 'registration' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Title Bar with Integrated Search & New Registration */}
                <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs tracking-wider uppercase text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Vehicle Registration
                    </span>
                    {isEditingVehicle && (
                      <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-300">
                        <Edit3 className="w-3 h-3 text-blue-600" />
                        Editing: <strong className="font-mono">{vehicleForm.vehicleNo}</strong>
                      </span>
                    )}
                  </div>

                  {/* Right: Search Input, Vehicle Select Dropdown, and New Registration Button */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Live Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={vehicleSearchQuery}
                        onChange={(e) => setVehicleSearchQuery(e.target.value)}
                        placeholder="Type Vehicle No to search & edit..."
                        className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase shadow-2xs"
                      />
                      {vehicleSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setVehicleSearchQuery('')}
                          className="text-slate-400 hover:text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown Selector */}
                    <select
                      value={isEditingVehicle ? (vehicleForm.vehicleNo || '') : ''}
                      onChange={(e) => {
                        const sel = vehicles.find(v => v.vehicleNo === e.target.value);
                        if (sel) {
                          handleLoadVehicleIntoForm(sel);
                          setVehicleSearchQuery('');
                        }
                      }}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto sm:max-w-[210px] cursor-pointer shadow-2xs"
                    >
                      <option value="">-- Select Vehicle ({vehicles.length}) --</option>
                      {vehicles.map(v => (
                        <option key={v._id || v.id || v.vehicleNo} value={v.vehicleNo}>
                          {v.vehicleNo} ({v.csName})
                        </option>
                      ))}
                    </select>

                    {/* New Registration Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleClearVehicleForm();
                        setVehicleSearchQuery('');
                      }}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      New Registration
                    </button>
                  </div>
                </div>

                {/* Instant Search Results Chips */}
                {vehicleSearchQuery.trim() && (
                  <div className="bg-blue-50/70 border-b border-blue-200 px-5 py-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-blue-900 font-bold uppercase tracking-wider">Matching Vehicles:</span>
                    {(() => {
                      const q = vehicleSearchQuery.trim().toLowerCase();
                      const matches = vehicles.filter(v =>
                        (v.vehicleNo && v.vehicleNo.toLowerCase().includes(q)) ||
                        (v.csName && v.csName.toLowerCase().includes(q)) ||
                        (v.vModel && v.vModel.toLowerCase().includes(q))
                      );
                      if (matches.length === 0) {
                        return <span className="text-xs text-slate-400 italic">No registered vehicle matching &quot;{vehicleSearchQuery}&quot;</span>;
                      }
                      return matches.slice(0, 8).map(v => (
                        <button
                          key={v._id || v.id || v.vehicleNo}
                          type="button"
                          onClick={() => {
                            handleLoadVehicleIntoForm(v);
                            setVehicleSearchQuery('');
                          }}
                          className="bg-white hover:bg-blue-600 hover:text-white border border-blue-300 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-md transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Car className="w-3 h-3 text-blue-500" />
                          <span className="font-mono">{v.vehicleNo}</span>
                          <span className="text-[10px] font-normal opacity-80">({v.csName})</span>
                          <Edit3 className="w-2.5 h-2.5 text-amber-500" />
                        </button>
                      ));
                    })()}
                  </div>
                )}

                {/* Form Fields */}
                <div className="p-6 bg-slate-50/50">
                  <form onSubmit={handleSaveVehicle} className="space-y-4">
                    {/* Row 1: Vehicle No Input & Edit Indicator */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                      <label className="md:col-span-2 text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-blue-600" />
                        Vehicle No *
                      </label>
                      <div className="md:col-span-6">
                        <div className="relative">
                          <input
                            type="text"
                            value={vehicleForm.vehicleNo}
                            onChange={(e) => {
                              const val = e.target.value.toUpperCase();
                              setVehicleForm({
                                ...vehicleForm,
                                vehicleNo: val,
                                editVehicleNo: val
                              });
                            }}
                            placeholder="Enter Vehicle Number (e.g. CAB-1234, WP-CAB-1234)"
                            className="w-full bg-slate-50 border-2 border-slate-300 focus:border-blue-500 rounded-lg px-3 py-2 text-sm font-black tracking-wider text-slate-900 font-mono uppercase focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition"
                            required
                          />
                          {/* Duplicate check & quick load button */}
                          {(() => {
                            const entered = vehicleForm.vehicleNo?.trim().toUpperCase();
                            if (!entered) return null;
                            const existing = vehicles.find(v => v.vehicleNo?.toUpperCase() === entered && (v._id || v.id) !== (vehicleForm.id || vehicleForm._id));
                            if (existing) {
                              return (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                  <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                                    Already Registered
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleLoadVehicleIntoForm(existing)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded transition shadow-xs cursor-pointer flex items-center gap-1"
                                  >
                                    <Edit3 className="w-2.5 h-2.5" />
                                    Edit This
                                  </button>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>

                      <div className="md:col-span-4 flex items-center gap-2">
                        {isEditingVehicle ? (
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1 flex-1 truncate">
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              Editing: <strong className="font-mono">{vehicleForm.vehicleNo}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handleClearVehicleForm();
                                setVehicleSearchQuery('');
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Row 2: Cs Name */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-500" />
                        Cs Name
                      </label>
                      <div className="md:col-span-10">
                        <input
                          type="text"
                          value={vehicleForm.csName}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, csName: e.target.value })}
                          placeholder="Customer Full Name"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Address */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        Address
                      </label>
                      <div className="md:col-span-10">
                        <input
                          type="text"
                          value={vehicleForm.address}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, address: e.target.value })}
                          placeholder="Customer Street / Residential Address"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 4: Mobile/Tel & Owner Email */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-slate-500" />
                        Mobile/Tel
                      </label>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          value={vehicleForm.mobileTel}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, mobileTel: e.target.value })}
                          placeholder="Primary Mobile Number (e.g. 077-1234567)"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 md:justify-end">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Owner Email
                      </label>
                      <div className="md:col-span-4">
                        <input
                          type="email"
                          value={vehicleForm.email || ''}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, email: e.target.value })}
                          placeholder="owner@example.com (for 1-week service reminder)"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 5: Home & Office */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Home
                      </label>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          value={vehicleForm.homeTel}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, homeTel: e.target.value })}
                          placeholder="Home Telephone"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide md:text-right">
                        Office
                      </label>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          value={vehicleForm.officeTel}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, officeTel: e.target.value })}
                          placeholder="Office Telephone"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Middle Section: Two Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                      {/* Left Column */}
                      <div className="lg:col-span-7 space-y-3">
                        {/* City */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <label className="col-span-12 sm:col-span-3 text-xs font-bold text-slate-700 uppercase">City</label>
                          <div className="col-span-12 sm:col-span-5">
                            <select
                              value={vehicleForm.city}
                              onChange={(e) => setVehicleForm({ ...vehicleForm, city: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => { setModalType('city'); setModalNewItem(''); }}
                              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                            >
                              Update
                            </button>
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (cities.length <= 1) return showNotification('At least one city required', 'error');
                                setCities(cities.filter(c => c !== vehicleForm.city));
                                setVehicleForm({ ...vehicleForm, city: cities[0] });
                              }}
                              className="w-full bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Cs status */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <label className="col-span-12 sm:col-span-3 text-xs font-bold text-slate-700 uppercase">Cs status</label>
                          <div className="col-span-12 sm:col-span-5">
                            <select
                              value={vehicleForm.csStatus}
                              onChange={(e) => setVehicleForm({ ...vehicleForm, csStatus: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => { setModalType('status'); setModalNewItem(''); }}
                              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                            >
                              Update
                            </button>
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (statuses.length <= 1) return showNotification('At least one status required', 'error');
                                setStatuses(statuses.filter(s => s !== vehicleForm.csStatus));
                                setVehicleForm({ ...vehicleForm, csStatus: statuses[0] });
                              }}
                              className="w-full bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* V/Type */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <label className="col-span-12 sm:col-span-3 text-xs font-bold text-slate-700 uppercase">V/Type</label>
                          <div className="col-span-12 sm:col-span-9">
                            <select
                              value={vehicleForm.vType}
                              onChange={(e) => setVehicleForm({ ...vehicleForm, vType: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* V/Model */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <label className="col-span-12 sm:col-span-3 text-xs font-bold text-slate-700 uppercase">V/Model</label>
                          <div className="col-span-12 sm:col-span-9">
                            <input
                              type="text"
                              value={vehicleForm.vModel}
                              onChange={(e) => setVehicleForm({ ...vehicleForm, vModel: e.target.value })}
                              placeholder="e.g. Toyota Prius, Honda Vezel"
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>

                        {/* Colour */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <label className="col-span-12 sm:col-span-3 text-xs font-bold text-slate-700 uppercase">Colour</label>
                          <div className="col-span-12 sm:col-span-5">
                            <select
                              value={vehicleForm.colour}
                              onChange={(e) => setVehicleForm({ ...vehicleForm, colour: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              {colours.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => { setModalType('colour'); setModalNewItem(''); }}
                              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                            >
                              Update
                            </button>
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (colours.length <= 1) return showNotification('At least one colour required', 'error');
                                setColours(colours.filter(c => c !== vehicleForm.colour));
                                setVehicleForm({ ...vehicleForm, colour: colours[0] });
                              }}
                              className="w-full bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Extra Tag No / Delivery */}
                        <div className="grid grid-cols-12 gap-2 items-center pt-1">
                          <label className="col-span-12 sm:col-span-3 text-xs font-bold text-slate-500 uppercase">Tag No</label>
                          <div className="col-span-12 sm:col-span-4">
                            <input
                              type="text"
                              value={vehicleForm.tagNo}
                              onChange={(e) => setVehicleForm({ ...vehicleForm, tagNo: e.target.value })}
                              placeholder="TAG-..."
                              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-sm text-slate-700 outline-none font-mono"
                            />
                          </div>
                          <label className="col-span-12 sm:col-span-2 text-xs font-bold text-slate-500 uppercase sm:text-right">Delivery</label>
                          <div className="col-span-12 sm:col-span-3">
                            <input
                              type="date"
                              value={vehicleForm.deliveryDate}
                              onChange={(e) => setVehicleForm({ ...vehicleForm, deliveryDate: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Engine, Chassis, Birthday, Action buttons */}
                      <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                        <div className="space-y-3">
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <label className="col-span-12 sm:col-span-5 text-xs font-bold text-slate-700 uppercase">Engine Number</label>
                            <div className="col-span-12 sm:col-span-7">
                              <input
                                type="text"
                                value={vehicleForm.engineNo}
                                onChange={(e) => setVehicleForm({ ...vehicleForm, engineNo: e.target.value })}
                                placeholder="e.g. 2ZR-FXE-892144"
                                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-12 gap-2 items-center">
                            <label className="col-span-12 sm:col-span-5 text-xs font-bold text-slate-700 uppercase">Chassis Number</label>
                            <div className="col-span-12 sm:col-span-7">
                              <input
                                type="text"
                                value={vehicleForm.chassisNo}
                                onChange={(e) => setVehicleForm({ ...vehicleForm, chassisNo: e.target.value })}
                                placeholder="e.g. ZVW50-0192842"
                                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-12 gap-2 items-center">
                            <label className="col-span-12 sm:col-span-5 text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              BirthDay
                            </label>
                            <div className="col-span-12 sm:col-span-7">
                              <input
                                type="date"
                                value={vehicleForm.birthDay}
                                onChange={(e) => setVehicleForm({ ...vehicleForm, birthDay: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4 border-t border-slate-200">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {isEditingVehicle ? (
                              <button
                                type="button"
                                onClick={handleUpdateVehicle}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded text-xs shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <Save className="w-4 h-4" />
                                Update Vehicle
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded text-xs shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <Save className="w-4 h-4" />
                                Register Vehicle
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={handleUpdateVehicle}
                              disabled={!isEditingVehicle}
                              className={`font-bold py-2.5 px-3 rounded text-xs shadow flex items-center justify-center gap-1.5 transition ${isEditingVehicle ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                              <Edit3 className="w-4 h-4" />
                              Update
                            </button>

                            <button
                              type="button"
                              onClick={handleDeleteVehicle}
                              disabled={!isEditingVehicle}
                              className={`font-bold py-2.5 px-3 rounded text-xs shadow flex items-center justify-center gap-1.5 transition ${isEditingVehicle ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>

                            <button
                              type="button"
                              onClick={handleClearVehicleForm}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-3 rounded text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Bottom Search & Filter Grid */}
                <div className="bg-slate-100 border-t border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      Registered Vehicles
                    </span>
                    <button
                      type="button"
                      onClick={() => setVehicleFilters({ vehicleNumber: '', tagNumber: '', csName: '', city: '', vehicleModel: '', deliveryDate: '' })}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline transition"
                    >
                      Clear Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Vehicle Number</label>
                      <input
                        type="text"
                        value={vehicleFilters.vehicleNumber}
                        onChange={(e) => setVehicleFilters({ ...vehicleFilters, vehicleNumber: e.target.value })}
                        placeholder="Search..."
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Tag Number</label>
                      <input
                        type="text"
                        value={vehicleFilters.tagNumber}
                        onChange={(e) => setVehicleFilters({ ...vehicleFilters, tagNumber: e.target.value })}
                        placeholder="Search..."
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Cs Name</label>
                      <input
                        type="text"
                        value={vehicleFilters.csName}
                        onChange={(e) => setVehicleFilters({ ...vehicleFilters, csName: e.target.value })}
                        placeholder="Search..."
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">City</label>
                      <input
                        type="text"
                        value={vehicleFilters.city}
                        onChange={(e) => setVehicleFilters({ ...vehicleFilters, city: e.target.value })}
                        placeholder="Search..."
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Vehicle Model</label>
                      <input
                        type="text"
                        value={vehicleFilters.vehicleModel}
                        onChange={(e) => setVehicleFilters({ ...vehicleFilters, vehicleModel: e.target.value })}
                        placeholder="Search..."
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Delivery Date</label>
                      <input
                        type="date"
                        value={vehicleFilters.deliveryDate}
                        onChange={(e) => setVehicleFilters({ ...vehicleFilters, deliveryDate: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Registered Vehicles Table */}
                <div className="overflow-x-auto border-t border-slate-200">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3">Vehicle No</th>
                        <th className="py-2.5 px-3">Tag No</th>
                        <th className="py-2.5 px-3">Customer Name</th>
                        <th className="py-2.5 px-3">Address</th>
                        <th className="py-2.5 px-3">Telephone</th>
                        <th className="py-2.5 px-3">Model</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredVehicles.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-slate-400">
                            No registered vehicles match your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredVehicles.map((row, idx) => {
                          const isSelected = isEditingVehicle && vehicleForm.vehicleNo === row.vehicleNo;
                          return (
                            <tr
                              key={row._id || row.id || row.vehicleNo || idx}
                              onClick={() => handleLoadVehicleIntoForm(row)}
                              className={`cursor-pointer transition ${isSelected ? 'bg-blue-50/80 ring-1 ring-inset ring-blue-300' : 'hover:bg-slate-50'}`}
                            >
                              <td className="py-2.5 px-3">
                                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {row.vehicleNo}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">{row.tagNo || '-'}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900">{row.csName}</td>
                              <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={row.address}>{row.address || '-'}</td>
                              <td className="py-2.5 px-3 text-slate-700 font-mono">{row.mobileTel || row.homeTel || '-'}</td>
                              <td className="py-2.5 px-3 text-slate-800">{row.vModel || '-'}</td>
                              <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedServiceVehicleNo(row.vehicleNo);
                                      setVehicleSubTab('service');
                                      setServiceSubTab('add');
                                      showNotification(`Service & Bill for ${row.vehicleNo}`);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1 shadow-xs transition cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add Service
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedServiceVehicleNo(row.vehicleNo);
                                      setVehicleSubTab('history');
                                      setServiceSubTab('history');
                                      showNotification(`Showing service history for ${row.vehicleNo}`);
                                    }}
                                    className="bg-slate-700 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1 shadow-xs transition cursor-pointer"
                                  >
                                    <History className="w-3 h-3" />
                                    History
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Views 2 & 3: Vehicle Service & Bill / Vehicle History */}
            {(vehicleSubTab === 'service' || vehicleSubTab === 'history') && (
              <div className="space-y-6">
                {/* Top Vehicle Selector Bar with Live Search */}
                {vehicleSubTab !== 'catalog' && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                        {/* Live Search Input by Vehicle No */}
                        <div className="md:col-span-5 relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={serviceVehicleSearchQuery}
                            onChange={(e) => setServiceVehicleSearchQuery(e.target.value)}
                            placeholder="Type Vehicle No to search..."
                            className="w-full bg-slate-50 border-2 border-blue-400 focus:border-blue-600 rounded-lg pl-9 pr-7 py-2 text-sm font-bold font-mono uppercase text-slate-900 outline-none focus:bg-white shadow-xs"
                          />
                          {serviceVehicleSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setServiceVehicleSearchQuery('')}
                              className="text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Dropdown Selector */}
                        <div className="md:col-span-7">
                          <select
                            value={selectedServiceVehicleNo}
                            onChange={(e) => {
                              setSelectedServiceVehicleNo(e.target.value);
                              setServiceVehicleSearchQuery('');
                            }}
                            className="w-full bg-slate-50 border-2 border-blue-500 text-slate-900 rounded-lg px-3 py-2 text-sm font-bold outline-none shadow-xs cursor-pointer"
                          >
                            <option value="">-- Or Choose from Registered Vehicles ({vehicles.length}) --</option>
                            {vehicles.map(v => (
                              <option key={v._id || v.id || v.vehicleNo} value={v.vehicleNo}>
                                🚗 {v.vehicleNo} — {v.csName} ({v.vModel} - {v.colour})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Instant Search Results Chips */}
                      {serviceVehicleSearchQuery.trim() && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">Matching Vehicles:</span>
                          {(() => {
                            const q = serviceVehicleSearchQuery.trim().toLowerCase();
                            const matches = vehicles.filter(v =>
                              (v.vehicleNo && v.vehicleNo.toLowerCase().includes(q)) ||
                              (v.csName && v.csName.toLowerCase().includes(q)) ||
                              (v.vModel && v.vModel.toLowerCase().includes(q))
                            );
                            if (matches.length === 0) {
                              return <span className="text-xs text-slate-400 italic">No registered vehicle found matching &quot;{serviceVehicleSearchQuery}&quot;</span>;
                            }
                            return matches.slice(0, 6).map(v => (
                              <button
                                key={v._id || v.id || v.vehicleNo}
                                type="button"
                                onClick={() => {
                                  setSelectedServiceVehicleNo(v.vehicleNo);
                                  setServiceVehicleSearchQuery('');
                                }}
                                className={`text-xs font-bold px-2.5 py-1 rounded-md transition border flex items-center gap-1 cursor-pointer shadow-xs ${selectedServiceVehicleNo === v.vehicleNo
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                                  }`}
                              >
                                <Car className="w-3 h-3 text-blue-500" />
                                <span className="font-mono">{v.vehicleNo}</span>
                                <span className="text-[10px] font-normal opacity-75">({v.csName})</span>
                              </button>
                            ));
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Vehicle Profile Summary Card (Only shown when not in Job Master) */}
                {vehicleSubTab !== 'catalog' && (
                  currentServiceVehicle ? (
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-xl shadow-lg border border-slate-700">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-600/30 border border-blue-500/40 p-3 rounded-xl text-blue-300">
                            <Car className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-2xl font-black tracking-wide text-white">
                                {currentServiceVehicle.vehicleNo}
                              </span>
                              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold px-2 py-0.5 rounded">
                                {currentServiceVehicle.csStatus || 'Active Customer'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold text-white">{currentServiceVehicle.csName}</span>
                              <span>•</span>
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{currentServiceVehicle.mobileTel || currentServiceVehicle.homeTel || 'No phone'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Model & Type</span>
                            <span className="font-bold text-slate-100">{currentServiceVehicle.vModel} ({currentServiceVehicle.vType})</span>
                          </div>
                          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Previous Visits</span>
                            <span className="font-bold text-blue-400 text-sm">{serviceHistory.length} Services Recorded</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center text-blue-900">
                      <Car className="w-12 h-12 text-blue-500 mx-auto mb-2 opacity-80" />
                      <h3 className="text-base font-bold">Please Select a Vehicle Above</h3>
                      <p className="text-xs text-blue-700 max-w-md mx-auto mt-1">
                        Choose a vehicle from the dropdown above to record a new service done on that day, or to inspect the entire historical maintenance record of that vehicle.
                      </p>
                    </div>
                  ))}

                {/* Sub-View A: ADD SERVICE FORM (WITH AUTO-COUNTING TOTAL SERVICE CHARGES) */}
                {currentServiceVehicle && vehicleSubTab === 'service' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-blue-600" />
                          Add Service Performed for {currentServiceVehicle.vehicleNo}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                          Service Date: {serviceForm.serviceDate}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSaveServiceRecord} noValidate className="space-y-6">
                      {/* Service Metadata Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            Service Date
                          </label>
                          <input
                            type="date"
                            value={serviceForm.serviceDate}
                            onChange={(e) => setServiceForm({ ...serviceForm, serviceDate: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            Service Time
                          </label>
                          <input
                            type="text"
                            value={serviceForm.serviceTime}
                            onChange={(e) => setServiceForm({ ...serviceForm, serviceTime: e.target.value })}
                            placeholder="e.g. 10:30 AM"
                            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-blue-600" />
                            Current Odometer (KM) *
                          </label>
                          <input
                            type="number"
                            value={serviceForm.meterReading}
                            onChange={(e) => {
                              const odo = e.target.value;
                              setServiceForm({
                                ...serviceForm,
                                meterReading: odo,
                                nextServiceMeter: odo ? Number(odo) + 5000 : ''
                              });
                            }}
                            placeholder="e.g. 45000"
                            className="w-full bg-white border-2 border-blue-500 rounded px-3 py-1.5 text-sm font-bold text-slate-900 outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1.5 relative">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                            {/* Search Input */}
                            <div className="md:col-span-5 relative">
                              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={serviceTypeSearchQuery}
                                onFocus={() => setShowServicePickerDropdown(true)}
                                onChange={(e) => {
                                  setServiceTypeSearchQuery(e.target.value);
                                  setShowServicePickerDropdown(true);
                                }}
                                placeholder="Search service by name or code..."
                                className="w-full bg-slate-50 border-2 border-indigo-400 focus:border-indigo-600 rounded-lg pl-9 pr-7 py-2 text-sm font-bold text-slate-900 outline-none focus:bg-white shadow-xs"
                              />
                              {serviceTypeSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setServiceTypeSearchQuery('')}
                                  className="text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                                  title="Clear search"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Dropdown Trigger Button */}
                            <div className="md:col-span-7 relative">
                              <button
                                type="button"
                                onClick={() => setShowServicePickerDropdown((prev) => !prev)}
                                className="w-full bg-white border-2 border-slate-300 hover:border-indigo-400 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs flex items-center justify-between"
                              >
                                <span className="truncate">
                                  {serviceForm.selectedServices && serviceForm.selectedServices.length > 0
                                    ? `${serviceForm.selectedServices.length} Service${serviceForm.selectedServices.length > 1 ? 's' : ''} Selected`
                                    : `-- Choose Service Type (${jobs.length} in Job Master) --`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showServicePickerDropdown ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Multi-Select Tick Dropdown Panel */}
                          {showServicePickerDropdown && jobs.length > 0 && (
                            <div className="bg-white border-2 border-indigo-300 rounded-xl shadow-lg p-3 space-y-2 z-30">
                              <div className="max-h-48 overflow-y-auto">
                                {(() => {
                                  const q = serviceTypeSearchQuery.trim().toLowerCase();
                                  const matches = q
                                    ? jobs.filter(j =>
                                      (j.jobName && j.jobName.toLowerCase().includes(q)) ||
                                      (j.jobCode && j.jobCode.toLowerCase().includes(q)) ||
                                      (j.category && j.category.toLowerCase().includes(q))
                                    )
                                    : jobs;
                                  if (matches.length === 0) {
                                    return <span className="text-xs text-slate-400 italic px-1">No services match &quot;{serviceTypeSearchQuery}&quot;</span>;
                                  }
                                  return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                      {matches.map((j, idx) => {
                                        const isSelected = (serviceForm.selectedServices || []).some(s => s.jobName === j.jobName);
                                        return (
                                          <label
                                            key={`${j.id || j._id || j.jobCode || 'job'}-${idx}`}
                                            className={`px-2.5 py-1.5 rounded text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${isSelected
                                              ? 'bg-indigo-50 text-indigo-900 border-indigo-400'
                                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                                              }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => {
                                                if (isSelected) {
                                                  handleRemoveSelectedService(j.jobName);
                                                } else {
                                                  handleServiceTypeChange(j.jobName);
                                                }
                                              }}
                                              className="w-3.5 h-3.5 accent-indigo-600 cursor-pointer shrink-0"
                                            />
                                            <span className="truncate">{j.jobName}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="flex justify-end pt-1 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowServicePickerDropdown(false);
                                    setServiceTypeSearchQuery('');
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-lg cursor-pointer"
                                >
                                  Done
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Selected Services Display (1-2 clean rows after selecting) */}
                          {(serviceForm.selectedServices?.length > 0 || serviceForm.serviceType) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {serviceForm.selectedServices && serviceForm.selectedServices.length > 0 ? (
                                serviceForm.selectedServices.map((srv, idx) => (
                                  <div
                                    key={srv.jobName}
                                    className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded text-[11px] font-bold flex items-center justify-between gap-2"
                                  >
                                    <span className="truncate">
                                      {idx + 1}. {srv.jobName}
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="font-mono text-[10px] text-emerald-700">
                                        LKR {Number(srv.laborFee || 0).toLocaleString()}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSelectedService(srv.jobName)}
                                        className="text-emerald-700 hover:text-rose-600 cursor-pointer"
                                        title="Remove service"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded text-[11px] font-bold">
                                  ✓ {serviceForm.serviceType} (LKR {Number(serviceForm.laborCharges).toLocaleString()})
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Method Selector (Matches User Excel Image 2: Cash, Card, Bank Transfer, Cheque, Credit) */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          Payment Method (from Daily Sale Reference):
                        </label>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Credit (Pay Later)'].map(m => (
                            <button
                              type="button"
                              key={m}
                              onClick={() => setServiceForm({ ...serviceForm, paymentMethod: m })}
                              className={`px-3 py-1.5 rounded-lg font-bold border transition ${serviceForm.paymentMethod === m
                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* USED ITEMS & CONSUMABLES SECTION */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-blue-600" />
                              Used Items & Parts Consumed During Service
                            </label>
                          </div>
                        </div>

                        {/* Quick Select Supplier Item Dropdown Bar with Supplier Filter */}
                        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-xl p-4 mb-3 space-y-3 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-end gap-2 border-b border-blue-200/70 pb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-blue-700 font-semibold">
                                Filter by Vendor:
                              </span>
                              <select
                                value={quickPartSupplierFilter}
                                onChange={(e) => setQuickPartSupplierFilter(e.target.value)}
                                className="bg-white border border-blue-300 rounded px-2.5 py-1 text-xs font-bold text-blue-900 outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                              >
                                <option value="ALL">All Suppliers ({catalogItems.length} items)</option>
                                {suppliers.map(s => (
                                  <option key={s.id || s._id} value={s.supplierName}>
                                    {s.supplierName} ({catalogItems.filter(i => i.supplierName === s.supplierName).length} items)
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-end gap-3">
                            <div className="w-full md:flex-1">
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Available Parts Catalog:
                              </label>
                              <select
                                value={quickSelectedPartCode}
                                onChange={(e) => setQuickSelectedPartCode(e.target.value)}
                                className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                              >
                                <option value="">-- Choose Item / Part supplied by vendors to add to service bill --</option>
                                {catalogItems
                                  .filter(item => quickPartSupplierFilter === 'ALL' || item.supplierName === quickPartSupplierFilter)
                                  .map((item, itemIdx) => (
                                    <option key={item.id || item._id || `${item.itemCode}-${itemIdx}`} value={item.id || item._id || item.itemCode}>
                                      {item.supplierName ? `[${item.supplierName}] ` : '[General] '}
                                      {item.description} ({item.itemCode}) — LKR {Number(item.sellingPrice || 0).toLocaleString()} (Stock: {item.qtyOnHand || 0})
                                    </option>
                                  ))}
                              </select>
                            </div>

                            <div className="w-full md:w-24">
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-1">
                                Quantity:
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={quickPartQty}
                                onChange={(e) => setQuickPartQty(e.target.value)}
                                className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-xs font-black text-slate-900 text-center outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="w-full md:w-auto">
                              <button
                                type="button"
                                onClick={handleQuickAddPartToService}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                              >
                                <Plus className="w-4 h-4" />
                                Add to Vehicle Bill
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                              <tr>
                                <th className="py-2.5 px-3 w-10 text-center">#</th>
                                <th className="py-2.5 px-3">Item / Part Description & Code</th>
                                <th className="py-2.5 px-3 w-32 text-right">Unit Price (LKR)</th>
                                <th className="py-2.5 px-3 w-36 text-right">Total Price (LKR)</th>
                                <th className="py-2.5 px-3 w-10 text-center"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {serviceForm.parts.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="py-6 text-center text-slate-400">
                                    No items added yet. Choose an item from Available Parts Catalog above and click &quot;Add to Vehicle Bill&quot;.
                                  </td>
                                </tr>
                              ) : (
                                serviceForm.parts.map((p, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2 text-center font-mono text-slate-400">{idx + 1}</td>
                                    <td className="p-2">
                                      <div className="font-semibold text-slate-900">
                                        {p.name || '-'}
                                        {p.code ? <span className="ml-1.5 font-mono text-[11px] text-blue-700">({p.code})</span> : null}
                                      </div>
                                      {Number(p.quantity) > 1 && (
                                        <div className="text-[10px] text-slate-500">Qty: {p.quantity}</div>
                                      )}
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="number"
                                        value={p.unitPrice}
                                        onChange={(e) => handlePartFieldChange(idx, 'unitPrice', e.target.value)}
                                        min="0"
                                        className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-right text-slate-900 outline-none font-mono"
                                      />
                                    </td>
                                    <td className="p-2 text-right font-mono font-bold text-slate-800 text-sm">
                                      {(p.total || 0).toLocaleString()}
                                    </td>
                                    <td className="p-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePart(idx)}
                                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                                        title="Remove item"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                              <tr>
                                <td colSpan="3" className="py-2.5 px-4 font-bold text-right text-slate-700">
                                  Total Used Supplier Items Subtotal:
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-black text-blue-700 text-sm">
                                  LKR {usedItemsSubtotal.toLocaleString()}
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* TOTAL SERVICE CHARGERS COUNT & BREAKDOWN */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Notes & Recommendations */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              Technician Name / Staff Assigned
                            </label>
                            <input
                              type="text"
                              value={serviceForm.technician}
                              onChange={(e) => setServiceForm({ ...serviceForm, technician: e.target.value })}
                              placeholder="e.g. Senior Tech Ruwan"
                              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              Technician Inspection Notes & Diagnostics
                            </label>
                            <textarea
                              rows="2"
                              value={serviceForm.technicianNotes}
                              onChange={(e) => setServiceForm({ ...serviceForm, technicianNotes: e.target.value })}
                              placeholder="Condition of battery, brakes, suspension, tire tread depth, etc."
                              className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Next Recommended Date
                              </label>
                              <input
                                type="date"
                                value={serviceForm.nextServiceDate}
                                onChange={(e) => setServiceForm({ ...serviceForm, nextServiceDate: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Next Service Odometer (KM)
                              </label>
                              <input
                                type="number"
                                value={serviceForm.nextServiceMeter}
                                onChange={(e) => setServiceForm({ ...serviceForm, nextServiceMeter: e.target.value })}
                                placeholder="e.g. 50000"
                                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* LIVE BILLING & CALCULATION SUMMARY CARD */}
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-2 border-blue-200 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
                          <div>
                            <div className="flex items-center justify-between border-b border-blue-200/80 pb-2 mb-3">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                <Calculator className="w-4 h-4 text-blue-600" />
                                Total Service Charges Breakdown
                              </h4>
                              <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                                {serviceForm.serviceType}
                              </span>
                            </div>

                            {/* Line-by-line calculation */}
                            <div className="space-y-3 text-xs">
                              {/* Topic 1: Service (numbered 1, 2, 3...) */}
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-black uppercase tracking-wider text-slate-700 text-[11px]">
                                    Service
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-slate-500 font-semibold">Total Service Fee:</span>
                                    <div className="w-28">
                                      <input
                                        type="number"
                                        value={serviceForm.laborCharges}
                                        onChange={(e) => setServiceForm({ ...serviceForm, laborCharges: e.target.value })}
                                        min="0"
                                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-right text-xs font-mono font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white/90 border border-slate-200 rounded-lg p-2.5 space-y-1 shadow-2xs">
                                  {serviceForm.selectedServices && serviceForm.selectedServices.length > 0 ? (
                                    serviceForm.selectedServices.map((srv, idx) => (
                                      <div key={srv.jobName} className="flex justify-between items-center text-xs text-slate-800">
                                        <span className="font-bold">
                                          {idx + 1}. {srv.jobName}
                                        </span>
                                        <span className="font-mono font-bold text-slate-900">
                                          LKR {Number(srv.laborFee || 0).toLocaleString()}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="flex justify-between items-center text-xs text-slate-800">
                                      <span className="font-bold">1. {serviceForm.serviceType || 'Service'}</span>
                                      <span className="font-mono font-bold text-slate-900">
                                        LKR {Number(serviceForm.laborCharges || 0).toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Topic 2: Item (numbered 1, 2, 3...) */}
                              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-black uppercase tracking-wider text-slate-700 text-[11px]">
                                    Item
                                  </span>
                                  <span className="font-mono font-black text-blue-800 text-sm">
                                    LKR {usedItemsSubtotal.toLocaleString()}
                                  </span>
                                </div>

                                {serviceForm.parts.length > 0 ? (
                                  <div className="bg-white/90 border border-slate-200 rounded-lg p-2.5 space-y-1.5 shadow-2xs">
                                    {serviceForm.parts.map((p, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-xs text-slate-700">
                                        <div className="truncate max-w-[240px]">
                                          <span className="font-bold text-slate-900">{idx + 1}. {p.name || 'Custom Part'}</span>
                                          <span className="text-slate-500 font-mono text-[11px] ml-1">
                                            (Qty: {p.quantity || 1} × LKR {Number(p.unitPrice || 0).toLocaleString()})
                                          </span>
                                        </div>
                                        <span className="font-mono font-bold text-slate-900 text-xs">
                                          LKR {Number(p.total || ((p.quantity || 1) * (p.unitPrice || 0))).toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded p-2 text-center text-[11px] text-slate-400 italic">
                                    No used items or supplier parts added to this bill yet.
                                  </div>
                                )}
                              </div>

                              {/* 3. Discount */}
                              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                                <div>
                                  <span className="font-semibold text-slate-700 block">3. Less Discount (LKR):</span>
                                </div>
                                <div className="w-32">
                                  <input
                                    type="number"
                                    value={serviceForm.discount}
                                    onChange={(e) => setServiceForm({ ...serviceForm, discount: e.target.value })}
                                    min="0"
                                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-right text-xs font-mono font-bold text-rose-600 outline-none"
                                  />
                                </div>
                              </div>

                              {/* Grand Total */}
                              <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                                <div>
                                  <span className="text-sm font-black text-slate-900 uppercase block">
                                    Total Service Charges:
                                  </span>
                                </div>
                                <span className="font-mono text-2xl font-black text-blue-700">
                                  LKR {totalServiceCharges.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={savingService}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                              <Save className="w-5 h-5" />
                              {savingService
                                ? 'Saving Service...'
                                : `Save Service & Generate Customer Bill (LKR ${totalServiceCharges.toLocaleString()})`}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Sub-View B: COMPLETE SERVICE HISTORY TIMELINE */}
                {currentServiceVehicle && vehicleSubTab === 'history' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <History className="w-5 h-5 text-blue-600" />
                          Maintenance & Billing History for Vehicle {currentServiceVehicle.vehicleNo}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setVehicleSubTab('service');
                            setServiceSubTab('add');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition"
                        >
                          <Plus className="w-4 h-4" />
                          Add Another Service
                        </button>
                      </div>
                    </div>

                    {loadingHistory ? (
                      <div className="py-12 text-center text-slate-400">Loading service history from MongoDB...</div>
                    ) : serviceHistory.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 space-y-3">
                        <History className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-600">No past services recorded yet for this vehicle.</p>
                        <button
                          onClick={() => {
                            setVehicleSubTab('service');
                            setServiceSubTab('add');
                          }}
                          className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Log First Service Done Today
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {serviceHistory.map((srv, idx) => {
                          const odo = srv.meterReading || srv.odometer || 0;
                          const partsAmount = srv.partsTotal || (srv.parts ? srv.parts.reduce((s, p) => s + (p.total || 0), 0) : 0);
                          const laborFee = srv.jobTotal || srv.laborCharges || 0;
                          const finalTotal = srv.billTotal || srv.grandTotal || srv.totalAmount || 0;
                          const usedParts = srv.parts && srv.parts.length > 0
                            ? srv.parts
                            : (srv.items ? srv.items.filter(i => i.itemType === 'item') : []);
                          const jobLines = srv.items ? srv.items.filter(i => i.itemType === 'job') : [];

                          return (
                            <div
                              key={srv._id || srv.invoiceNo || idx}
                              className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs"
                            >
                              {/* Row 1: Date & Time */}
                              <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <span className="font-mono font-bold flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                    {srv.serviceDate || '-'} {srv.serviceTime ? `• ${srv.serviceTime}` : ''}
                                  </span>
                                  <span className="bg-blue-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                                    {srv.invoiceNo || srv.serviceNo || `SRV-${idx + 1}`}
                                  </span>
                                  {odo ? (
                                    <span className="bg-slate-800 text-slate-200 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-700">
                                      {odo.toLocaleString()} KM
                                    </span>
                                  ) : null}
                                </div>
                                <div className="font-mono font-black text-sm text-emerald-300">
                                  Total: LKR {Number(finalTotal).toLocaleString()}
                                </div>
                              </div>

                              {/* Row 2: Service / Item & Price List */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                                      <th className="py-2 px-4">Service / Item</th>
                                      <th className="py-2 px-4 text-right w-36">Price (LKR)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {jobLines.length > 0 ? (
                                      jobLines.map((j, jIdx) => (
                                        <tr key={`job-${jIdx}`} className="hover:bg-slate-50">
                                          <td className="py-2 px-4 font-bold text-slate-900">
                                            {jIdx + 1}. {j.description}
                                          </td>
                                          <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                                            {Number(j.amount ?? j.rate ?? 0).toLocaleString()}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr className="hover:bg-slate-50">
                                        <td className="py-2 px-4 font-bold text-slate-900">
                                          {srv.serviceType || 'Service Visit'}
                                        </td>
                                        <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                                          {Number(laborFee).toLocaleString()}
                                        </td>
                                      </tr>
                                    )}

                                    {usedParts.map((p, pIdx) => (
                                      <tr key={`part-${pIdx}`} className="hover:bg-slate-50">
                                        <td className="py-2 px-4 text-slate-700">
                                          <span className="font-semibold text-slate-900">{p.name || p.description}</span>
                                          <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
                                            ({p.quantity || p.qty || 1}x @ LKR {Number(p.unitPrice || p.rate || 0).toLocaleString()})
                                          </span>
                                        </td>
                                        <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                                          {Number(p.total || p.amount || 0).toLocaleString()}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                                    <tr>
                                      <td className="py-2 px-4 text-right text-slate-600 text-[11px]">
                                        Service: LKR {Number(laborFee).toLocaleString()} | Items: LKR {Number(partsAmount).toLocaleString()}
                                      </td>
                                      <td className="py-2 px-4 text-right font-mono font-black text-blue-700 text-sm">
                                        LKR {Number(finalTotal).toLocaleString()}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>

                              {/* Row 3: Handled By & Payment, Next Recommended, Actions */}
                              <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex flex-wrap items-center gap-3 text-slate-700">
                                  <span>
                                    <span className="text-slate-500">Handled by:</span>{' '}
                                    <strong>{srv.technician || 'Staff'}</strong>
                                  </span>
                                  <span className="text-slate-300">|</span>
                                  <span>
                                    <span className="text-slate-500">Payment:</span>{' '}
                                    <strong>{srv.paymentType || 'CASH'}</strong>
                                  </span>
                                  {srv.technicianNotes && (
                                    <span className="text-[11px] italic text-slate-500">
                                      — &quot;{srv.technicianNotes}&quot;
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {(srv.nextServiceMeter || srv.nextServiceMileage || srv.nextServiceDate) && (
                                    <div className="bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded text-[11px] font-semibold">
                                      Next Recommended: {(srv.nextServiceMeter || srv.nextServiceMileage)
                                        ? `${(srv.nextServiceMeter || srv.nextServiceMileage).toLocaleString()} KM`
                                        : ''}
                                      {srv.nextServiceDate ? ` on or before ${srv.nextServiceDate}` : ''}
                                    </div>
                                  )}

                                  {srv.nextServiceDate && (
                                    <button
                                      type="button"
                                      onClick={() => handleSendServiceReminder(srv)}
                                      className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 border transition cursor-pointer whitespace-nowrap ${srv.reminderSent
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                        }`}
                                      title={srv.reminderSent ? `Reminder sent (${srv.reminderSentAt?.slice(0, 10) || 'Done'}) - Click to resend` : 'Send Next Service Reminder Email via SMTP'}
                                    >
                                      <Mail className="w-3 h-3" />
                                      {srv.reminderSent ? 'Reminder Sent' : 'Send Reminder Email'}
                                    </button>
                                  )}

                                  <a
                                    href={`/bill/${encodeURIComponent(srv._id || srv.id || srv.invoiceNo)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1 shadow-xs transition cursor-pointer whitespace-nowrap"
                                    title="Open Bill in Another Page to Print"
                                  >
                                    <Printer className="w-3 h-3 text-white" />
                                    Print Bill
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* If no vehicle selected while on Add Service */}
                {!currentServiceVehicle && vehicleSubTab === 'service' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center space-y-4">
                    <Car className="w-12 h-12 text-blue-500 mx-auto opacity-50" />
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Select a Vehicle to Record a Service & Bill</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        Please choose a vehicle from the selector above to log work done, apply replacement parts, and print the customer invoice.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                      <button
                        onClick={() => setVehicleSubTab('registration')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                      >
                        Register New Vehicle
                      </button>
                      <button
                        onClick={() => setActiveTab('Job')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wrench className="w-4 h-4" />
                        Manage Services / Job Master
                      </button>
                    </div>
                  </div>
                )}

                {/* If no vehicle selected while on History */}
                {!currentServiceVehicle && vehicleSubTab === 'history' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center space-y-3">
                    <History className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
                    <h3 className="text-base font-bold text-slate-800">Choose a Vehicle to View History</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Select any vehicle by number above to see all previous maintenance dates, parts replaced, and billing history.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB: Job (SERVICE PAGE - ONLY ADD AND DISPLAY SERVICES, LIKE BEFORE)
            ========================================================================= */}
        {activeTab === 'Job' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form to Add/Edit Job Definition */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div className="border-b pb-2 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    {isEditingJob ? <Edit3 className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                    {isEditingJob ? 'Edit Service Definition' : 'Add New Service / Job to Master'}
                  </h3>
                  {isEditingJob && (
                    <button
                      onClick={() => {
                        setIsEditingJob(false);
                        setEditingJobId(null);
                        setJobForm(emptyJobForm);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-700 underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveJob} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Job Code *</label>
                      <input
                        type="text"
                        value={jobForm.jobCode}
                        onChange={(e) => setJobForm({ ...jobForm, jobCode: e.target.value })}
                        placeholder="e.g. JOB-WSH-01"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono uppercase font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category *</label>
                      <select
                        value={jobForm.category}
                        onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-semibold text-slate-800 outline-none"
                      >
                        <option value="Vehicle Service">Vehicle Service</option>
                        <option value="Car Wash">Car Wash</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Diagnostics">Diagnostics</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Service / Job Name *</label>
                    <input
                      type="text"
                      value={jobForm.jobName}
                      onChange={(e) => setJobForm({ ...jobForm, jobName: e.target.value })}
                      placeholder="e.g. Body Wash / Under Wash / Full Service"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Standard Labor Fee (LKR) *</label>
                      <input
                        type="number"
                        value={jobForm.standardLaborFee}
                        onChange={(e) => setJobForm({ ...jobForm, standardLaborFee: e.target.value })}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Next Service Odometer (KM)</label>
                      <input
                        type="number"
                        min="0"
                        value={jobForm.nextServiceOdometer}
                        onChange={(e) => setJobForm({ ...jobForm, nextServiceOdometer: e.target.value })}
                        placeholder="e.g. 50000"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Scope / Description</label>
                    <textarea
                      rows={2}
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      placeholder="Brief description of service work performed"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Checklist Tasks (1 per line)</label>
                      <span className="text-[10px] text-slate-400">Optional</span>
                    </div>
                    <textarea
                      rows={3}
                      value={jobForm.checklistText}
                      onChange={(e) => setJobForm({ ...jobForm, checklistText: e.target.value })}
                      placeholder="e.g.&#10;Engine Oil Replaced&#10;Filter Replaced&#10;Tire Pressure Checked"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none resize-none font-mono text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isEditingJob ? 'Update Service in Catalog' : 'Save Service to Catalog'}
                  </button>
                </form>
              </div>

              {/* Right 2 Columns: Table of Registered Jobs */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-indigo-600" />
                      Services & Jobs List ({jobs.length})
                    </h3>
                  </div>

                  {/* Filter by Category & Search */}
                  <div className="flex items-center gap-2 text-xs">
                    <select
                      value={jobFilterCategory}
                      onChange={(e) => setJobFilterCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 font-semibold outline-none"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Vehicle Service">Vehicle Service</option>
                      <option value="Car Wash">Car Wash</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Diagnostics">Diagnostics</option>
                      <option value="Other">Other</option>
                    </select>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                      <input
                        type="text"
                        value={jobSearchQuery}
                        onChange={(e) => setJobSearchQuery(e.target.value)}
                        placeholder="Search job..."
                        className="bg-slate-50 border border-slate-300 rounded pl-7 pr-2.5 py-1.5 text-slate-700 outline-none w-32 focus:w-40 transition-all text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[325px] border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3">Job Code</th>
                        <th className="py-2.5 px-3">Service Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Labor Fee (LKR)</th>
                        <th className="py-2.5 px-3 text-center">Next Odometer (KM)</th>
                        <th className="py-2.5 px-3 text-center">Checklist</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {(() => {
                        const filteredJobs = jobs.filter(j => {
                          const matchCat = jobFilterCategory === 'ALL' || j.category === jobFilterCategory;
                          const q = jobSearchQuery.toLowerCase();
                          const matchQ = !q || j.jobName?.toLowerCase().includes(q) || j.jobCode?.toLowerCase().includes(q);
                          return matchCat && matchQ;
                        });

                        if (filteredJobs.length === 0) {
                          return (
                            <tr>
                              <td colSpan="7" className="py-8 text-center text-slate-400 space-y-2">
                                <p className="font-semibold text-slate-600">No services found in catalog.</p>
                                <p className="text-[11px] text-slate-400">
                                  Use the form on the left to add your first service.
                                </p>
                              </td>
                            </tr>
                          );
                        }

                        return filteredJobs.map((j, idx) => (
                          <tr key={`${j.id || j._id || j.jobCode || 'job'}-${idx}`} className="hover:bg-indigo-50/40 transition">
                            <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{j.jobCode}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">{j.jobName}</div>
                              {j.description && <div className="text-[10px] text-slate-500 truncate max-w-xs">{j.description}</div>}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                {j.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                              {Number(j.standardLaborFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                              {j.nextServiceOdometer ? `${Number(j.nextServiceOdometer).toLocaleString()} KM` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                {j.defaultChecklist?.length || 0} tasks
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleEditJob(j)}
                                  className="p-1 text-slate-500 hover:text-blue-600 transition cursor-pointer"
                                  title="Edit Job"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(j.id || j._id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                  title="Delete Job"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setServiceForm(prev => ({
                                      ...prev,
                                      serviceType: j.jobName,
                                      laborCharges: j.standardLaborFee || 0,
                                      checklist: j.defaultChecklist && j.defaultChecklist.length > 0 ? [...j.defaultChecklist] : prev.checklist,
                                      jobDetails: j.description || `${j.jobName} service`
                                    }));
                                    setActiveTab('Cs/Vehicle');
                                    setVehicleSubTab('service');
                                    setServiceSubTab('add');
                                    showNotification(`Selected "${j.jobName}"! Pick a vehicle to complete billing.`);
                                  }}
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                                  title="Use this service for vehicle"
                                >
                                  Select
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: Expenses (INCLUDES: EXPENSES & REVENUE, PAY TODAY, EXPEN/GROUP ANALYSIS)
            ========================================================================= */}
        {(activeTab === 'Expenses' || activeTab === 'Pay Today' || activeTab === 'Expen/Group') && (
          <div className="space-y-6">
            {/* Expenses Sub-Navigation Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('Expenses');
                    setExpenseSubTab('expenses');
                  }}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition cursor-pointer ${(expenseSubTab === 'expenses' && activeTab === 'Expenses')
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Daily Operating Expenses
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('Expenses');
                    setExpenseSubTab('pay_today');
                  }}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition cursor-pointer ${(expenseSubTab === 'pay_today' || activeTab === 'Pay Today')
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-300 hover:text-white hover:bg-rose-950/50'
                    }`}
                >
                  <AlertTriangle className={`w-4 h-4 ${(financials.expensesShouldPayToday || 0) > 0 ? 'text-amber-300 animate-pulse' : ''}`} />
                  Pay Today
                  {(financials.paymentsRequiringAttentionToday?.length || 0) > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {financials.paymentsRequiringAttentionToday.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('Expenses');
                    setExpenseSubTab('analysis');
                  }}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition cursor-pointer ${(expenseSubTab === 'analysis' || activeTab === 'Expen/Group')
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  <Layers className="w-4 h-4" />
                  Expense/Revenue Summary
                </button>
              </div>

              <div className="flex items-center gap-3 pr-2 text-xs">
                <span className="text-slate-400 text-[11px]">Today:</span>
                <span className="font-mono text-slate-200 font-bold">{financials.todayStr}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px]">Due Today:</span>
                <span className="font-mono text-rose-300 font-black">
                  LKR {Number(financials.expensesShouldPayToday || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sub-View 1: Expenses (Revenue & Due Today - Operating Expenses Tracker) */}
            {expenseSubTab === 'expenses' && (
              <div className="space-y-6">

                {/* Prompt Alert Banner if bills need payment today */}
                {(financials.expensesShouldPayToday || 0) > 0 && (
                  <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-rose-600">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-rose-800/80 rounded-lg text-amber-300">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm flex items-center gap-2">
                          <span>Payments Requiring Attention Today</span>
                          <span className="bg-red-600 text-white text-[10px] uppercase font-black px-2 py-0.2 rounded-full">
                            {financials.paymentsRequiringAttentionToday?.length || 0} Invoices Due
                          </span>
                        </h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('Expenses');
                        setExpenseSubTab('pay_today');
                      }}
                      className="bg-white hover:bg-rose-50 text-rose-900 font-bold text-xs px-4 py-2.5 rounded-lg transition shadow flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      Open Pay Today View
                      <ArrowRight className="w-4 h-4 text-rose-800" />
                    </button>
                  </div>
                )}

                {/* =========================================================================
                OPERATING EXPENSES (MATCHING USER'S EXCEL "Daily Sale.xlsx" LISTS TAB)
                Categories: Electricity, Telephone, Salary, Maintenance, Tea & Sugar, etc.
                ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form: Record Operating Expense */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                    <div className="border-b pb-2 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-rose-600" />
                        {isEditingExpense ? 'Edit Operating Expense' : 'Record Daily Operating Expense'}
                      </h3>
                      {isEditingExpense ? (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                          Editing
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          Daily Sale Lists
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Expense Category *</label>
                        <select
                          value={newExpenseData.category}
                          onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                        >
                          {expenseCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>

                        {newExpenseData.category === 'Other' && (
                          <div className="mt-2 flex gap-1.5">
                            <input
                              type="text"
                              value={customExpenseCategory}
                              onChange={(e) => setCustomExpenseCategory(e.target.value)}
                              placeholder="Enter new category name..."
                              className="flex-1 bg-white border border-blue-400 rounded px-2.5 py-1 text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomExpenseCategory}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs transition cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Payee Type (Other / Worker) *</label>
                        <div className="grid grid-cols-2 gap-1.5 mb-2">
                          {['Other', 'Worker'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setNewExpenseData({ ...newExpenseData, payeeType: type })}
                              className={`py-1.5 rounded text-xs font-bold border transition cursor-pointer ${
                                (newExpenseData.payeeType || 'Other') === type
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {(newExpenseData.payeeType || 'Other') === 'Worker' ? 'Worker Name *' : 'Other / Payee Name *'}
                        </label>
                        <input
                          type="text"
                          list={(newExpenseData.payeeType || 'Other') === 'Worker' ? 'worker-names-list' : 'expense-other-names-list'}
                          value={newExpenseData.payee}
                          onChange={(e) => setNewExpenseData({ ...newExpenseData, payee: e.target.value })}
                          placeholder={(newExpenseData.payeeType || 'Other') === 'Worker' ? 'Enter worker name...' : 'e.g. Ceylon Electricity Board / Payee name'}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                        <datalist id="expense-other-names-list">
                          {suppliers.map(s => (
                            <option key={s.id || s._id} value={s.supplierName} />
                          ))}
                        </datalist>
                        <datalist id="worker-names-list">
                          {Array.from(new Set(expenses.filter(e => e.payeeType === 'Worker' && e.payee).map(e => e.payee))).map(name => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Description / Purpose *</label>
                        <input
                          type="text"
                          value={newExpenseData.description}
                          onChange={(e) => setNewExpenseData({ ...newExpenseData, description: e.target.value })}
                          placeholder="e.g. Compressor power bill / Staff refreshments"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Amount (LKR) *</label>
                          <input
                            type="number"
                            value={newExpenseData.amount}
                            onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Expense Date</label>
                          <input
                            type="date"
                            value={newExpenseData.expenseDate}
                            onChange={(e) => setNewExpenseData({ ...newExpenseData, expenseDate: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Txn Type</label>
                          <select
                            value={newExpenseData.txnType || 'Expense'}
                            onChange={(e) => setNewExpenseData({ ...newExpenseData, txnType: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-800 outline-none font-semibold"
                          >
                            {['Expense', 'Cash Out', 'Advance', 'Petty Cash', 'Salary / Wage', 'Bank Deposit / Transfer', 'Refund', 'Other'].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                          <select
                            value={newExpenseData.paymentMethod}
                            onChange={(e) => setNewExpenseData({ ...newExpenseData, paymentMethod: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-800 outline-none"
                          >
                            {['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Credit (Pay Later)'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                          <select
                            value={newExpenseData.status}
                            onChange={(e) => setNewExpenseData({ ...newExpenseData, status: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-800 outline-none font-semibold"
                          >
                            <option value="Paid">Paid</option>
                            <option value="Should Pay Today">Should Pay Today</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Notes / Voucher Reference</label>
                        <input
                          type="text"
                          value={newExpenseData.notes}
                          onChange={(e) => setNewExpenseData({ ...newExpenseData, notes: e.target.value })}
                          placeholder="Optional notes or receipt no."
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          {isEditingExpense ? 'Update Operating Expense' : 'Save Operating Expense'}
                        </button>

                        {isEditingExpense && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingExpense(false);
                              setEditingExpenseId(null);
                              setNewExpenseData({
                                category: 'Electricity',
                                description: '',
                                payeeType: 'Other',
                                payee: '',
                                amount: '',
                                expenseDate: new Date().toISOString().split('T')[0],
                                dueDate: new Date().toISOString().split('T')[0],
                                txnType: 'Expense',
                                paymentMethod: 'Cash',
                                status: 'Should Pay Today',
                                notes: ''
                              });
                            }}
                            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1.5 rounded text-xs transition cursor-pointer"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Table: Operating Expenses Log */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          Operating Expenses Log
                        </h3>
                        <p className="text-[11px] text-slate-500">Utilities, salaries, refreshments, and facility maintenance</p>
                      </div>

                      {/* Filter by Category */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <select
                          value={expenseFilterCategory}
                          onChange={(e) => setExpenseFilterCategory(e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 outline-none"
                        >
                          <option value="ALL">All Categories</option>
                          {expenseCategories.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>

                        <select
                          value={expenseFilterStatus}
                          onChange={(e) => setExpenseFilterStatus(e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 outline-none"
                        >
                          <option value="ALL">All Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Should Pay Today">Should Pay Today</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Txn Type</th>
                            <th className="py-2 px-3">Category</th>
                            <th className="py-2 px-3">Description</th>
                            <th className="py-2 px-3">Other / Payee</th>
                            <th className="py-2 px-3">Method</th>
                            <th className="py-2 px-3 text-right">Amount (LKR)</th>
                            <th className="py-2 px-3 text-center">Status</th>
                            <th className="py-2 px-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {expenses
                            .filter(e => e.payeeType !== 'Worker')
                            .filter(e => expenseFilterCategory === 'ALL' || e.category === expenseFilterCategory)
                            .filter(e => expenseFilterStatus === 'ALL' || e.status === expenseFilterStatus)
                            .map((exp) => (
                              <tr key={exp.id || exp._id} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-mono text-slate-600">{exp.expenseDate}</td>
                                <td className="py-2 px-3">
                                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {exp.txnType || 'Expense'}
                                  </span>
                                </td>
                                <td className="py-2 px-3">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {exp.category}
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-semibold text-slate-800">{exp.description}</td>
                                <td className="py-2 px-3 text-slate-600">{exp.payee || '-'}</td>
                                <td className="py-2 px-3 font-mono text-slate-600">{exp.paymentMethod || 'Cash'}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                  {Number(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${exp.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : exp.status === 'Should Pay Today'
                                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                                      : 'bg-amber-100 text-amber-800'
                                    }`}>
                                    {exp.status}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleEditExpense(exp)}
                                      className="text-slate-400 hover:text-blue-600 p-1 transition cursor-pointer"
                                      title="Edit Expense"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteExpense(exp.id || exp._id)}
                                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                                      title="Delete Expense"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Separate Worker Expenses List with Dates & Worker Name Search */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        Worker Expenses Log
                      </h3>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={workerSearchQuery}
                        onChange={(e) => setWorkerSearchQuery(e.target.value)}
                        placeholder="Search worker by name..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Txn Type</th>
                          <th className="py-2.5 px-3">Worker Name</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3">Method</th>
                          <th className="py-2.5 px-3 text-right">Amount (LKR)</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {(() => {
                          const workerExpenses = expenses
                            .filter(e => e.payeeType === 'Worker')
                            .filter(e => {
                              if (!workerSearchQuery.trim()) return true;
                              return (e.payee || '').toLowerCase().includes(workerSearchQuery.trim().toLowerCase());
                            });

                          if (workerExpenses.length === 0) {
                            return (
                              <tr>
                                <td colSpan="8" className="py-8 text-center text-slate-400">
                                  No worker expenses recorded{workerSearchQuery ? ` matching "${workerSearchQuery}"` : ''}.
                                </td>
                              </tr>
                            );
                          }

                          return workerExpenses.map((exp) => (
                            <tr key={exp.id || exp._id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-mono text-slate-600">{exp.expenseDate}</td>
                              <td className="py-2.5 px-3">
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {exp.txnType || 'Expense'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-bold text-indigo-700">{exp.payee || '-'}</td>
                              <td className="py-2.5 px-3">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {exp.category}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-800">{exp.description}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">{exp.paymentMethod || 'Cash'}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                {Number(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${exp.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : exp.status === 'Should Pay Today'
                                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                                    : 'bg-amber-100 text-amber-800'
                                  }`}>
                                  {exp.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleEditExpense(exp)}
                                    className="text-slate-400 hover:text-blue-600 p-1 transition cursor-pointer"
                                    title="Edit Expense"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteExpense(exp.id || exp._id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                                    title="Delete Expense"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
            Sub-View 2: Pay Today (PAYMENTS REQUIRING ATTENTION - TODAY)
            Exact Replica of User's Excel "TODAY_REMINDERS" from Reference Screenshots
            ========================================================================= */}
            {expenseSubTab === 'pay_today' && (
              <div className="space-y-6">
                {/* Pay Today Metric Highlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-rose-950 to-slate-900 text-white rounded-xl p-5 border border-rose-600/70 shadow-sm">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                      Total Should Pay Today
                    </span>
                    <div className="text-2xl font-black font-mono tracking-tight text-white">
                      LKR {Number(financials.expensesShouldPayToday || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[11px] text-rose-300/80 mt-1">Due Today + Overdue Invoices</p>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                      Overdue Invoices
                    </span>
                    <div className="text-2xl font-black font-mono text-rose-600">
                      {(financials.paymentsRequiringAttentionToday || []).filter(i => i.status === 'OVERDUE' || (i.dueDate && i.dueDate < financials.todayStr)).length} Bills
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Past designated credit terms</p>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      Invoices Due Today
                    </span>
                    <div className="text-2xl font-black font-mono text-blue-600">
                      {(financials.paymentsRequiringAttentionToday || []).filter(i => i.dueDate === financials.todayStr).length} Bills
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Due for payment today ({financials.todayStr})</p>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      Settled Expenses Today
                    </span>
                    <div className="text-2xl font-black font-mono text-emerald-600">
                      LKR {Number(financials.expensesPaidToday || 0).toLocaleString()}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Payments recorded today</p>
                  </div>
                </div>

                {/* BANNER: "PAYMENTS REQUIRING ATTENTION - TODAY" TABLE */}
                <div className="bg-white rounded-xl shadow-md border border-rose-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-800 via-rose-900 to-red-950 text-white p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
                          PAYMENTS REQUIRING ATTENTION - TODAY
                        </h2>
                      </div>

                      {/* Filter chips */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-rose-300 font-semibold text-[11px]">Filter:</span>
                        {['ALL', 'OVERDUE', 'DUE TODAY'].map((filterMode) => (
                          <button
                            key={filterMode}
                            onClick={() => setAttentionFilter(filterMode)}
                            className={`px-3 py-1 rounded font-bold transition text-xs cursor-pointer ${attentionFilter === filterMode
                              ? 'bg-white text-rose-900 shadow'
                              : 'bg-rose-950/60 text-rose-200 hover:bg-rose-900/60'
                              }`}
                          >
                            {filterMode}
                          </button>
                        ))}
                        <button
                          onClick={loadFinancials}
                          className="p-1.5 bg-rose-900/80 hover:bg-rose-800 text-white rounded transition ml-1 cursor-pointer"
                          title="Refresh Live Financials"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingFinancials ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table of Attention Invoices */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                          <th className="py-2.5 px-3">Invoice_ID</th>
                          <th className="py-2.5 px-3">Supplier_Name</th>
                          <th className="py-2.5 px-3">Invoice_No</th>
                          <th className="py-2.5 px-3">PO/GRN_No</th>
                          <th className="py-2.5 px-3">Invoice_Date</th>
                          <th className="py-2.5 px-3 text-center">Credit_Days</th>
                          <th className="py-2.5 px-3">Due_Date</th>
                          <th className="py-2.5 px-3 text-right">Invoice_Amount</th>
                          <th className="py-2.5 px-3 text-right">Amount_Paid</th>
                          <th className="py-2.5 px-3 text-right">Balance</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-center">Days_Overdue</th>
                          <th className="py-2.5 px-3 text-center">Reminder</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {(() => {
                          const list = (financials.paymentsRequiringAttentionToday || []).filter((inv) => {
                            if (attentionFilter === 'OVERDUE') return inv.attentionReason === 'OVERDUE' || inv.status === 'OVERDUE';
                            if (attentionFilter === 'DUE TODAY') return inv.attentionReason === 'DUE TODAY' || inv.dueDate === financials.todayStr;
                            return true;
                          });

                          if (list.length === 0) {
                            return (
                              <tr>
                                <td colSpan="14" className="py-8 text-center text-slate-500">
                                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                  <p className="font-bold text-sm text-slate-700">No Pending Payments Requiring Attention Today!</p>
                                  <p className="text-xs text-slate-400">All supplier invoices are within credit limits or fully settled.</p>
                                </td>
                              </tr>
                            );
                          }

                          return list.map((inv) => {
                            const isOverdue = inv.status === 'OVERDUE' || (inv.dueDate && inv.dueDate < financials.todayStr);
                            return (
                              <tr key={inv.id || inv._id} className="hover:bg-rose-50/50 transition">
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{inv.invoiceId}</td>
                                <td className="py-2.5 px-3 font-bold text-slate-900">{inv.supplierName}</td>
                                <td className="py-2.5 px-3 font-mono font-semibold text-blue-700">{inv.invoiceNo}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">{inv.poGrnNo || '-'}</td>
                                <td className="py-2.5 px-3 font-mono text-slate-600">{inv.invoiceDate}</td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">{inv.creditDays}d</td>
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{inv.dueDate}</td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                                  {Number(inv.invoiceAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">
                                  {Number(inv.amountPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-black text-rose-700 bg-rose-50/70">
                                  {Number(inv.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isOverdue ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {isOverdue ? 'OVERDUE' : 'DUE TODAY'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700">
                                  {inv.daysOverdue > 0 ? `+${inv.daysOverdue}` : 'Today'}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="bg-red-700 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse shadow-xs">
                                    URGENT
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    onClick={() => {
                                      setPayingInvoice(inv);
                                      setPaymentFormData({
                                        amount: inv.balance,
                                        paymentDate: financials.todayStr,
                                        method: 'Cheque',
                                        chequeNo: '',
                                        chequeIssueDate: financials.todayStr,
                                        chequeStatus: 'Issued',
                                        clearedDate: '',
                                        bankAccount: 'Commercial Bank - Main',
                                        notes: `Settlement for Invoice ${inv.invoiceNo} (${inv.supplierName})`
                                      });
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded text-xs transition shadow flex items-center gap-1 mx-auto cursor-pointer"
                                  >
                                    <CreditCard className="w-3 h-3" />
                                    Pay Now
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
            Sub-View 3: Expen/Group (FINANCIAL BREAKDOWN & CATEGORY GROUPING)
            ========================================================================= */}
            {expenseSubTab === 'analysis' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="border-b pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        Expense & Revenue Group Analysis
                      </h2>
                    </div>
                  </div>

                  {/* Grouping Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Expense Breakdown by Category */}
                    {/* 1. Dynamic Expense Category Breakdown from Real Database */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <TrendingDown className="w-4 h-4 text-rose-600" />
                          Expense Category Breakdown
                        </span>
                        <span className="font-mono text-rose-700 font-bold">
                          Total: LKR {Number(financials.totalExpensesPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </h3>

                      <div className="space-y-2">
                        {(() => {
                          // Aggregate expenses by category
                          const categoryMap = {};
                          expenses.forEach(e => {
                            const cat = e.category || 'Other Operating Expense';
                            categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
                          });

                          // Also include supplier payables
                          if (financials.supplierPayablesTotal > 0) {
                            categoryMap['Supplier Invoices'] = financials.supplierPayablesTotal;
                          }

                          const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
                          const totalExp = (financials.totalExpensesPaid + (financials.supplierPayablesTotal || 0)) || 1;
                          const maxVal = Math.max(...entries.map(e => e[1]), 1);

                          if (entries.length === 0) {
                            return (
                              <div className="bg-white p-6 rounded-lg border border-slate-200 text-center space-y-1 text-slate-400">
                                <p className="text-xs font-semibold text-slate-600">No expenses recorded yet.</p>
                                <p className="text-[11px] text-slate-400">
                                  Operating expenses and supplier settlements will dynamically calculate here.
                                </p>
                              </div>
                            );
                          }

                          return entries.map(([category, amount]) => {
                            const pct = Math.round((amount / totalExp) * 100);
                            return (
                              <div key={category} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                                <div className="flex justify-between font-bold text-slate-800">
                                  <span>{category}</span>
                                  <span className="font-mono text-rose-800 font-bold">
                                    LKR {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({pct}%)
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.round((amount / maxVal) * 100))}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* 2. Dynamic Revenue Streams by Service Package from Real Database */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          Revenue Streams by Service Package
                        </span>
                        <span className="font-mono text-emerald-700 font-bold">
                          Total: LKR {Number(financials.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </h3>

                      <div className="space-y-2">
                        {(() => {
                          // Aggregate real revenue from completed services
                          const serviceRevenueMap = {};
                          const serviceCountMap = {};

                          allServices.forEach(s => {
                            const type = s.serviceType || 'Standard Service';
                            const amt = Number(s.billTotal || s.grandTotal || s.totalAmount || (Number(s.laborCharges || 0) + Number(s.partsTotal || 0))) || 0;
                            serviceRevenueMap[type] = (serviceRevenueMap[type] || 0) + amt;
                            serviceCountMap[type] = (serviceCountMap[type] || 0) + 1;
                          });

                          const entries = Object.entries(serviceRevenueMap).sort((a, b) => b[1] - a[1]);
                          const totalRev = Number(financials.totalRevenue) || entries.reduce((sum, e) => sum + e[1], 0) || 0;
                          const maxVal = Math.max(...entries.map(e => e[1]), 1);

                          if (entries.length === 0) {
                            return (
                              <div className="bg-white p-6 rounded-lg border border-slate-200 text-center space-y-1 text-slate-400">
                                <p className="text-xs font-semibold text-slate-600">No service revenue recorded yet.</p>
                                <p className="text-[11px] text-slate-400">
                                  Completed vehicle services will dynamically display their aggregated revenue and job count here.
                                </p>
                              </div>
                            );
                          }

                          return entries.map(([serviceType, amount]) => {
                            const pct = totalRev > 0 ? Math.round((amount / totalRev) * 100) : 0;
                            const jobCount = serviceCountMap[serviceType] || 0;
                            return (
                              <div key={serviceType} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                                <div className="flex justify-between font-bold text-slate-800">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    {serviceType}
                                    <span className="text-[10px] text-slate-400 font-normal">
                                      ({jobCount} {jobCount === 1 ? 'job' : 'jobs'})
                                    </span>
                                  </span>
                                  <span className="font-mono text-emerald-800 font-bold">
                                    LKR {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({pct}%)
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                                  <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.round((amount / maxVal) * 100))}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* =========================================================================
                      PERIOD FINANCIAL STATEMENT: TOTAL REVENUE & EXPENSES BY DATE / MONTH
                      ========================================================================= */}
                  <div className="border-t-2 border-slate-200 pt-6 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 text-white p-5 rounded-xl shadow-sm">
                      <div>
                        <h3 className="text-base font-black uppercase tracking-wide flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-indigo-400" />
                          Period Financial Report (Revenue & Expenses by Date / Month)
                        </h3>
                      </div>

                      {/* Filter Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Filter Type Pills */}
                        <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex gap-1 text-xs">
                          <button
                            type="button"
                            onClick={() => setReportFilterType('month')}
                            className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${reportFilterType === 'month' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                              }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            By Month
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportFilterType('date')}
                            className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${reportFilterType === 'date' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                              }`}
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            Single Date
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportFilterType('range')}
                            className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${reportFilterType === 'range' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                              }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Date Range
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportFilterType('all')}
                            className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${reportFilterType === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                              }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            All Time
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Date Selector Inputs Bar */}
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {reportFilterType === 'month' && (
                          <div className="flex items-center gap-2">
                            <label className="font-bold text-slate-700 uppercase">Select Month:</label>
                            <input
                              type="month"
                              value={reportMonth}
                              onChange={(e) => setReportMonth(e.target.value)}
                              className="bg-white border-2 border-indigo-400 rounded-lg px-3 py-1.5 font-bold font-mono text-slate-900 outline-none shadow-2xs cursor-pointer"
                            />
                          </div>
                        )}

                        {reportFilterType === 'date' && (
                          <div className="flex items-center gap-2">
                            <label className="font-bold text-slate-700 uppercase">Select Date:</label>
                            <input
                              type="date"
                              value={reportDate}
                              onChange={(e) => setReportDate(e.target.value)}
                              className="bg-white border-2 border-indigo-400 rounded-lg px-3 py-1.5 font-bold font-mono text-slate-900 outline-none shadow-2xs cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => setReportDate(new Date().toISOString().split('T')[0])}
                              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer"
                            >
                              Today
                            </button>
                          </div>
                        )}

                        {reportFilterType === 'range' && (
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="font-bold text-slate-700 uppercase">From:</label>
                            <input
                              type="date"
                              value={reportStartDate}
                              onChange={(e) => setReportStartDate(e.target.value)}
                              className="bg-white border-2 border-indigo-400 rounded-lg px-2.5 py-1.5 font-bold font-mono text-slate-900 outline-none shadow-2xs cursor-pointer"
                            />
                            <label className="font-bold text-slate-700 uppercase">To:</label>
                            <input
                              type="date"
                              value={reportEndDate}
                              onChange={(e) => setReportEndDate(e.target.value)}
                              className="bg-white border-2 border-indigo-400 rounded-lg px-2.5 py-1.5 font-bold font-mono text-slate-900 outline-none shadow-2xs cursor-pointer"
                            />
                          </div>
                        )}

                        {reportFilterType === 'all' && (
                          <span className="font-bold text-indigo-900 bg-white px-3 py-1.5 rounded-lg border border-indigo-200">
                            Showing All Recorded Historical Transactions
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 font-medium">
                        Showing results for: <strong className="text-indigo-900 font-mono font-bold">
                          {reportFilterType === 'month' ? reportMonth : reportFilterType === 'date' ? reportDate : reportFilterType === 'range' ? `${reportStartDate} to ${reportEndDate}` : 'All Time'}
                        </strong>
                      </div>
                    </div>

                    {/* Detailed Itemized Ledger for Selected Period */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Tabs for Ledger */}
                      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-slate-700 uppercase mr-1">Period Records:</span>
                          <button
                            type="button"
                            onClick={() => setReportViewTab('all')}
                            className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${reportViewTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            All ({periodFilteredServices.length + periodFilteredExpenses.length + periodFilteredSupplierPayments.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportViewTab('revenue')}
                            className={`px-3 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${reportViewTab === 'revenue' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800 hover:bg-emerald-50'
                              }`}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Revenue Services ({periodFilteredServices.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportViewTab('expenses')}
                            className={`px-3 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${reportViewTab === 'expenses' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-800 hover:bg-rose-50'
                              }`}
                          >
                            <TrendingDown className="w-3.5 h-3.5" />
                            Expenses ({periodFilteredExpenses.length + periodFilteredSupplierPayments.length})
                          </button>
                        </div>

                        <span className="text-[11px] text-slate-500 font-mono">
                          Period Balance: LKR {Number(periodNetProfit).toLocaleString()}
                        </span>
                      </div>

                      {/* Tables */}
                      <div className="p-4 space-y-4">
                        {/* 1. Services Revenue Table */}
                        {(reportViewTab === 'all' || reportViewTab === 'revenue') && (
                          <div className="space-y-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                Revenue from Customer Vehicle Services ({periodFilteredServices.length})
                              </span>
                              <span className="font-mono text-sm text-emerald-700">
                                Subtotal: LKR {Number(periodRevenueTotal).toLocaleString()}
                              </span>
                            </h4>

                            {periodFilteredServices.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                                No vehicle services recorded on the selected date / period.
                              </div>
                            ) : (
                              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px]">
                                    <tr>
                                      <th className="py-2 px-3">Date</th>
                                      <th className="py-2 px-3">Bill / Inv No</th>
                                      <th className="py-2 px-3">Vehicle No</th>
                                      <th className="py-2 px-3">Customer</th>
                                      <th className="py-2 px-3">Service Package / Job</th>
                                      <th className="py-2 px-3">Method</th>
                                      <th className="py-2 px-3 text-right">Amount (LKR)</th>
                                      <th className="py-2 px-3 text-center">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {periodFilteredServices.map((srv, idx) => (
                                      <tr key={srv._id || srv.id || idx} className="hover:bg-emerald-50/40">
                                        <td className="py-2 px-3 font-mono text-slate-600">{srv.serviceDate}</td>
                                        <td className="py-2 px-3 font-mono font-bold text-blue-700">{srv.invoiceNo || srv.serviceNo}</td>
                                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{srv.vehicleNo}</td>
                                        <td className="py-2 px-3 text-slate-800 font-semibold">{srv.csName || 'Valued Customer'}</td>
                                        <td className="py-2 px-3 text-slate-700">{srv.serviceType}</td>
                                        <td className="py-2 px-3 font-mono text-slate-600">{srv.paymentType || srv.paymentMethod || 'Cash'}</td>
                                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                                          {Number(srv.billTotal || srv.grandTotal || srv.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          <a
                                            href={`/bill/${encodeURIComponent(srv._id || srv.id || srv.invoiceNo)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-2.5 py-1 rounded transition font-bold cursor-pointer inline-flex items-center gap-1"
                                            title="Open and Print Bill in Another Page"
                                          >
                                            <Printer className="w-3 h-3" />
                                            Print Bill
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. Operating Expenses Table */}
                        {(reportViewTab === 'all' || reportViewTab === 'expenses') && (
                          <div className="space-y-2 pt-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <TrendingDown className="w-4 h-4 text-rose-600" />
                                Operating Expenses Paid ({periodFilteredExpenses.length})
                              </span>
                              <span className="font-mono text-sm text-rose-700">
                                Subtotal: LKR {Number(periodOperatingExpensesTotal).toLocaleString()}
                              </span>
                            </h4>

                            {periodFilteredExpenses.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                                No operating expenses recorded on the selected date / period.
                              </div>
                            ) : (
                              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px]">
                                    <tr>
                                      <th className="py-2 px-3">Date</th>
                                      <th className="py-2 px-3">Category</th>
                                      <th className="py-2 px-3">Description</th>
                                      <th className="py-2 px-3">Payee / Vendor</th>
                                      <th className="py-2 px-3">Method</th>
                                      <th className="py-2 px-3 text-right">Amount (LKR)</th>
                                      <th className="py-2 px-3 text-center">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {periodFilteredExpenses.map((exp, idx) => (
                                      <tr key={exp._id || exp.id || idx} className="hover:bg-rose-50/40">
                                        <td className="py-2 px-3 font-mono text-slate-600">{exp.expenseDate}</td>
                                        <td className="py-2 px-3 font-bold text-slate-800">
                                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">{exp.category}</span>
                                        </td>
                                        <td className="py-2 px-3 text-slate-800">{exp.description}</td>
                                        <td className="py-2 px-3 text-slate-600">{exp.payee || '-'}</td>
                                        <td className="py-2 px-3 font-mono text-slate-600">{exp.paymentMethod || 'Cash'}</td>
                                        <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">
                                          {Number(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                            {exp.status || 'Paid'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 3. Supplier Payments Table */}
                        {(reportViewTab === 'all' || reportViewTab === 'expenses') && (
                          <div className="space-y-2 pt-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Truck className="w-4 h-4 text-blue-600" />
                                Supplier Invoice Settlements ({periodFilteredSupplierPayments.length})
                              </span>
                              <span className="font-mono text-sm text-blue-800">
                                Subtotal: LKR {Number(periodSupplierPaymentsTotal).toLocaleString()}
                              </span>
                            </h4>

                            {periodFilteredSupplierPayments.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                                No supplier payments settled on the selected date / period.
                              </div>
                            ) : (
                              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px]">
                                    <tr>
                                      <th className="py-2 px-3">Payment Date</th>
                                      <th className="py-2 px-3">Supplier Name</th>
                                      <th className="py-2 px-3">Invoice No</th>
                                      <th className="py-2 px-3">Method</th>
                                      <th className="py-2 px-3">Cheque / Ref No</th>
                                      <th className="py-2 px-3 text-right">Amount Paid (LKR)</th>
                                      <th className="py-2 px-3 text-center">Cheque Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {periodFilteredSupplierPayments.map((p, idx) => (
                                      <tr key={p.id || idx} className="hover:bg-blue-50/40">
                                        <td className="py-2 px-3 font-mono text-slate-600">{p.paymentDate}</td>
                                        <td className="py-2 px-3 font-bold text-slate-900">{p.supplierName}</td>
                                        <td className="py-2 px-3 font-mono text-blue-700">{p.invoiceNo}</td>
                                        <td className="py-2 px-3 font-mono">{p.method}</td>
                                        <td className="py-2 px-3 font-mono text-slate-600">{p.chequeNo || p.bankRef || '-'}</td>
                                        <td className="py-2 px-3 text-right font-mono font-bold text-blue-800">
                                          {Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                            {p.chequeStatus || 'Cleared'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Item' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Parts, Lubricants & Consumables Catalog ({catalogItems.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Stock on hand, cost & selling prices, barcode scanning, and category mapping. Supports Add, Edit & Delete.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (showItemForm && isEditingItem) {
                    setIsEditingItem(false);
                    setEditingItemId(null);
                    setItemForm(emptyItemForm);
                  }
                  setShowItemForm(!showItemForm);
                }}
                className={`font-bold text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs ${showItemForm
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {showItemForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showItemForm ? 'Close Form' : 'Add New Item / Part'}
              </button>
            </div>

            {/* Collapsible / Expandable Item Add / Edit Form */}
            {showItemForm && (
              <form onSubmit={handleSaveItem} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    {isEditingItem ? <Edit3 className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                    {isEditingItem ? `Edit Item: ${itemForm.itemCode}` : 'Register New Item in Inventory'}
                  </h4>
                  {isEditingItem && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      Editing Mode
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Item Code *</label>
                    <input
                      type="text"
                      value={itemForm.itemCode}
                      onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. OIL-MOBIL-5W30"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold uppercase outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Barcode / Part No</label>
                    <input
                      type="text"
                      value={itemForm.barcode}
                      onChange={(e) => setItemForm({ ...itemForm, barcode: e.target.value })}
                      placeholder="e.g. 890123456789"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Description / Name *</label>
                    <input
                      type="text"
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      placeholder="e.g. Mobil Super 3000 Fully Synthetic 5W-30 4L"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-semibold outline-none"
                    >
                      <option value="Oils & Fluids">Oils & Fluids</option>
                      <option value="Filters">Filters</option>
                      <option value="Brake Components">Brake Components</option>
                      <option value="Batteries">Batteries</option>
                      <option value="Engine Parts">Engine Parts</option>
                      <option value="Accessories">Accessories</option>
                      <option value="General">General Consumables</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quantity on Hand</label>
                    <input
                      type="number"
                      value={itemForm.qtyOnHand}
                      onChange={(e) => setItemForm({ ...itemForm, qtyOnHand: e.target.value })}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cost Price (LKR)</label>
                    <input
                      type="number"
                      value={itemForm.costPrice}
                      onChange={(e) => setItemForm({ ...itemForm, costPrice: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (LKR) *</label>
                    <input
                      type="number"
                      value={itemForm.sellingPrice}
                      onChange={(e) => setItemForm({ ...itemForm, sellingPrice: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    {isEditingItem ? 'Update Item in Catalog' : 'Save Item to Inventory'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setItemForm(emptyItemForm);
                      setIsEditingItem(false);
                      setEditingItemId(null);
                      setShowItemForm(false);
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Inventory Table with Edit & Delete Actions */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Item Code</th>
                    <th className="py-2.5 px-3">Barcode</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty on Hand</th>
                    <th className="py-2.5 px-3 text-right">Cost Price (LKR)</th>
                    <th className="py-2.5 px-3 text-right">Selling Price (LKR)</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {catalogItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400">
                        No parts or catalog items registered yet. Click "Add New Item / Part" above to register stock.
                      </td>
                    </tr>
                  ) : (
                    catalogItems.map((item, itemIdx) => {
                      const rowKey = item.id || item._id || item.itemCode;
                      const isRowEditing = editingItemRowId === rowKey;
                      if (isRowEditing) {
                        return (
                          <tr key={`${rowKey}-${itemIdx}`} className="bg-amber-50/70">
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={editingItemRowData.itemCode}
                                onChange={(e) => setEditingItemRowData({ ...editingItemRowData, itemCode: e.target.value.toUpperCase() })}
                                className="w-24 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] font-bold"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={editingItemRowData.barcode}
                                onChange={(e) => setEditingItemRowData({ ...editingItemRowData, barcode: e.target.value })}
                                className="w-24 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px]"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={editingItemRowData.description}
                                onChange={(e) => setEditingItemRowData({ ...editingItemRowData, description: e.target.value })}
                                className="w-full min-w-[140px] bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px] font-semibold"
                              />
                            </td>
                            <td className="p-1.5">
                              <select
                                value={editingItemRowData.category}
                                onChange={(e) => setEditingItemRowData({ ...editingItemRowData, category: e.target.value })}
                                className="bg-white border border-slate-300 rounded px-1.5 py-1 text-[11px]"
                              >
                                <option value="Oils & Fluids">Oils & Fluids</option>
                                <option value="Filters">Filters</option>
                                <option value="Brake Components">Brake Components</option>
                                <option value="Batteries">Batteries</option>
                                <option value="Engine Parts">Engine Parts</option>
                                <option value="Accessories">Accessories</option>
                                <option value="General">General</option>
                              </select>
                            </td>
                            <td className="p-1.5">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  value={editingItemRowData.qtyOnHand}
                                  onChange={(e) => setEditingItemRowData({ ...editingItemRowData, qtyOnHand: e.target.value })}
                                  className="w-16 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] text-center font-bold"
                                />
                                <select
                                  value={editingItemRowData.stockUnit}
                                  onChange={(e) => setEditingItemRowData({ ...editingItemRowData, stockUnit: e.target.value })}
                                  className="bg-white border border-slate-300 rounded px-1 py-1 text-[10px]"
                                >
                                  <option value="Bottles">Bottles</option>
                                  <option value="Barrels">Barrels</option>
                                  <option value="Liters (L)">Liters (L)</option>
                                  <option value="Milliliters (ml)">Milliliters (ml)</option>
                                  <option value="Pieces">Pieces</option>
                                  <option value="Packs">Packs</option>
                                  <option value="Cans">Cans</option>
                                  <option value="Kg">Kg</option>
                                  <option value="Meters">Meters</option>
                                  <option value="Units">Units</option>
                                </select>
                              </div>
                            </td>
                            <td className="p-1.5">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingItemRowData.costPrice}
                                onChange={(e) => setEditingItemRowData({ ...editingItemRowData, costPrice: e.target.value })}
                                className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] text-right"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingItemRowData.sellingPrice}
                                onChange={(e) => setEditingItemRowData({ ...editingItemRowData, sellingPrice: e.target.value })}
                                className="w-20 bg-white border border-slate-300 rounded px-1.5 py-1 font-mono text-[11px] text-right font-bold"
                              />
                            </td>
                            <td className="p-1.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveInlineItemEdit(rowKey)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[11px] cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelInlineItemEdit}
                                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded text-[11px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={`${rowKey}-${itemIdx}`} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{item.itemCode}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{item.barcode || '-'}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{item.description}</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                            {item.qtyOnHand} {item.stockUnit || ''}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                            {Number(item.costPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {Number(item.sellingPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartInlineItemEdit(item)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id || item._id || item.itemCode, item.description)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded text-xs transition flex items-center gap-1 cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          PRINTABLE CUSTOMER SERVICE BILL / INVOICE MODAL
          ========================================================================= */}
      {invoiceRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Customer Service Bill & Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  Print Customer Bill
                </button>
                <button onClick={() => setInvoiceRecord(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper */}
            <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 text-slate-800 bg-white">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  AUTO CARE SERVICE CENTER
                </h2>
                <p className="text-xs font-bold text-slate-700 tracking-wide mt-0.5">
                  Business Registration No: <span className="font-mono font-black text-slate-900">7/3594</span>
                </p>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  No 146, Deniyaya Road, Akuressa, Sri Lanka
                </p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  Tel: +94 412283131 / +94 704909320 | Email: lakshanwasindu@gmail.com
                </p>
              </div>

              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="mb-1"><strong className="text-slate-600">Invoice / Job No:</strong> <span className="font-mono font-bold text-slate-900">{invoiceRecord.invoiceNo || invoiceRecord.serviceNo}</span></p>
                  <p className="mb-1"><strong className="text-slate-600">Vehicle Number:</strong> <span className="font-mono font-black text-blue-800 text-sm">{invoiceRecord.vehicleNo}</span></p>
                  <p className="mb-1"><strong className="text-slate-600">Customer Name:</strong> <span className="font-bold">{invoiceRecord.csName || 'Valued Customer'}</span></p>
                  <p><strong className="text-slate-600">Odometer Reading:</strong> <span className="font-mono font-bold">{(invoiceRecord.meterReading || invoiceRecord.odometer)?.toLocaleString()} KM</span></p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                  <p className="mb-1"><strong className="text-slate-600">Date:</strong> <span className="font-mono">{invoiceRecord.serviceDate}</span></p>
                  <p className="mb-1"><strong className="text-slate-600">Service Category:</strong> <span className="font-bold text-slate-900">{invoiceRecord.serviceType}</span></p>
                  <p className="mb-1"><strong className="text-slate-600">Payment Method:</strong> <span className="font-bold uppercase text-emerald-700">{invoiceRecord.paymentType || 'CASH'}</span></p>
                  <p><strong className="text-slate-600">Lead Technician:</strong> {invoiceRecord.technician || 'Staff'}</p>
                </div>
              </div>

              {/* Work Checklist Performed */}
              {invoiceRecord.checklist && invoiceRecord.checklist.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                    Inspection & Maintenance Performed:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                    {invoiceRecord.checklist.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Replaced Parts & Supplies Table */}
              {((invoiceRecord.parts && invoiceRecord.parts.length > 0) || (invoiceRecord.items && invoiceRecord.items.length > 0)) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                    Parts & Consumables Replaced:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border border-slate-300">
                      <thead className="bg-slate-100 border-b border-slate-300">
                        <tr>
                          <th className="p-2 font-bold text-slate-800">Description & Part Code</th>
                          <th className="p-2 text-center font-bold text-slate-800">Qty</th>
                          <th className="p-2 text-right font-bold text-slate-800">Unit Price (LKR)</th>
                          <th className="p-2 text-right font-bold text-slate-800">Amount (LKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(invoiceRecord.parts || invoiceRecord.items.filter(i => i.itemType === 'item')).map((p, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium">
                              {p.name || p.description}
                              {p.code && <span className="block text-[10px] text-slate-400 font-mono">{p.code}</span>}
                            </td>
                            <td className="p-2 text-center font-mono font-bold">{p.quantity || p.qty}</td>
                            <td className="p-2 text-right font-mono">{Number(p.unitPrice || p.rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 text-right font-mono font-bold">{Number(p.total || p.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bill Totals Summary */}
              <div className="border-t-2 border-slate-900 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">{invoiceRecord.serviceType} Base Labor Fee:</span>
                  <span className="font-mono font-bold">LKR {Number(invoiceRecord.jobTotal || invoiceRecord.laborCharges || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Used Items & Consumables Subtotal:</span>
                  <span className="font-mono font-bold">
                    LKR {Number(invoiceRecord.partsTotal || (invoiceRecord.parts ? invoiceRecord.parts.reduce((s, p) => s + (p.total || 0), 0) : 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {Number(invoiceRecord.totalDis || invoiceRecord.discount || 0) > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span className="font-semibold">Discount:</span>
                    <span className="font-mono font-bold">- LKR {Number(invoiceRecord.totalDis || invoiceRecord.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black border-t-2 border-slate-900 pt-2 text-slate-900">
                  <span className="uppercase">Grand Total Bill Amount:</span>
                  <span className="font-mono text-xl text-blue-800">
                    LKR {Number(invoiceRecord.billTotal || invoiceRecord.grandTotal || invoiceRecord.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Next Service Due Box */}
              {(invoiceRecord.nextServiceMeter || invoiceRecord.nextServiceMileage || invoiceRecord.nextServiceDate) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex justify-between items-center">
                  <span><strong>Next Service Due Recommendation:</strong></span>
                  <span className="font-bold text-sm">
                    {(invoiceRecord.nextServiceMeter || invoiceRecord.nextServiceMileage) ? `${(invoiceRecord.nextServiceMeter || invoiceRecord.nextServiceMileage).toLocaleString()} KM` : ''}
                    {invoiceRecord.nextServiceDate ? ` (on or before ${invoiceRecord.nextServiceDate})` : ''}
                  </span>
                </div>
              )}

              {/* Signature Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 text-center text-xs text-slate-600">
                <div>
                  <div className="border-t border-slate-400 w-44 mx-auto mb-1"></div>
                  <span>Customer Signature</span>
                </div>
                <div>
                  <div className="border-t border-slate-400 w-44 mx-auto mb-1"></div>
                  <span>Authorized Signature & Seal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUPPLIER PAYMENT RECORDING MODAL
          ========================================================================= */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">
                  Record Payment for {payingInvoice.supplierName}
                </h3>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSupplierPayment} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice No:</span>
                  <span className="font-mono font-bold text-slate-800">{payingInvoice.invoiceNo} (ID: {payingInvoice.invoiceId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Amount:</span>
                  <span className="font-mono font-semibold">LKR {Number(payingInvoice.invoiceAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Balance Due:</span>
                  <span className="font-mono font-black text-rose-700">LKR {Number(payingInvoice.balance).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Amount (LKR) *</label>
                  <input
                    type="number"
                    value={paymentFormData.amount}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Date *</label>
                  <input
                    type="date"
                    value={paymentFormData.paymentDate}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <div className="flex flex-wrap gap-2">
                  {['Cheque', 'Cash', 'Bank Transfer'].map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentFormData({ ...paymentFormData, method: m })}
                      className={`flex-1 py-1.5 rounded font-bold border transition ${paymentFormData.method === m
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300'
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {paymentFormData.method === 'Cheque' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cheque Number</label>
                    <input
                      type="text"
                      value={paymentFormData.chequeNo}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, chequeNo: e.target.value })}
                      placeholder="e.g. CHQ-209841"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 font-mono text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cheque Issue Date</label>
                    <input
                      type="date"
                      value={paymentFormData.chequeIssueDate}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, chequeIssueDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cheque Status</label>
                    <select
                      value={paymentFormData.chequeStatus}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, chequeStatus: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 outline-none"
                    >
                      <option value="Issued">Issued</option>
                      <option value="Cleared">Cleared</option>
                      <option value="Bounced">Bounced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bank Account</label>
                    <input
                      type="text"
                      value={paymentFormData.bankAccount}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, bankAccount: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded text-xs shadow transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD SUPPLIER PARTS TO AN ALREADY-LOGGED SERVICE VISIT IN HISTORY
          ========================================================================= */}
      {serviceToAppendParts && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">
                  Add Parts to Service #{serviceToAppendParts.invoiceNo} ({serviceToAppendParts.vehicleNo})
                </h3>
              </div>
              <button
                onClick={() => setServiceToAppendParts(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-slate-900">{serviceToAppendParts.vehicleNo} ({serviceToAppendParts.csName})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Date:</span>
                  <span className="font-mono">{serviceToAppendParts.serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Grand Total:</span>
                  <span className="font-mono font-bold text-blue-700">LKR {Number(serviceToAppendParts.grandTotal || serviceToAppendParts.billTotal || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Filter by supplier */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Filter by Supplier:</label>
                <select
                  value={appendPartSupplierFilter}
                  onChange={(e) => setAppendPartSupplierFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800 outline-none"
                >
                  <option value="ALL">All Suppliers ({catalogItems.length} items)</option>
                  {suppliers.map(s => (
                    <option key={s.id || s._id} value={s.supplierName}>
                      {s.supplierName} ({catalogItems.filter(i => i.supplierName === s.supplierName).length} items)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Supplier Item / Part *</label>
                <select
                  value={appendPartSelectedCode}
                  onChange={(e) => setAppendPartSelectedCode(e.target.value)}
                  className="w-full bg-white border border-blue-400 rounded-lg px-3 py-2 font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose part to add to this service --</option>
                  {catalogItems
                    .filter(item => appendPartSupplierFilter === 'ALL' || item.supplierName === appendPartSupplierFilter)
                    .map((item, itemIdx) => (
                      <option key={item.id || item._id || `${item.itemCode}-${itemIdx}`} value={item.id || item._id || item.itemCode}>
                        {item.supplierName ? `[${item.supplierName}] ` : '[General] '}
                        {item.description} ({item.itemCode}) — LKR {Number(item.sellingPrice || 0).toLocaleString()} (Stock: {item.qtyOnHand || 0})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={appendPartQty}
                  onChange={(e) => setAppendPartQty(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-900 text-center outline-none"
                />
              </div>

              {appendPartSelectedCode && (() => {
                const sel = catalogItems.find(
                  i => i.id === appendPartSelectedCode || i._id === appendPartSelectedCode || i.itemCode === appendPartSelectedCode
                );
                if (!sel) return null;
                const cost = (Number(appendPartQty) || 1) * (Number(sel.sellingPrice) || 0);
                return (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex justify-between items-center text-xs">
                    <span className="text-blue-900 font-bold">Added to Bill:</span>
                    <span className="font-mono font-black text-blue-800 text-sm">
                      + LKR {cost.toLocaleString()}
                    </span>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setServiceToAppendParts(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPartToExistingService(serviceToAppendParts)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Confirm & Update Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lookup Manager Modal (City / Status / Colour) */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm capitalize">Manage {modalType}</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={modalNewItem}
                onChange={(e) => setModalNewItem(e.target.value)}
                placeholder={`New ${modalType}...`}
                className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none"
              />
              <button
                onClick={() => {
                  if (!modalNewItem.trim()) return;
                  if (modalType === 'city') setCities([...cities, modalNewItem.trim()]);
                  if (modalType === 'status') setStatuses([...statuses, modalNewItem.trim()]);
                  if (modalType === 'colour') setColours([...colours, modalNewItem.trim()]);
                  setModalType(null);
                  showNotification(`Added ${modalNewItem}`);
                }}
                className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          DATABASE CONNECTION LINK MODAL (WHERE TO ADD DB LINK)
          ========================================================================= */}
      {showDbConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">MongoDB Database Configuration</h3>
                  <p className="text-[11px] text-slate-400">Connect to your live cloud (Atlas) or local database</p>
                </div>
              </div>
              <button onClick={() => setShowDbConfigModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDbUri} className="p-6 space-y-4 text-xs">
              {/* Current Connection Status Indicator */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${dbStatus.connected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <div>
                    <span className="font-bold block text-xs">
                      {dbStatus.connected ? 'Connected to MongoDB' : 'No Active Database Connection'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-600">
                      {dbStatus.connected
                        ? `DB: ${dbStatus.name || 'service_center_db'} | Host: ${dbStatus.host || 'remote'}`
                        : 'Using clean in-memory standby mode until DB link is provided'}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${dbStatus.connected ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                  }`}>
                  {dbStatus.connected ? 'ONLINE' : 'STANDBY'}
                </span>
              </div>

              {/* DB URI Input */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 text-xs">
                  MongoDB Connection String (URI):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dbConfigUri}
                    onChange={(e) => setDbConfigUri(e.target.value)}
                    placeholder="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/service_center_db?retryWrites=true&w=majority"
                    className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-lg px-3 py-2.5 font-mono text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  You can paste your <strong>MongoDB Atlas</strong> cloud URI or <strong>Local MongoDB</strong> URI here.
                </p>
              </div>

              {/* Quick Fill Helpers */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDbConfigUri('mongodb://127.0.0.1:27017/service_center_db')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition"
                >
                  Fill Local: mongodb://127.0.0.1:27017/service_center_db
                </button>
                <button
                  type="button"
                  onClick={() => setDbConfigUri('')}
                  className="bg-slate-100 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded text-[11px] font-semibold transition"
                >
                  Clear Field
                </button>
              </div>

              {/* Guide on where to add DB Link in files */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Two Ways to Add Your Database Link:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] pl-1">
                  <li>
                    <strong className="text-slate-800">Directly in this web app:</strong> Paste your connection string above and click <em>"Save & Connect Database"</em>. It will test the connection and save it automatically into <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">.env.local</code>.
                  </li>
                  <li>
                    <strong className="text-slate-800">In your project files:</strong> Open the file <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">.env.local</code> in the root folder and set:
                    <div className="mt-1 bg-slate-900 text-emerald-400 p-2 rounded font-mono text-[10px] overflow-x-auto">
                      MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abcde.mongodb.net/service_center_db?retryWrites=true&amp;w=majority
                    </div>
                  </li>
                </ol>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowDbConfigModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dbSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
                >
                  {dbSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Testing & Connecting...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save & Connect Database
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
