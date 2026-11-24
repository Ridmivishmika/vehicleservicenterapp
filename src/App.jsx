import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Hash, 
  Search, 
  Plus, 
  Save, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Wrench,
  Download,
  Filter,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';

// Initial preloaded data for immediate demonstration
const INITIAL_VEHICLES = [
  {
    id: '1',
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
    createdDate: '2026-11-20'
  },
  {
    id: '2',
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
    createdDate: '2026-11-21'
  },
  {
    id: '3',
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
    createdDate: '2026-11-22'
  },
  {
    id: '4',
    rNo: 'R-004',
    vehicleNo: 'WP KX-9014',
    tagNo: 'TAG-104',
    csName: 'Dilshan Silva',
    address: '24 Beach Road, Negombo',
    mobileTel: '075-9988776',
    homeTel: '',
    officeTel: '031-2233990',
    city: 'Negombo',
    csStatus: 'Corporate',
    vType: 'Car',
    vModel: 'Nissan Leaf',
    colour: 'Deep Blue',
    engineNo: 'EM57-891234',
    chassisNo: 'ZE1-0498213',
    birthDay: '1988-09-30',
    deliveryDate: '2026-11-28',
    createdDate: '2026-11-23'
  }
];

const INITIAL_CITIES = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Maharagama', 'Gampaha', 'Kurunegala', 'Kalutara'];
const INITIAL_STATUSES = ['Regular', 'VIP', 'Corporate', 'New Customer', 'Priority'];
const INITIAL_TYPES = ['Car', 'SUV', 'Van', 'Motorcycle', 'Lorry', 'Cab / Pickup', 'Bus', 'Three-Wheeler'];
const INITIAL_MODELS = ['Toyota Prius', 'Toyota Axio', 'Toyota Corolla', 'Toyota KDH', 'Honda Vezel', 'Honda Civic', 'Honda Fit', 'Nissan Leaf', 'Nissan X-Trail', 'Suzuki Swift', 'Mitsubishi Montero'];
const INITIAL_COLOURS = ['Pearl White', 'Metallic Black', 'Silver', 'Deep Blue', 'Crimson Red', 'Gunmetal Grey', 'Golden Bronze', 'Beige'];

