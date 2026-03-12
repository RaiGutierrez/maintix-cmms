/**
 * Maintix CMMS — script.js
 */

(() => {
  'use strict';

  // ============================================================
  // Storage keys
  // ============================================================

  const STORAGE_KEYS = {
    workOrders: 'maintix_workorders_v2',
    machines: 'maintix_machines_v2',
    machineSelection: 'maintix_selected_machine'
  };

  // ============================================================
  // Seed data
  // ============================================================

  const MACHINES_SEED = [
    {
      id: 'AST-0001',
      name: 'CNC Milling Center XL-500',
      type: 'CNC Machine',
      location: 'Production Floor A',
      status: 'operational',
      lastMaint: '2026-01-14',
      nextPM: '2026-04-14',
      note: 'Primary machining asset for high-precision aluminum components. Current uptime remains stable after spindle inspection.'
    },
    {
      id: 'AST-0002',
      name: 'Hydraulic Press HP-200',
      type: 'Press',
      location: 'Production Floor A',
      status: 'critical',
      lastMaint: '2025-12-18',
      nextPM: '2026-03-05',
      note: 'Seal and pressure system instability detected. Asset is under close monitoring pending corrective execution.'
    },
    {
      id: 'AST-0003',
      name: 'Industrial Lathe TN-800',
      type: 'Lathe',
      location: 'Machining Bay B',
      status: 'operational',
      lastMaint: '2026-02-03',
      nextPM: '2026-05-03',
      note: 'Recently serviced and aligned. Good condition with stable production output.'
    },
    {
      id: 'AST-0004',
      name: 'Overhead Crane OC-5T',
      type: 'Lifting Equipment',
      location: 'Assembly Hall C',
      status: 'maintenance',
      lastMaint: '2026-02-26',
      nextPM: '2026-05-26',
      note: 'Annual inspection ongoing. Restricted operating capacity until certification is completed.'
    },
    {
      id: 'AST-0005',
      name: 'Air Compressor AC-350',
      type: 'Utility',
      location: 'Utility Room',
      status: 'operational',
      lastMaint: '2026-01-22',
      nextPM: '2026-07-22',
      note: 'Essential compressed air utility. Running within acceptable vibration and temperature limits.'
    },
    {
      id: 'AST-0006',
      name: 'Injection Molder IM-640',
      type: 'Injection Molder',
      location: 'Production Floor B',
      status: 'operational',
      lastMaint: '2026-02-17',
      nextPM: '2026-05-17',
      note: 'Predictive monitoring flagged early bearing trend. Asset remains available but should be tracked weekly.'
    },
    {
      id: 'AST-0007',
      name: 'Conveyor Belt CB-12',
      type: 'Material Handling',
      location: 'Logistics Zone',
      status: 'offline',
      lastMaint: '2026-01-09',
      nextPM: '2026-04-09',
      note: 'Line stopped after persistent belt tracking deviation. Awaiting alignment and coupling review.'
    },
    {
      id: 'AST-0008',
      name: 'Laser Cutter LC-1500W',
      type: 'Laser Cutter',
      location: 'Machining Bay B',
      status: 'operational',
      lastMaint: '2026-03-01',
      nextPM: '2026-09-01',
      note: 'Calibration completed successfully. QA cut quality meets current production requirements.'
    },
    {
      id: 'AST-0009',
      name: 'Boiler Unit BU-80',
      type: 'Utility',
      location: 'Utility Room',
      status: 'maintenance',
      lastMaint: '2026-02-11',
      nextPM: '2026-05-11',
      note: 'Annual inspection and descaling in progress. Coordinate shutdown windows carefully.'
    },
    {
      id: 'AST-0010',
      name: 'Welding Station WS-MIG6',
      type: 'Welding Equipment',
      location: 'Fabrication Area',
      status: 'operational',
      lastMaint: '2026-01-30',
      nextPM: '2026-04-30',
      note: 'Stable after wire feed motor replacement. No recent production complaints reported.'
    },
    {
      id: 'AST-0011',
      name: 'Paint Booth PB-900',
      type: 'Surface Treatment',
      location: 'Finishing Area',
      status: 'operational',
      lastMaint: '2026-02-08',
      nextPM: '2026-08-08',
      note: 'Environmental compliance verification pending during next inspection cycle.'
    },
    {
      id: 'AST-0012',
      name: 'Forklift FL-3500',
      type: 'Lifting Equipment',
      location: 'Warehouse',
      status: 'critical',
      lastMaint: '2025-12-12',
      nextPM: '2026-03-08',
      note: 'Mast chain wear exceeds tolerance. Asset should remain unavailable until replacement is completed.'
    }
  ];

  const WO_SEED = [
    {
      id: 'WO-2026-0001',
      machine: 'Hydraulic Press HP-200',
      type: 'Emergency',
      technician: 'Carlos Méndez',
      priority: 'critical',
      status: 'in-progress',
      desc: 'Hydraulic cylinder seal failure with active oil leak on cylinder #2. Machine isolated and under emergency repair.',
      notes: 'Seal kit P/N HP-SK-200. Lockout/Tagout required before line access.',
      due: '2026-03-12',
      created: '2026-03-08'
    },
    {
      id: 'WO-2026-0002',
      machine: 'CNC Milling Center XL-500',
      type: 'Preventive',
      technician: 'Sarah O\'Brien',
      priority: 'medium',
      status: 'pending',
      desc: 'Scheduled 500-hour PM service including lubrication, spindle bearing check and axis calibration.',
      notes: 'Use ISO VG 68 oil and update calibration sheet after completion.',
      due: '2026-03-18',
      created: '2026-03-07'
    },
    {
      id: 'WO-2026-0003',
      machine: 'Overhead Crane OC-5T',
      type: 'Inspection',
      technician: 'Dmitri Volkov',
      priority: 'high',
      status: 'in-progress',
      desc: 'Annual load test and wire rope inspection. Crane capacity restricted until recertification closes.',
      notes: 'Certified rigger must be present. Test zone must remain isolated.',
      due: '2026-03-14',
      created: '2026-03-05'
    },
    {
      id: 'WO-2026-0004',
      machine: 'Forklift FL-3500',
      type: 'Corrective',
      technician: 'James Okafor',
      priority: 'critical',
      status: 'pending',
      desc: 'Mast chain elongation beyond wear limit. Immediate replacement required before return to service.',
      notes: 'Chain P/N FL-CH-35. OEM component only.',
      due: '2026-03-11',
      created: '2026-03-08'
    },
    {
      id: 'WO-2026-0005',
      machine: 'Boiler Unit BU-80',
      type: 'Preventive',
      technician: 'Priya Nair',
      priority: 'high',
      status: 'in-progress',
      desc: 'Annual boiler inspection, safety valve test and water treatment review.',
      notes: 'Coordinate with shutdown window. Relief set point at 8.5 bar.',
      due: '2026-03-16',
      created: '2026-03-06'
    },
    {
      id: 'WO-2026-0006',
      machine: 'Industrial Lathe TN-800',
      type: 'Corrective',
      technician: 'Frank Tanner',
      priority: 'medium',
      status: 'completed',
      desc: 'Replaced worn chuck jaws and verified final runout within tolerance.',
      notes: 'Runout log recorded after verification.',
      due: '2026-03-03',
      created: '2026-03-01'
    },
    {
      id: 'WO-2026-0007',
      machine: 'Conveyor Belt CB-12',
      type: 'Corrective',
      technician: 'Carlos Méndez',
      priority: 'high',
      status: 'pending',
      desc: 'Belt tracking misalignment causing edge wear. Coupling inspection required before restart.',
      notes: 'Replacement belt available in warehouse shelf W-03.',
      due: '2026-03-15',
      created: '2026-03-07'
    },
    {
      id: 'WO-2026-0008',
      machine: 'Laser Cutter LC-1500W',
      type: 'Calibration',
      technician: 'Liu Wei',
      priority: 'medium',
      status: 'completed',
      desc: 'Beam alignment and focal length calibration completed after lens replacement.',
      notes: 'Calibration certificate submitted to QA.',
      due: '2026-03-04',
      created: '2026-03-03'
    },
    {
      id: 'WO-2026-0009',
      machine: 'Air Compressor AC-350',
      type: 'Preventive',
      technician: 'Sarah O\'Brien',
      priority: 'low',
      status: 'completed',
      desc: 'Filter replacement, belt tension check, drain valve test and oil top-up executed.',
      notes: 'Cumulative operating hours updated.',
      due: '2026-03-02',
      created: '2026-02-26'
    },
    {
      id: 'WO-2026-0010',
      machine: 'Welding Station WS-MIG6',
      type: 'Corrective',
      technician: 'Dmitri Volkov',
      priority: 'low',
      status: 'completed',
      desc: 'Wire feed motor replaced and grounding cable re-terminated after intermittent feed fault.',
      notes: 'Replacement covered by vendor warranty.',
      due: '2026-02-28',
      created: '2026-02-24'
    },
    {
      id: 'WO-2026-0011',
      machine: 'Injection Molder IM-640',
      type: 'Predictive',
      technician: 'Priya Nair',
      priority: 'medium',
      status: 'pending',
      desc: 'Rising vibration trend on clamping unit bearings. Monitor and prepare replacement planning.',
      notes: 'Baseline 2.1 mm/s. Action threshold 4.5 mm/s.',
      due: '2026-03-21',
      created: '2026-03-08'
    },
    {
      id: 'WO-2026-0012',
      machine: 'Paint Booth PB-900',
      type: 'Inspection',
      technician: 'Frank Tanner',
      priority: 'low',
      status: 'pending',
      desc: 'Semi-annual filter inspection, exhaust belt check and fire suppression verification.',
      notes: 'Environmental compliance review required.',
      due: '2026-03-25',
      created: '2026-03-08'
    }
  ];

  const TECHNICIANS = [
    'Carlos Méndez',
    'Sarah O\'Brien',
    'Dmitri Volkov',
    'James Okafor',
    'Priya Nair',
    'Frank Tanner',
    'Liu Wei'
  ];

  // ============================================================
  // Utilities
  // ============================================================

  const $ = (id) => document.getElementById(id);

  const safeClone = (value) => JSON.parse(JSON.stringify(value));

  function loadData(key, seed) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return safeClone(seed);
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : safeClone(seed);
    } catch {
      return safeClone(seed);
    }
  }

  function persistData() {
    localStorage.setItem(STORAGE_KEYS.workOrders, JSON.stringify(state.workOrders));
    localStorage.setItem(STORAGE_KEYS.machines, JSON.stringify(state.machines));

    if (state.selectedMachineId) {
      localStorage.setItem(STORAGE_KEYS.machineSelection, state.selectedMachineId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.machineSelection);
    }
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll('\'', '&#39;');
  }

  function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatLongDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function nowDateString() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysBetween(fromDateString, toDateString) {
    if (!fromDateString || !toDateString) return null;

    const from = new Date(`${fromDateString}T00:00:00`);
    const to = new Date(`${toDateString}T00:00:00`);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;

    const diffMs = to.getTime() - from.getTime();
    return Math.round(diffMs / 86400000);
  }

  function getRelativeDueLabel(dateString) {
    const delta = daysBetween(nowDateString(), dateString);
    if (delta === null) return 'No due date';
    if (delta < 0) return `${Math.abs(delta)}d overdue`;
    if (delta === 0) return 'Due today';
    if (delta === 1) return 'Due tomorrow';
    return `Due in ${delta}d`;
  }

  function machineByName(name) {
    return state.machines.find((machine) => machine.name === name) || null;
  }

  function openWorkOrderCount() {
    return state.workOrders.filter((wo) => wo.status === 'pending' || wo.status === 'in-progress').length;
  }

  function activeTechnicianCount() {
    return new Set(
      state.workOrders
        .filter((wo) => wo.status === 'pending' || wo.status === 'in-progress')
        .map((wo) => wo.technician)
    ).size;
  }

  function getMachineOpenWorkOrders(machineName) {
    return state.workOrders.filter(
      (wo) =>
        wo.machine === machineName &&
        (wo.status === 'pending' || wo.status === 'in-progress')
    ).length;
  }

  function countBy(items, getKey) {
    return items.reduce((acc, item) => {
      const key = getKey(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function percentage(value, total) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }

  function average(values) {
    if (!values.length) return 0;
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
  }

  function formatDays(value) {
    return `${Math.round(value)}d`;
  }

  function formatHours(value) {
    return `${value.toFixed(1)}h`;
  }

  function getPriorityRank(priority) {
    const rank = { critical: 4, high: 3, medium: 2, low: 1 };
    return rank[priority] || 0;
  }

  function getStatusLabel(status) {
    return {
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      operational: 'Operational',
      maintenance: 'Maintenance',
      offline: 'Offline',
      critical: 'Critical'
    }[status] || status;
  }

  function getTypeColorClass(status) {
    return `badge badge--${status}`;
  }

  function getPriorityBadge(priority) {
    return `<span class="badge badge--p-${priority}">${escapeHtml(getStatusLabel(priority))}</span>`;
  }

  function getStatusBadge(status) {
    return `<span class="${getTypeColorClass(status)}">${escapeHtml(getStatusLabel(status))}</span>`;
  }

  function getMachineStatusBadge(status) {
    return `<span class="badge badge--${status}">${escapeHtml(getStatusLabel(status))}</span>`;
  }

  function getMachineStatusDotColor(status) {
    return {
      operational: '#22c55e',
      maintenance: '#f59e0b',
      offline: '#61768c',
      critical: '#ef4444'
    }[status] || '#61768c';
  }

  function generateWorkOrderId() {
    const currentYear = new Date().getFullYear();
    const currentYearItems = state.workOrders
      .map((wo) => wo.id)
      .filter((id) => id.startsWith(`WO-${currentYear}-`))
      .map((id) => Number(id.split('-')[2]))
      .filter((num) => Number.isFinite(num));

    const nextNumber = currentYearItems.length ? Math.max(...currentYearItems) + 1 : 1;
    return `WO-${currentYear}-${String(nextNumber).padStart(4, '0')}`;
  }

  function getAnalyticsSnapshot() {
    const workOrders = state.workOrders;
    const machines = state.machines;
    const openOrders = workOrders.filter((wo) => wo.status === 'pending' || wo.status === 'in-progress');
    const completedOrders = workOrders.filter((wo) => wo.status === 'completed');
    const pendingOrders = workOrders.filter((wo) => wo.status === 'pending');
    const emergencyOrders = workOrders.filter((wo) => wo.type === 'Emergency');
    const overdueOrders = workOrders.filter((wo) => {
      if (!wo.due || wo.status === 'completed' || wo.status === 'cancelled') return false;
      return daysBetween(wo.due, nowDateString()) > 0;
    });

    const dueSoonOrders = workOrders.filter((wo) => {
      if (!wo.due || wo.status === 'completed' || wo.status === 'cancelled') return false;
      const delta = daysBetween(nowDateString(), wo.due);
      return delta !== null && delta >= 0 && delta <= 7;
    });

    const inProgressOrders = workOrders.filter((wo) => wo.status === 'in-progress');
    const operationalMachines = machines.filter((machine) => machine.status === 'operational').length;
    const assetAvailability = percentage(operationalMachines, machines.length);
    const pmOrders = workOrders.filter((wo) => wo.type === 'Preventive');
    const pmCompleted = pmOrders.filter((wo) => wo.status === 'completed').length;
    const pmCompliance = percentage(pmCompleted, pmOrders.length || 1);

    const completedCycleDays = completedOrders
      .map((wo) => daysBetween(wo.created, wo.due || wo.created))
      .filter((value) => value !== null && value >= 0);

    const openOrderAging = openOrders
      .map((wo) => daysBetween(wo.created, nowDateString()))
      .filter((value) => value !== null && value >= 0);

    const responseTimeModel = openOrders
      .map((wo) => {
        const rank = getPriorityRank(wo.priority);
        if (rank >= 4) return 2.4;
        if (rank === 3) return 4.1;
        if (rank === 2) return 8.3;
        return 13.2;
      });

    const mttr = completedCycleDays.length ? average(completedCycleDays) * 4.8 : 10.6;
    const responseTime = responseTimeModel.length ? average(responseTimeModel) : 5.2;

    return {
      totalMachines: machines.length,
      openOrders: openOrders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      criticalBacklog: openOrders.filter((wo) => wo.priority === 'critical' || wo.priority === 'high').length,
      dueSoon: dueSoonOrders.length,
      overdueOrders: overdueOrders.length,
      activeTechnicians: activeTechnicianCount(),
      responseTime,
      pmCompliance,
      assetAvailability,
      mttr,
      emergencyRatio: percentage(emergencyOrders.length, workOrders.length || 1),
      averageOpenAging: openOrderAging.length ? average(openOrderAging) : 0,
      machineCounts: countBy(machines, (machine) => machine.status),
      workOrderStatusCounts: countBy(workOrders, (wo) => wo.status),
      priorityCounts: countBy(workOrders, (wo) => wo.priority),
      totalWorkOrders: workOrders.length,
      openOrdersList: openOrders
    };
  }

  // ============================================================
  // State
  // ============================================================

  const state = {
    machines: loadData(STORAGE_KEYS.machines, MACHINES_SEED),
    workOrders: loadData(STORAGE_KEYS.workOrders, WO_SEED),
    currentView: 'dashboard',
    editingWorkOrderId: null,
    deletingWorkOrderId: null,
    selectedMachineId: localStorage.getItem(STORAGE_KEYS.machineSelection) || '',
    filters: {
      workOrders: {
        search: '',
        status: '',
        priority: '',
        type: ''
      },
      machines: {
        search: '',
        status: '',
        location: ''
      }
    }
  };

  // ============================================================
  // DOM helpers
  // ============================================================

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }

  function setHtml(id, value) {
    const element = $(id);
    if (element) element.innerHTML = value;
  }

  function show(elementOrId) {
    const element = typeof elementOrId === 'string' ? $(elementOrId) : elementOrId;
    if (element) element.classList.remove('hidden');
  }

  function hide(elementOrId) {
    const element = typeof elementOrId === 'string' ? $(elementOrId) : elementOrId;
    if (element) element.classList.add('hidden');
  }

  // ============================================================
  // Navigation / shell
  // ============================================================

  function getViewMeta(view) {
    return {
      dashboard: {
        heading: 'Operations Dashboard',
        breadcrumb: 'Plant A › Overview'
      },
      workorders: {
        heading: 'Work Order Management',
        breadcrumb: 'Plant A › Work Orders'
      },
      machines: {
        heading: 'Machines & Assets',
        breadcrumb: 'Plant A › Asset Register'
      },
      analytics: {
        heading: 'Maintenance Analytics',
        breadcrumb: 'Plant A › Analytics'
      }
    }[view] || {
      heading: 'Maintix',
      breadcrumb: 'Plant A'
    };
  }

  function switchView(view) {
    state.currentView = view;

    document.querySelectorAll('.view').forEach((viewEl) => {
      viewEl.classList.add('hidden');
    });

    document.querySelectorAll('.nav-item[data-view]').forEach((navItem) => {
      navItem.classList.remove('active');
      navItem.removeAttribute('aria-current');
    });

    const targetView = $(`view-${view}`);
    const targetNav = document.querySelector(`.nav-item[data-view="${view}"]`);

    if (targetView) targetView.classList.remove('hidden');
    if (targetNav) {
      targetNav.classList.add('active');
      targetNav.setAttribute('aria-current', 'page');
    }

    const meta = getViewMeta(view);
    setText('page-heading', meta.heading);
    setText('topbar-breadcrumb', meta.breadcrumb);

    if (window.innerWidth <= 960) {
      closeSidebar();
    }

    render();
  }

  function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = $('mobile-sidebar-backdrop');
    const topbarMenuButton = $('topbar-menu-btn');
    const sidebarToggle = $('sidebar-toggle');

    if (!sidebar) return;

    sidebar.classList.add('is-open');
    show(backdrop);

    if (topbarMenuButton) topbarMenuButton.setAttribute('aria-expanded', 'true');
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = $('mobile-sidebar-backdrop');
    const topbarMenuButton = $('topbar-menu-btn');
    const sidebarToggle = $('sidebar-toggle');

    if (!sidebar) return;

    sidebar.classList.remove('is-open');
    hide(backdrop);

    if (topbarMenuButton) topbarMenuButton.setAttribute('aria-expanded', 'false');
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
  }

  // ============================================================
  // Clock
  // ============================================================

  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const date = now.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    setText('topbar-time', `${date}  ${time}`);
  }

  // ============================================================
  // Filtering
  // ============================================================

  function getFilteredWorkOrders() {
    const { search, status, priority, type } = state.filters.workOrders;
    const normalizedSearch = search.trim().toLowerCase();

    return state.workOrders.filter((workOrder) => {
      const matchesSearch =
        !normalizedSearch ||
        workOrder.id.toLowerCase().includes(normalizedSearch) ||
        workOrder.machine.toLowerCase().includes(normalizedSearch) ||
        workOrder.desc.toLowerCase().includes(normalizedSearch) ||
        workOrder.technician.toLowerCase().includes(normalizedSearch) ||
        workOrder.type.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !status || workOrder.status === status;
      const matchesPriority = !priority || workOrder.priority === priority;
      const matchesType = !type || workOrder.type === type;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }

  function getFilteredMachines() {
    const { search, status, location } = state.filters.machines;
    const normalizedSearch = search.trim().toLowerCase();

    return state.machines.filter((machine) => {
      const matchesSearch =
        !normalizedSearch ||
        machine.id.toLowerCase().includes(normalizedSearch) ||
        machine.name.toLowerCase().includes(normalizedSearch) ||
        machine.type.toLowerCase().includes(normalizedSearch) ||
        machine.location.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !status || machine.status === status;
      const matchesLocation = !location || machine.location === location;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }

  function populateMachineLocationFilter() {
    const select = $('machine-filter-location');
    if (!select) return;

    const locations = [...new Set(state.machines.map((machine) => machine.location))].sort();
    const currentValue = state.filters.machines.location;

    select.innerHTML = `
      <option value="">All Locations</option>
      ${locations
        .map((location) => `<option value="${escapeHtml(location)}">${escapeHtml(location)}</option>`)
        .join('')}
    `;

    select.value = currentValue;
  }

  function populateMachineFormSelect() {
    const select = $('f-machine');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = `
      <option value="">— Select machine —</option>
      ${state.machines
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((machine) => `<option value="${escapeHtml(machine.name)}">${escapeHtml(machine.name)}</option>`)
        .join('')}
    `;

    if (currentValue && state.machines.some((machine) => machine.name === currentValue)) {
      select.value = currentValue;
    }
  }

  // ============================================================
  // Dashboard rendering
  // ============================================================

  function renderHero(snapshot) {
    setText('hero-mttr', formatHours(snapshot.mttr));
    setText('hero-uptime', `${snapshot.assetAvailability}%`);
    setText('hero-pm', `${snapshot.pmCompliance}%`);
  }

  function renderKPIs(snapshot) {
    setText('kpi-machines', String(snapshot.totalMachines));
    setText('kpi-open', String(snapshot.openOrders));
    setText('kpi-pending', String(snapshot.pendingOrders));
    setText('kpi-done', String(snapshot.completedOrders));

    setText('kpi-machines-sub', `${snapshot.machineCounts.critical || 0} critical`);
    setText('kpi-open-sub', `${snapshot.overdueOrders} overdue`);
    setText('kpi-pending-sub', `${snapshot.dueSoon} due in 7d`);
    setText('kpi-done-sub', `${snapshot.pmCompliance}% PM compliant`);

    setText('ops-critical-backlog', String(snapshot.criticalBacklog));
    setText('ops-due-soon', String(snapshot.dueSoon));
    setText('ops-tech-active', String(snapshot.activeTechnicians));
    setText('ops-response-time', formatHours(snapshot.responseTime));

    setText('metric-schedule-compliance', `${snapshot.pmCompliance}%`);
    setText('metric-emergency-ratio', `${snapshot.emergencyRatio}%`);
    setText('metric-wo-aging', formatDays(snapshot.averageOpenAging));
    setText('metric-asset-availability', `${snapshot.assetAvailability}%`);

    setText('nav-badge-wo', String(openWorkOrderCount()));
  }

  function renderCriticalList() {
    const list = state.workOrders
      .filter((workOrder) => workOrder.status !== 'completed' && workOrder.status !== 'cancelled')
      .sort((a, b) => {
        const rankDiff = getPriorityRank(b.priority) - getPriorityRank(a.priority);
        if (rankDiff !== 0) return rankDiff;
        return new Date(a.due || '2999-12-31') - new Date(b.due || '2999-12-31');
      })
      .slice(0, 5);

    if (!list.length) {
      setHtml('critical-list', '<div class="empty-inline">No active critical backlog.</div>');
      return;
    }

    setHtml(
      'critical-list',
      list
        .map(
          (workOrder) => `
            <article class="crit-item">
              <div class="crit-item-left">
                <span class="crit-item-ref">${escapeHtml(workOrder.id)}</span>
                <span class="crit-item-name" title="${escapeHtml(workOrder.desc)}">${escapeHtml(workOrder.desc)}</span>
                <span class="crit-item-machine">${escapeHtml(workOrder.machine)} · ${escapeHtml(workOrder.technician)}</span>
              </div>
              ${getPriorityBadge(workOrder.priority)}
            </article>
          `
        )
        .join('')
    );
  }

  function renderMachineStatusList() {
    const prioritizedMachines = state.machines
      .slice()
      .sort((a, b) => {
        const severityOrder = {
          critical: 4,
          maintenance: 3,
          offline: 2,
          operational: 1
        };
        return severityOrder[b.status] - severityOrder[a.status];
      })
      .slice(0, 6);

    if (!prioritizedMachines.length) {
      setHtml('machine-status-list', '<div class="empty-inline">No machine data available.</div>');
      return;
    }

    setHtml(
      'machine-status-list',
      prioritizedMachines
        .map(
          (machine) => `
            <article class="mstatus-item">
              <span
                class="mstatus-dot"
                style="background:${getMachineStatusDotColor(machine.status)}; box-shadow:0 0 8px ${getMachineStatusDotColor(machine.status)}"
              ></span>
              <div style="flex:1; min-width:0;">
                <div class="mstatus-name">${escapeHtml(machine.name)}</div>
                <div class="mstatus-loc">${escapeHtml(machine.id)} · ${escapeHtml(machine.location)}</div>
              </div>
              ${getMachineStatusBadge(machine.status)}
            </article>
          `
        )
        .join('')
    );
  }

  function renderRecentWorkOrders() {
    const rows = state.workOrders
      .slice()
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 8)
      .map(
        (workOrder) => `
          <tr>
            <td><span class="td-wo-ref">${escapeHtml(workOrder.id)}</span></td>
            <td>${escapeHtml(workOrder.machine)}</td>
            <td class="td-desc" title="${escapeHtml(workOrder.desc)}">${escapeHtml(workOrder.desc)}</td>
            <td>${escapeHtml(workOrder.technician)}</td>
            <td>${getPriorityBadge(workOrder.priority)}</td>
            <td>${getStatusBadge(workOrder.status)}</td>
            <td style="color:var(--t-muted); font-family:var(--font-mono); font-size:.72rem;">${formatDate(workOrder.created)}</td>
          </tr>
        `
      )
      .join('');

    setHtml('dash-wo-tbody', rows);
  }

  function renderActivityFeed() {
    const activityItems = state.workOrders
      .slice()
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 6)
      .map((workOrder) => {
        const machine = machineByName(workOrder.machine);
        const machineLocation = machine ? machine.location : 'Plant floor';
        const activityTitle = `${workOrder.type} order ${workOrder.id} assigned to ${workOrder.technician}`;
        const activityMeta = `${workOrder.machine} · ${machineLocation} · ${formatLongDate(workOrder.created)}`;

        return `
          <article class="activity-item">
            <div class="activity-item__title">${escapeHtml(activityTitle)}</div>
            <div class="activity-item__meta">${escapeHtml(activityMeta)}</div>
          </article>
        `;
      })
      .join('');

    setHtml('activity-feed', activityItems || '<div class="empty-inline">No recent activity available.</div>');
  }

  function renderDashboard() {
    const snapshot = getAnalyticsSnapshot();
    renderHero(snapshot);
    renderKPIs(snapshot);
    renderCriticalList();
    renderMachineStatusList();
    renderRecentWorkOrders();
    renderActivityFeed();
  }

  // ============================================================
  // Work orders rendering
  // ============================================================

  function renderWorkOrdersTable() {
    const filtered = getFilteredWorkOrders();
    const emptyState = $('wo-empty');

    setText('wo-count', `${filtered.length} of ${state.workOrders.length} work orders`);

    if (!filtered.length) {
      setHtml('wo-tbody', '');
      show(emptyState);
      return;
    }

    hide(emptyState);

    const rows = filtered
      .slice()
      .sort((a, b) => {
        const rankDiff = getPriorityRank(b.priority) - getPriorityRank(a.priority);
        if (rankDiff !== 0) return rankDiff;
        return new Date(b.created) - new Date(a.created);
      })
      .map(
        (workOrder) => `
          <tr>
            <td><span class="td-wo-ref">${escapeHtml(workOrder.id)}</span></td>
            <td>${escapeHtml(workOrder.machine)}</td>
            <td class="td-desc" title="${escapeHtml(workOrder.desc)}">${escapeHtml(workOrder.desc)}</td>
            <td>${escapeHtml(workOrder.type)}</td>
            <td>${escapeHtml(workOrder.technician)}</td>
            <td>${getPriorityBadge(workOrder.priority)}</td>
            <td>${getStatusBadge(workOrder.status)}</td>
            <td style="font-family:var(--font-mono); color:var(--t-secondary); font-size:.72rem;">${formatDate(workOrder.due)}</td>
            <td style="font-family:var(--font-mono); color:var(--t-muted); font-size:.72rem;">${formatDate(workOrder.created)}</td>
            <td>
              <div class="td-actions">
                <button class="btn-icon btn-edit-wo" data-id="${escapeHtml(workOrder.id)}" title="Edit work order" aria-label="Edit ${escapeHtml(workOrder.id)}">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="btn-icon btn-icon--red btn-del-wo" data-id="${escapeHtml(workOrder.id)}" title="Delete work order" aria-label="Delete ${escapeHtml(workOrder.id)}">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');

    setHtml('wo-tbody', rows);
  }

  // ============================================================
  // Machines rendering
  // ============================================================

  function renderMachinePreview() {
    const previewContainer = $('machine-preview');
    const previewEmpty = $('machine-preview-empty');

    if (!state.selectedMachineId) {
      hide(previewContainer);
      show(previewEmpty);
      return;
    }

    const machine = state.machines.find((item) => item.id === state.selectedMachineId);

    if (!machine) {
      state.selectedMachineId = '';
      hide(previewContainer);
      show(previewEmpty);
      persistData();
      return;
    }

    const openCount = getMachineOpenWorkOrders(machine.name);

    setText('preview-name', machine.name);
    setText('preview-meta', `${machine.id} · ${machine.type}`);
    setText('preview-location', machine.location);
    setText('preview-last-maintenance', formatDate(machine.lastMaint));
    setText('preview-next-pm', formatDate(machine.nextPM));
    setText('preview-open-wo', String(openCount));
    setText('preview-note', machine.note || 'No operational note available.');

    const statusElement = $('preview-status');
    if (statusElement) {
      statusElement.className = `status-pill badge--${machine.status}`;
      statusElement.textContent = getStatusLabel(machine.status);
    }

    hide(previewEmpty);
    show(previewContainer);
  }

  function renderMachinesTable() {
    populateMachineLocationFilter();

    const filtered = getFilteredMachines();
    setText('machine-count', `${filtered.length} of ${state.machines.length} assets`);

    const rows = filtered
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((machine) => {
        const openCount = getMachineOpenWorkOrders(machine.name);
        const dueDelta = daysBetween(nowDateString(), machine.nextPM);
        const isOverdue = typeof dueDelta === 'number' && dueDelta < 0;
        const isSelected = machine.id === state.selectedMachineId;

        return `
          <tr class="${isSelected ? 'is-selected' : ''}" data-machine-id="${escapeHtml(machine.id)}">
            <td><span class="td-asset-id">${escapeHtml(machine.id)}</span></td>
            <td style="font-weight:600;">${escapeHtml(machine.name)}</td>
            <td style="color:var(--t-secondary);">${escapeHtml(machine.type)}</td>
            <td style="color:var(--t-secondary);">${escapeHtml(machine.location)}</td>
            <td>${getMachineStatusBadge(machine.status)}</td>
            <td style="color:var(--t-secondary); font-family:var(--font-mono); font-size:.72rem;">${formatDate(machine.lastMaint)}</td>
            <td style="font-family:var(--font-mono); font-size:.72rem; ${isOverdue ? 'color:var(--red); font-weight:700;' : 'color:var(--t-secondary);'}">${formatDate(machine.nextPM)}</td>
            <td style="text-align:center;">
              ${
                openCount
                  ? `<span class="badge badge--in-progress">${openCount} open</span>`
                  : '<span style="color:var(--t-muted);">—</span>'
              }
            </td>
          </tr>
        `;
      })
      .join('');

    setHtml('machine-tbody', rows);
    renderMachinePreview();
  }

  // ============================================================
  // Analytics rendering
  // ============================================================

  function renderAnalyticsBreakdown(targetId, items, total) {
    if (!items.length) {
      setHtml(targetId, '<div class="empty-inline">No data available.</div>');
      return;
    }

    setHtml(
      targetId,
      items
        .map(
          ({ label, value }) => `
            <article class="analytics-row">
              <span class="analytics-row__label">${escapeHtml(label)}</span>
              <span class="analytics-row__value">${value} <span style="color:var(--t-muted); font-size:.76rem;">(${percentage(value, total)}%)</span></span>
            </article>
          `
        )
        .join('')
    );
  }

  function renderAnalyticsInsights(snapshot) {
    const recommendation =
      snapshot.criticalBacklog > 2
        ? 'Reduce emergency exposure by prioritizing press and lifting equipment backlog during the next execution window.'
        : 'Backlog is controlled. Keep preventive compliance above target and maintain technician allocation discipline.';

    const risk =
      snapshot.overdueOrders > 0
        ? `${snapshot.overdueOrders} active work orders are overdue, increasing asset reliability and safety exposure.`
        : 'No overdue active work orders detected. Current execution risk remains within acceptable operating range.';

    const focus =
      snapshot.pmCompliance < 70
        ? 'Improve preventive completion discipline and close due-soon tasks before they shift into corrective backlog.'
        : 'Focus on reducing critical asset downtime and keeping in-progress orders moving toward closure.';

    setText('insight-recommendation', recommendation);
    setText('insight-risk', risk);
    setText('insight-focus', focus);
  }

  function renderAnalytics() {
    const snapshot = getAnalyticsSnapshot();

    renderAnalyticsBreakdown(
      'analytics-status-breakdown',
      [
        { label: 'Pending', value: snapshot.workOrderStatusCounts.pending || 0 },
        { label: 'In Progress', value: snapshot.workOrderStatusCounts['in-progress'] || 0 },
        { label: 'Completed', value: snapshot.workOrderStatusCounts.completed || 0 },
        { label: 'Cancelled', value: snapshot.workOrderStatusCounts.cancelled || 0 }
      ],
      snapshot.totalWorkOrders
    );

    renderAnalyticsBreakdown(
      'analytics-priority-breakdown',
      [
        { label: 'Critical', value: snapshot.priorityCounts.critical || 0 },
        { label: 'High', value: snapshot.priorityCounts.high || 0 },
        { label: 'Medium', value: snapshot.priorityCounts.medium || 0 },
        { label: 'Low', value: snapshot.priorityCounts.low || 0 }
      ],
      snapshot.totalWorkOrders
    );

    renderAnalyticsBreakdown(
      'analytics-machine-breakdown',
      [
        { label: 'Operational', value: snapshot.machineCounts.operational || 0 },
        { label: 'Under Maintenance', value: snapshot.machineCounts.maintenance || 0 },
        { label: 'Offline', value: snapshot.machineCounts.offline || 0 },
        { label: 'Critical', value: snapshot.machineCounts.critical || 0 }
      ],
      state.machines.length
    );

    renderAnalyticsInsights(snapshot);
  }

  // ============================================================
  // Export
  // ============================================================

  function exportWorkOrdersCsv() {
    const headers = [
      'Work Order ID',
      'Machine',
      'Type',
      'Technician',
      'Priority',
      'Status',
      'Due Date',
      'Created',
      'Description',
      'Notes'
    ];

    const lines = [
      headers.join(','),
      ...state.workOrders.map((workOrder) =>
        [
          workOrder.id,
          workOrder.machine,
          workOrder.type,
          workOrder.technician,
          workOrder.priority,
          workOrder.status,
          workOrder.due || '',
          workOrder.created,
          workOrder.desc,
          workOrder.notes || ''
        ]
          .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
          .join(',')
      )
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `maintix-work-orders-${nowDateString()}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  // ============================================================
  // Modal
  // ============================================================

  function resetFormValidation() {
    document.querySelectorAll('.f-input.invalid').forEach((element) => {
      element.classList.remove('invalid');
    });

    hide('f-error');
  }

  function openWorkOrderModal(workOrder = null) {
    state.editingWorkOrderId = workOrder ? workOrder.id : null;

    populateMachineFormSelect();
    resetFormValidation();

    setText('modal-title', workOrder ? 'Edit Work Order' : 'New Work Order');
    setText('modal-wo-num', workOrder ? workOrder.id : 'Auto-assigned');
    setText('btn-save', workOrder ? 'Save Changes' : 'Create Work Order');

    $('f-id').value = workOrder?.id || '';
    $('f-machine').value = workOrder?.machine || '';
    $('f-type').value = workOrder?.type || '';
    $('f-technician').value = workOrder?.technician || '';
    $('f-priority').value = workOrder?.priority || '';
    $('f-desc').value = workOrder?.desc || '';
    $('f-status').value = workOrder?.status || 'pending';
    $('f-due').value = workOrder?.due || '';
    $('f-notes').value = workOrder?.notes || '';

    show('modal-overlay');
    $('modal-overlay').setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      $('f-machine')?.focus();
    }, 50);
  }

  function closeWorkOrderModal() {
    state.editingWorkOrderId = null;
    hide('modal-overlay');
    $('modal-overlay').setAttribute('aria-hidden', 'true');
  }

  function validateWorkOrderForm() {
    const requiredFields = ['f-machine', 'f-type', 'f-technician', 'f-priority', 'f-desc'];
    let isValid = true;

    requiredFields.forEach((fieldId) => {
      const element = $(fieldId);
      if (!element) return;

      element.classList.remove('invalid');

      if (!String(element.value || '').trim()) {
        element.classList.add('invalid');
        isValid = false;
      }
    });

    return isValid;
  }

  function saveWorkOrder() {
    if (!validateWorkOrderForm()) {
      show('f-error');
      return;
    }

    const machineName = $('f-machine').value;
    const machine = machineByName(machineName);

    const payload = {
      machine: machineName,
      type: $('f-type').value,
      technician: $('f-technician').value,
      priority: $('f-priority').value,
      desc: $('f-desc').value.trim(),
      status: $('f-status').value,
      due: $('f-due').value || '',
      notes: $('f-notes').value.trim()
    };

    if (state.editingWorkOrderId) {
      const index = state.workOrders.findIndex((workOrder) => workOrder.id === state.editingWorkOrderId);
      if (index !== -1) {
        state.workOrders[index] = {
          ...state.workOrders[index],
          ...payload
        };
      }
    } else {
      state.workOrders.unshift({
        id: generateWorkOrderId(),
        created: nowDateString(),
        ...payload
      });
    }

    if (machine && (payload.priority === 'critical' || payload.status === 'in-progress')) {
      if (machine.status === 'operational' && payload.priority === 'critical') {
        machine.status = 'maintenance';
      }
    }

    persistData();
    closeWorkOrderModal();
    render();
  }

  // ============================================================
  // Delete dialog
  // ============================================================

  function openDeleteDialog(workOrderId) {
    state.deletingWorkOrderId = workOrderId;
    setText('del-wo-ref', workOrderId);
    show('del-overlay');
    $('del-overlay').setAttribute('aria-hidden', 'false');
  }

  function closeDeleteDialog() {
    state.deletingWorkOrderId = null;
    hide('del-overlay');
    $('del-overlay').setAttribute('aria-hidden', 'true');
  }

  function confirmDeleteWorkOrder() {
    if (!state.deletingWorkOrderId) return;

    state.workOrders = state.workOrders.filter(
      (workOrder) => workOrder.id !== state.deletingWorkOrderId
    );

    persistData();
    closeDeleteDialog();
    render();
  }

  // ============================================================
  // Render root
  // ============================================================

  function render() {
    setText('nav-badge-wo', String(openWorkOrderCount()));
    renderDashboard();
    renderWorkOrdersTable();
    renderMachinesTable();
    renderAnalytics();
  }

  // ============================================================
  // Events
  // ============================================================

  function bindNavigationEvents() {
    document.addEventListener('click', (event) => {
      const navItem = event.target.closest('.nav-item[data-view]');
      if (navItem) {
        event.preventDefault();
        switchView(navItem.dataset.view);
        return;
      }

      const panelLink = event.target.closest('.panel-link[data-view]');
      if (panelLink) {
        event.preventDefault();
        switchView(panelLink.dataset.view);
        return;
      }

      const editButton = event.target.closest('.btn-edit-wo');
      if (editButton) {
        const workOrder = state.workOrders.find((item) => item.id === editButton.dataset.id);
        if (workOrder) openWorkOrderModal(workOrder);
        return;
      }

      const deleteButton = event.target.closest('.btn-del-wo');
      if (deleteButton) {
        openDeleteDialog(deleteButton.dataset.id);
        return;
      }

      const machineRow = event.target.closest('#machine-tbody tr[data-machine-id]');
      if (machineRow) {
        state.selectedMachineId = machineRow.dataset.machineId;
        persistData();
        renderMachinesTable();
      }
    });
  }

  function bindShellEvents() {
    $('btn-new-wo')?.addEventListener('click', () => openWorkOrderModal());
    $('btn-export')?.addEventListener('click', exportWorkOrdersCsv);

    $('topbar-menu-btn')?.addEventListener('click', () => openSidebar());
    $('sidebar-toggle')?.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar?.classList.contains('is-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    $('mobile-sidebar-backdrop')?.addEventListener('click', closeSidebar);
  }

  function bindModalEvents() {
    $('modal-close')?.addEventListener('click', closeWorkOrderModal);
    $('btn-cancel')?.addEventListener('click', closeWorkOrderModal);
    $('btn-save')?.addEventListener('click', saveWorkOrder);

    $('modal-overlay')?.addEventListener('click', (event) => {
      if (event.target === $('modal-overlay')) {
        closeWorkOrderModal();
      }
    });

    $('btn-del-cancel')?.addEventListener('click', closeDeleteDialog);
    $('btn-del-confirm')?.addEventListener('click', confirmDeleteWorkOrder);

    $('del-overlay')?.addEventListener('click', (event) => {
      if (event.target === $('del-overlay')) {
        closeDeleteDialog();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeWorkOrderModal();
        closeDeleteDialog();
        closeSidebar();
      }
    });
  }

  function bindFilterEvents() {
    $('wo-search')?.addEventListener('input', (event) => {
      state.filters.workOrders.search = event.target.value;
      renderWorkOrdersTable();
    });

    $('wo-filter-status')?.addEventListener('change', (event) => {
      state.filters.workOrders.status = event.target.value;
      renderWorkOrdersTable();
    });

    $('wo-filter-priority')?.addEventListener('change', (event) => {
      state.filters.workOrders.priority = event.target.value;
      renderWorkOrdersTable();
    });

    $('wo-filter-type')?.addEventListener('change', (event) => {
      state.filters.workOrders.type = event.target.value;
      renderWorkOrdersTable();
    });

    $('btn-reset-wo-filters')?.addEventListener('click', () => {
      state.filters.workOrders = {
        search: '',
        status: '',
        priority: '',
        type: ''
      };

      $('wo-search').value = '';
      $('wo-filter-status').value = '';
      $('wo-filter-priority').value = '';
      $('wo-filter-type').value = '';

      renderWorkOrdersTable();
    });

    $('machine-search')?.addEventListener('input', (event) => {
      state.filters.machines.search = event.target.value;
      renderMachinesTable();
    });

    $('machine-filter-status')?.addEventListener('change', (event) => {
      state.filters.machines.status = event.target.value;
      renderMachinesTable();
    });

    $('machine-filter-location')?.addEventListener('change', (event) => {
      state.filters.machines.location = event.target.value;
      renderMachinesTable();
    });

    $('btn-reset-machine-filters')?.addEventListener('click', () => {
      state.filters.machines = {
        search: '',
        status: '',
        location: ''
      };

      $('machine-search').value = '';
      $('machine-filter-status').value = '';
      $('machine-filter-location').value = '';

      renderMachinesTable();
    });

    document.querySelectorAll('.f-input').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid') && String(input.value).trim()) {
          input.classList.remove('invalid');
        }
      });
    });
  }

  // ============================================================
  // Init
  // ============================================================

  function syncTechnicianSelect() {
    const select = $('f-technician');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = `
      <option value="">— Assign technician —</option>
      ${TECHNICIANS.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
    `;

    if (currentValue && TECHNICIANS.includes(currentValue)) {
      select.value = currentValue;
    }
  }

  function restoreSelectedMachine() {
    if (state.selectedMachineId && state.machines.some((machine) => machine.id === state.selectedMachineId)) {
      return;
    }

    const firstCriticalOrMaintenance = state.machines.find(
      (machine) => machine.status === 'critical' || machine.status === 'maintenance'
    );

    state.selectedMachineId = firstCriticalOrMaintenance?.id || state.machines[0]?.id || '';
  }

  function init() {
    syncTechnicianSelect();
    populateMachineFormSelect();
    populateMachineLocationFilter();
    restoreSelectedMachine();

    bindNavigationEvents();
    bindShellEvents();
    bindModalEvents();
    bindFilterEvents();

    updateClock();
    setInterval(updateClock, 1000);

    switchView('dashboard');
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();