export default function App() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState('Cs/Vehicle');

  // Master Data collections with LocalStorage
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('sc_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('sc_cities');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [statuses, setStatuses] = useState(() => {
    const saved = localStorage.getItem('sc_statuses');
    return saved ? JSON.parse(saved) : INITIAL_STATUSES;
  });

  const [colours, setColours] = useState(() => {
    const saved = localStorage.getItem('sc_colours');
    return saved ? JSON.parse(saved) : INITIAL_COLOURS;
  });

  const [types] = useState(INITIAL_TYPES);
  const [models] = useState(INITIAL_MODELS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sc_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('sc_cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem('sc_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('sc_colours', JSON.stringify(colours));
  }, [colours]);

  // Form State
  const emptyForm = {
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
    city: 'Colombo',
    csStatus: 'Regular',
    vType: 'Car',
    vModel: 'Toyota Prius',
    colour: 'Pearl White',
    engineNo: '',
    chassisNo: '',
    birthDay: '',
    deliveryDate: ''
  };

  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Dropdown Manager Modal State
  const [modalType, setModalType] = useState(null); // 'city' | 'status' | 'colour'
  const [modalNewItem, setModalNewItem] = useState('');

  // Filter/Search Bar States (matches the bottom search section in the picture)
  const [filters, setFilters] = useState({
    vehicleNumber: '',
    tagNumber: '',
    csName: '',
    city: '',
    vehicleModel: '',
    deliveryDate: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Generate next R/No
  const getNextRNo = () => {
    const maxNumber = vehicles.reduce((max, v) => {
      const match = v.rNo.match(/\d+/);
      const num = match ? parseInt(match[0], 10) : 0;
      return num > max ? num : max;
    }, 0);
    return `R-${String(maxNumber + 1).padStart(3, '0')}`;
  };

  // Populate form when vehicle is selected in dropdown
  const handleSelectVehicleDropdown = (vehNo) => {
    if (!vehNo) {
      handleClearForm();
      return;
    }
    const found = vehicles.find(v => v.vehicleNo.toLowerCase() === vehNo.toLowerCase());
    if (found) {
      setFormData({
        ...found,
        editVehicleNo: found.vehicleNo
      });
      setIsEditing(true);
      showNotification(`Loaded vehicle ${found.vehicleNo}`);
    }
  };

  // Quick edit vehicle number update button (matches the "Edit Vehicle No" -> [Update] button)
  const handleQuickUpdateVehicleNo = () => {
    if (!formData.editVehicleNo?.trim()) {
      showNotification('Please enter a vehicle number to edit', 'error');
      return;
    }
    if (!isEditing || !formData.id) {
      setFormData(prev => ({ ...prev, vehicleNo: prev.editVehicleNo.trim().toUpperCase() }));
      showNotification('Vehicle number set in form');
      return;
    }
    const updatedVehNo = formData.editVehicleNo.trim().toUpperCase();
    const updated = vehicles.map(v => 
      v.id === formData.id ? { ...v, vehicleNo: updatedVehNo } : v
    );
    setVehicles(updated);
    setFormData(prev => ({ ...prev, vehicleNo: updatedVehNo }));
    showNotification(`Vehicle number updated to ${updatedVehNo}`);
  };

  // Handle Form Input Changes
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'vehicleNo') {
        updated.editVehicleNo = value;
      }
      return updated;
    });
  };

  // Handle Save (Add new vehicle)
  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!formData.vehicleNo.trim()) {
      showNotification('Vehicle Number is required!', 'error');
      return;
    }
    if (!formData.csName.trim()) {
      showNotification('Customer Name is required!', 'error');
      return;
    }

    const existing = vehicles.find(v => 
      v.vehicleNo.trim().toLowerCase() === formData.vehicleNo.trim().toLowerCase() && v.id !== formData.id
    );
    if (existing) {
      showNotification(`Vehicle ${formData.vehicleNo} already exists! Use Update instead.`, 'error');
      return;
    }

    const newVehicle = {
      ...formData,
      id: Date.now().toString(),
      rNo: formData.rNo || getNextRNo(),
      vehicleNo: formData.vehicleNo.trim().toUpperCase(),
      editVehicleNo: formData.vehicleNo.trim().toUpperCase(),
      tagNo: formData.tagNo.trim() || `TAG-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setVehicles([newVehicle, ...vehicles]);
    setFormData(newVehicle);
    setIsEditing(true);
    showNotification(`Vehicle ${newVehicle.vehicleNo} registered successfully!`);
  };

  // Handle Update existing vehicle
  const handleUpdate = () => {
    if (!isEditing || !formData.id) {
      showNotification('Please select an existing vehicle to update, or click Save to register new.', 'error');
      return;
    }
    if (!formData.vehicleNo.trim()) {
      showNotification('Vehicle Number is required!', 'error');
      return;
    }

    const updatedList = vehicles.map(v => 
      v.id === formData.id ? { 
        ...formData, 
        vehicleNo: formData.vehicleNo.trim().toUpperCase(),
        editVehicleNo: formData.vehicleNo.trim().toUpperCase() 
      } : v
    );

    setVehicles(updatedList);
    showNotification(`Record ${formData.vehicleNo} successfully updated!`);
  };

  // Handle Delete vehicle
  const handleDelete = () => {
    if (!isEditing || !formData.id) {
      showNotification('No vehicle currently selected to delete.', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to delete vehicle ${formData.vehicleNo}?`)) {
      setVehicles(vehicles.filter(v => v.id !== formData.id));
      showNotification(`Vehicle ${formData.vehicleNo} deleted.`);
      handleClearForm();
    }
  };

  // Clear Form
  const handleClearForm = () => {
    setFormData({
      ...emptyForm,
      rNo: getNextRNo(),
      city: cities[0] || 'Colombo',
      csStatus: statuses[0] || 'Regular',
      vType: types[0] || 'Car',
      vModel: models[0] || 'Toyota Prius',
      colour: colours[0] || 'Pearl White'
    });
    setIsEditing(false);
  };

  // Load a record from table into form
  const handleLoadRecord = (record) => {
    setFormData({
      ...record,
      editVehicleNo: record.vehicleNo
    });
    setIsEditing(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
    showNotification(`Editing ${record.vehicleNo}`);
  };

  // Filtered vehicles for table
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchVehNo = filters.vehicleNumber 
        ? v.vehicleNo.toLowerCase().includes(filters.vehicleNumber.toLowerCase())
        : true;
      const matchTag = filters.tagNumber
        ? v.tagNo.toLowerCase().includes(filters.tagNumber.toLowerCase())
        : true;
      const matchCsName = filters.csName
        ? v.csName.toLowerCase().includes(filters.csName.toLowerCase())
        : true;
      const matchCity = filters.city
        ? v.city.toLowerCase().includes(filters.city.toLowerCase())
        : true;
      const matchModel = filters.vehicleModel
        ? v.vModel.toLowerCase().includes(filters.vehicleModel.toLowerCase())
        : true;
      const matchDelivery = filters.deliveryDate
        ? v.deliveryDate === filters.deliveryDate
        : true;

      return matchVehNo && matchTag && matchCsName && matchCity && matchModel && matchDelivery;
    });
  }, [vehicles, filters]);

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      vehicleNumber: '',
      tagNumber: '',
      csName: '',
      city: '',
      vehicleModel: '',
      deliveryDate: ''
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['R/No', 'Vehicle Number', 'Tag Number', 'Customer Name', 'Address', 'Mobile', 'City', 'Status', 'Type', 'Model', 'Colour', 'Engine No', 'Chassis No', 'Birthday', 'Delivery Date'];
    const rows = filteredVehicles.map(v => [
      v.rNo,
      v.vehicleNo,
      v.tagNo,
      `"${v.csName}"`,
      `"${v.address}"`,
      v.mobileTel,
      v.city,
      v.csStatus,
      v.vType,
      v.vModel,
      v.colour,
      v.engineNo,
      v.chassisNo,
      v.birthDay,
      v.deliveryDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vehicles_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('CSV exported successfully!');
  };

  // Dropdown Manager helpers (Update & Delete buttons beside City, Status, Colour)
  const openModal = (type) => {
    setModalType(type);
    setModalNewItem('');
  };

  const handleAddLookup = () => {
    if (!modalNewItem.trim()) return;
    const trimmed = modalNewItem.trim();
    if (modalType === 'city') {
      if (!cities.includes(trimmed)) {
        setCities([...cities, trimmed]);
        setFormData(prev => ({ ...prev, city: trimmed }));
      }
    } else if (modalType === 'status') {
      if (!statuses.includes(trimmed)) {
        setStatuses([...statuses, trimmed]);
        setFormData(prev => ({ ...prev, csStatus: trimmed }));
      }
    } else if (modalType === 'colour') {
      if (!colours.includes(trimmed)) {
        setColours([...colours, trimmed]);
        setFormData(prev => ({ ...prev, colour: trimmed }));
      }
    }
    setModalType(null);
    showNotification(`New ${modalType} added: ${trimmed}`);
  };

  const handleDeleteCurrentLookup = (type) => {
    if (type === 'city') {
      const current = formData.city;
      if (cities.length <= 1) {
        showNotification('Cannot delete all cities.', 'error');
        return;
      }
      if (window.confirm(`Delete city "${current}" from options?`)) {
        const remaining = cities.filter(c => c !== current);
        setCities(remaining);
        setFormData(prev => ({ ...prev, city: remaining[0] }));
        showNotification(`Deleted city ${current}`);
      }
    } else if (type === 'status') {
      const current = formData.csStatus;
      if (statuses.length <= 1) {
        showNotification('Cannot delete all status options.', 'error');
        return;
      }
      if (window.confirm(`Delete status "${current}" from options?`)) {
        const remaining = statuses.filter(s => s !== current);
        setStatuses(remaining);
        setFormData(prev => ({ ...prev, csStatus: remaining[0] }));
        showNotification(`Deleted status ${current}`);
      }
    } else if (type === 'colour') {
      const current = formData.colour;
      if (colours.length <= 1) {
        showNotification('Cannot delete all colours.', 'error');
        return;
      }
      if (window.confirm(`Delete colour "${current}" from options?`)) {
        const remaining = colours.filter(c => c !== current);
        setColours(remaining);
        setFormData(prev => ({ ...prev, colour: remaining[0] }));
        showNotification(`Deleted colour ${current}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Top Application Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VIAN TECH SERVICE CENTER
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium px-2 py-0.5 rounded">
                  v2.0 Web Edition
                </span>
              </h1>
              <p className="text-xs text-slate-400">Automotive Service Management & Vehicle Records</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block">Total Registered</span>
              <span className="font-bold text-white text-base">{vehicles.length} Vehicles</span>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block">System Mode</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Online & Synced
              </span>
            </div>
          </div>
        </div>

        {/* Reference Navigation Tabs - Exactly matching top bar of reference UI */}
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 flex overflow-x-auto scrollbar-none">
          {['Item', 'Supplier', 'Cs/Vehicle', 'Job', 'Expen/Group', 'Expenses'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                {tab === 'Cs/Vehicle' && <Car className="w-4 h-4" />}
                {tab}
                {tab === 'Cs/Vehicle' && (
                  <span className="ml-1 text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    {vehicles.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium transition-all transform animate-bounce ${
            notification.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-900/30'
              : 'bg-emerald-600 text-white shadow-emerald-900/30'
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
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Tab non-active placeholder alert if other tabs clicked */}
        {activeTab !== 'Cs/Vehicle' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>
                You are previewing tab <strong>"{activeTab}"</strong>. Currently, the vehicle registration module (<strong>Cs/Vehicle</strong>) is fully active and ready.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('Cs/Vehicle')}
              className="text-xs font-semibold bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-700 transition"
            >
              Switch back to Cs/Vehicle
            </button>
          </div>
        )}

        {/* Main Reference Window Box (Modeled after REFERENCE window in image) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Window Title Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs tracking-wider uppercase text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                REFERENCE - Customer & Vehicle Management (Cs/Vehicle)
              </span>
              {isEditing ? (
                <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                  Editing: {formData.vehicleNo} ({formData.rNo})
                </span>
              ) : (
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  New Registration Mode ({formData.rNo || getNextRNo()})
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleClearForm}
                className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-2.5 py-1 rounded transition flex items-center gap-1"
                title="Reset form for new vehicle"
              >
                <Plus className="w-3.5 h-3.5" />
                New Record
              </button>
            </div>
          </div>

          {/* Form Body - Faithfully reproducing the fields from the desktop screenshot */}
          <div className="p-6 bg-slate-50/50">
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Row 1: Vehicle No dropdown / selector + Edit Vehicle No with Update button */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-slate-500" />
                  Vehicle No
                </label>
                <div className="md:col-span-4">
                  <select
                    value={formData.vehicleNo}
                    onChange={(e) => handleSelectVehicleDropdown(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                  >
                    <option value="">-- Select Existing Vehicle or Enter Below --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.vehicleNo}>
                        {v.vehicleNo} ({v.csName} - {v.vModel})
                      </option>
                    ))}
                  </select>
                </div>

                <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide md:text-right">
                  Edit Vehicle No
                </label>
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={formData.editVehicleNo || formData.vehicleNo}
                    onChange={(e) => handleInputChange('editVehicleNo', e.target.value)}
                    placeholder="e.g. WP CAB-1234"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    type="button"
                    onClick={handleQuickUpdateVehicleNo}
                    className="w-full bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 text-xs font-bold py-2 rounded shadow-xs transition"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Row 2: Customer Name (Cs Name) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  Cs Name
                </label>
                <div className="md:col-span-10">
                  <input
                    type="text"
                    value={formData.csName}
                    onChange={(e) => handleInputChange('csName', e.target.value)}
                    placeholder="Full Customer Name"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
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
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Residential / Business Address"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Mobile/Tel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  Mobile/Tel
                </label>
                <div className="md:col-span-10">
                  <input
                    type="text"
                    value={formData.mobileTel}
                    onChange={(e) => handleInputChange('mobileTel', e.target.value)}
                    placeholder="Primary Mobile Number (e.g. 077-1234567)"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
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
                    value={formData.homeTel}
                    onChange={(e) => handleInputChange('homeTel', e.target.value)}
                    placeholder="Home Landline (e.g. 011-2345678)"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                  />
                </div>
                <label className="md:col-span-2 text-xs font-bold text-slate-700 uppercase tracking-wide md:text-right">
                  Office
                </label>
                <div className="md:col-span-4">
                  <input
                    type="text"
                    value={formData.officeTel}
                    onChange={(e) => handleInputChange('officeTel', e.target.value)}
                    placeholder="Office Phone Number"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                  />
                </div>
              </div>

              {/* Middle Section: Two Columns (Left: City, Status, Type, Model, Colour; Right: Engine, Chassis, Birthday, Actions) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-3">
                  {/* City */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-3 text-xs font-bold text-slate-700 uppercase">
                      City
                    </label>
                    <div className="col-span-5">
                      <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {cities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => openModal('city')}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                        title="Add / Update Cities"
                      >
                        Update
                      </button>
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteCurrentLookup('city')}
                        className="w-full bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                        title="Delete selected City"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Cs status */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-3 text-xs font-bold text-slate-700 uppercase">
                      Cs status
                    </label>
                    <div className="col-span-5">
                      <select
                        value={formData.csStatus}
                        onChange={(e) => handleInputChange('csStatus', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => openModal('status')}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                      >
                        Update
                      </button>
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteCurrentLookup('status')}
                        className="w-full bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* V/Type */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-3 text-xs font-bold text-slate-700 uppercase">
                      V/Type
                    </label>
                    <div className="col-span-9">
                      <select
                        value={formData.vType}
                        onChange={(e) => handleInputChange('vType', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {types.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* V/Model */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-3 text-xs font-bold text-slate-700 uppercase">
                      V/Model
                    </label>
                    <div className="col-span-9">
                      <input
                        list="models-list"
                        type="text"
                        value={formData.vModel}
                        onChange={(e) => handleInputChange('vModel', e.target.value)}
                        placeholder="Select or enter vehicle model"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <datalist id="models-list">
                        {models.map(m => (
                          <option key={m} value={m} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Colour */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-3 text-xs font-bold text-slate-700 uppercase">
                      Colour
                    </label>
                    <div className="col-span-5">
                      <select
                        value={formData.colour}
                        onChange={(e) => handleInputChange('colour', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {colours.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => openModal('colour')}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                      >
                        Update
                      </button>
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteCurrentLookup('colour')}
                        className="w-full bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold py-1.5 rounded border border-slate-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Extra Tag No / RNo display */}
                  <div className="grid grid-cols-12 gap-2 items-center pt-1">
                    <label className="col-span-3 text-xs font-bold text-slate-500 uppercase">
                      Tag No
                    </label>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={formData.tagNo}
                        onChange={(e) => handleInputChange('tagNo', e.target.value)}
                        placeholder="e.g. TAG-101"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-sm text-slate-700 outline-none font-mono"
                      />
                    </div>
                    <label className="col-span-2 text-xs font-bold text-slate-500 uppercase text-right">
                      Delivery
                    </label>
                    <div className="col-span-3">
                      <input
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Engine Number, Chassis Number, BirthDay, Action Buttons */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    {/* Engine Number */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <label className="col-span-5 text-xs font-bold text-slate-700 uppercase">
                        Engine Number
                      </label>
                      <div className="col-span-7">
                        <input
                          type="text"
                          value={formData.engineNo}
                          onChange={(e) => handleInputChange('engineNo', e.target.value)}
                          placeholder="e.g. 2ZR-FXE-123456"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Chassis Number */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <label className="col-span-5 text-xs font-bold text-slate-700 uppercase">
                        Chassis Number
                      </label>
                      <div className="col-span-7">
                        <input
                          type="text"
                          value={formData.chassisNo}
                          onChange={(e) => handleInputChange('chassisNo', e.target.value)}
                          placeholder="e.g. ZVW50-0192842"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* BirthDay */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <label className="col-span-5 text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        BirthDay
                      </label>
                      <div className="col-span-7">
                        <input
                          type="date"
                          value={formData.birthDay}
                          onChange={(e) => handleInputChange('birthDay', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons (Matches Update / Delete and Save in the reference layout) */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded text-xs shadow flex items-center justify-center gap-1.5 transition"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={!isEditing}
                        className={`font-bold py-2 px-3 rounded text-xs shadow flex items-center justify-center gap-1.5 transition ${
                          isEditing
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Edit3 className="w-4 h-4" />
                        Update
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={!isEditing}
                        className={`font-bold py-2 px-3 rounded text-xs shadow flex items-center justify-center gap-1.5 transition ${
                          isEditing
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>

                      <button
                        type="button"
                        onClick={handleClearForm}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-3 rounded text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition"
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

          {/* Bottom Section: Search & Filter Grid (Vehicle Number, Tag Number, Cs Name, City, Vehicle Model, Delivery Date) */}
          <div className="bg-slate-100 border-t border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                Live Vehicle Search & Filters
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline transition"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="text-xs bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium px-2.5 py-1 rounded shadow-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* Vehicle Number filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Vehicle Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.vehicleNumber}
                    onChange={(e) => setFilters({ ...filters, vehicleNumber: e.target.value })}
                    placeholder="Search vehicle..."
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {filters.vehicleNumber && (
                    <button onClick={() => setFilters({ ...filters, vehicleNumber: '' })} className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tag Number filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Tag Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.tagNumber}
                    onChange={(e) => setFilters({ ...filters, tagNumber: e.target.value })}
                    placeholder="TAG-..."
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {filters.tagNumber && (
                    <button onClick={() => setFilters({ ...filters, tagNumber: '' })} className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cs Name filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Cs Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.csName}
                    onChange={(e) => setFilters({ ...filters, csName: e.target.value })}
                    placeholder="Customer..."
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {filters.csName && (
                    <button onClick={() => setFilters({ ...filters, csName: '' })} className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* City filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">City</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    placeholder="City..."
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {filters.city && (
                    <button onClick={() => setFilters({ ...filters, city: '' })} className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Vehicle Model filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Vehicle Model</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.vehicleModel}
                    onChange={(e) => setFilters({ ...filters, vehicleModel: e.target.value })}
                    placeholder="Model..."
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {filters.vehicleModel && (
                    <button onClick={() => setFilters({ ...filters, vehicleModel: '' })} className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery Date filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Delivery Date</label>
                <input
                  type="date"
                  value={filters.deliveryDate}
                  onChange={(e) => setFilters({ ...filters, deliveryDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Table / Data Grid: Columns matching reference screenshot */}
          {/* R/No | Vehicle Number | Tag Number | Cs Name | Address | Telephone | V/Model */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-200/80 border-y border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">R/No</th>
                  <th className="py-2.5 px-3">Vehicle Number</th>
                  <th className="py-2.5 px-3">Tag Number</th>
                  <th className="py-2.5 px-3">Cs Name</th>
                  <th className="py-2.5 px-3">Address</th>
                  <th className="py-2.5 px-3">Telephone</th>
                  <th className="py-2.5 px-3">V/Model</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">
                      <Car className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      No vehicle records found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((row) => {
                    const isSelected = formData.id === row.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => handleLoadRecord(row)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-medium'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">
                          {row.rNo}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
                            {row.vehicleNo}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {row.tagNo || '-'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {row.csName}
                          {row.csStatus && (
                            <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                              {row.csStatus}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={row.address}>
                          {row.address || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-mono">
                          {row.mobileTel || row.homeTel || row.officeTel || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 font-medium">
                            {row.vModel} ({row.colour || 'N/A'})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleLoadRecord(row)}
                              className="p-1 hover:bg-blue-100 text-blue-600 rounded transition"
                              title="Edit in form"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete vehicle ${row.vehicleNo}?`)) {
                                  setVehicles(vehicles.filter(v => v.id !== row.id));
                                  if (formData.id === row.id) handleClearForm();
                                  showNotification(`Vehicle ${row.vehicleNo} removed.`);
                                }
                              }}
                              className="p-1 hover:bg-rose-100 text-rose-600 rounded transition"
                              title="Delete record"
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

          {/* Table Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing {filteredVehicles.length} of {vehicles.length} vehicle records</span>
            <span className="text-[11px] text-slate-400">Click any row to load into the editing form</span>
          </div>
        </div>

      </main>

      {/* Lookup Item Manager Modal (For City / Cs status / Colour update buttons) */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm capitalize">
                Manage {modalType === 'status' ? 'Customer Status' : modalType} List
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Add New {modalType === 'status' ? 'Status' : modalType}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modalNewItem}
                    onChange={(e) => setModalNewItem(e.target.value)}
                    placeholder={`Enter new ${modalType} name...`}
                    className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLookup()}
                  />
                  <button
                    onClick={handleAddLookup}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Existing Options
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1 border border-slate-200 rounded p-2 bg-slate-50">
                  {(modalType === 'city' ? cities : modalType === 'status' ? statuses : colours).map((item) => (
                    <div key={item} className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-slate-200 text-xs">
                      <span>{item}</span>
                      <button
                        onClick={() => {
                          if (modalType === 'city') setCities(cities.filter(c => c !== item));
                          if (modalType === 'status') setStatuses(statuses.filter(s => s !== item));
                          if (modalType === 'colour') setColours(colours.filter(c => c !== item));
                        }}
                        className="text-slate-400 hover:text-rose-600"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setModalType(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
