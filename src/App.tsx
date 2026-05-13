import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './layouts/AppLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ItemMaster from './pages/products/ItemMaster';
import ProductAdd from './pages/products/ProductAdd';
import ProductForm from './pages/products/ProductForm';
import ImportProducts from './pages/products/ImportProducts';
import Suppliers from './pages/masters/Suppliers';
import VendorApprovals from './pages/suppliers/VendorApprovals';
import VendorRegistration from './pages/suppliers/VendorRegistration';
import VendorPortal from './pages/suppliers/VendorPortal';
import HsnMaster from './pages/masters/HsnMaster';
import Billing from './pages/billing/Billing';
import Purchases from './pages/purchases/Purchases';
import POList from './pages/purchases/POList';
import POCreate from './pages/purchases/POCreate';
import PODetail from './pages/purchases/PODetail';
import Inventory from './pages/inventory/Inventory';
import AccountsDashboard from './pages/accounts/AccountsDashboard';
import Payments from './pages/accounts/Payments';
import ReportCenter from './pages/reports/ReportCenter';
import SalesReport from './pages/reports/SalesReport';
import PurchaseReport from './pages/reports/PurchaseReport';
import StockReport from './pages/reports/StockReport';
import ProfitLossReport from './pages/reports/ProfitLossReport';
import GSTReport from './pages/reports/GSTReport';
import PaymentMatrix from './pages/reports/PaymentMatrix';
import OutstandingReport from './pages/reports/OutstandingReport';
import PaymentCollectionReport from './pages/reports/PaymentCollectionReport';
import HourlySalesReport from './pages/reports/HourlySalesReport';
import HierarchyReport from './pages/reports/HierarchyReport';
import StockLedgerReport from './pages/reports/StockLedgerReport';
import HsnMismatchReport from './pages/reports/HsnMismatchReport';
import HsnMappingReport from './pages/reports/HsnMappingReport';
import HsnExceptionReport from './pages/reports/HsnExceptionReport';
import EmployeeDirectory from './pages/hr/EmployeeDirectory';
import Attendance from './pages/hr/Attendance';
import Customers from './pages/masters/Customers';
import Groups from './pages/masters/Groups';
import SubGroups from './pages/masters/SubGroups';
import Categories from './pages/masters/Categories';
import SubCategories from './pages/masters/SubCategories';
import Brands from './pages/masters/Brands';
import SubBrands from './pages/masters/SubBrands';
import Manufacturers from './pages/masters/Manufacturers';
import Units from './pages/masters/Units';
import GstMaster from './pages/masters/GstMaster';
import CountryMaster from './pages/masters/CountryMaster';
import OutletMaster from './pages/masters/OutletMaster';
import SubManufacturers from './pages/masters/SubManufacturers';
import Variants from './pages/masters/Variants';
import Flavours from './pages/masters/Flavours';
import ProductClassification from './pages/masters/ProductClassification';
import GlobalSync from './pages/inventory/GlobalSync';
import SyncMonitor from './pages/inventory/SyncMonitor';
import CompanySettings from './pages/settings/CompanySettings'
import WarehouseRacking from './pages/masters/WarehouseRacking';
import PutawayDashboard from './pages/wms/PutawayDashboard';
import GRNPutaway from './pages/wms/GRNPutaway';
import QuickScan from './pages/wms/QuickScan';
import ChannelPartners from './pages/masters/ChannelPartners';
import ChannelMarginReport from './pages/reports/ChannelMarginReport';
import LowMarginReport from './pages/reports/LowMarginReport';
import MarkdownItemReport from './pages/reports/MarkdownItemReport';
import ThemeSettings from './pages/settings/ThemeSettings';
import PortalHub from './pages/help/PortalHub';
import SystemHelp from './pages/help/SystemHelp';
import AuditLogReport from './pages/reports/AuditLogReport';
import LogisticList from './pages/logistics/LogisticList';
import LogisticTransferWizard from './pages/logistics/LogisticTransferWizard';

// Placeholder components for other modules
const Masters = () => <div className="h-96 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl text-slate-400">Masters Module (Phase 3)</div>;
const Estimates = () => <div className="h-96 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl text-slate-400">Estimates Module</div>;
const Payroll = () => <div className="h-96 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl text-slate-400">Payroll & Salary Module (Phase 8)</div>;

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/vendor-registration/:token" element={<VendorRegistration />} />
        <Route path="/vendor-portal" element={<VendorPortal />} />
        
        {/* HHT / Mobile WMS Routes */}
        <Route path="/hht" element={<PutawayDashboard />} />
        <Route path="/hht/putaway/:grnId" element={<GRNPutaway />} />
        <Route path="/hht/quick-scan" element={<QuickScan />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Products & Masters */}
          <Route path="products/item-master" element={<ItemMaster />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductAdd />} />
          <Route path="products/list" element={<ItemMaster />} />
          <Route path="products/import" element={<ImportProducts />} />
          
          <Route path="masters/suppliers" element={<Suppliers />} />
          <Route path="masters/suppliers/approvals" element={<VendorApprovals />} />
          <Route path="masters/customers" element={<Customers />} />
          <Route path="masters/groups" element={<Groups />} />
          <Route path="masters/subgroups" element={<SubGroups />} />
          <Route path="masters/categories" element={<Categories />} />
          <Route path="masters/subcategories" element={<SubCategories />} />
          <Route path="masters/brands" element={<Brands />} />
          <Route path="masters/subbrands" element={<SubBrands />} />
          <Route path="masters/manufacturers" element={<Manufacturers />} />
          <Route path="masters/submanufacturers" element={<SubManufacturers />} />
          <Route path="masters/variants" element={<Variants />} />
          <Route path="masters/flavours" element={<Flavours />} />
          <Route path="masters/classification" element={<ProductClassification />} />
          <Route path="masters/units" element={<Units />} />
          <Route path="masters/gst" element={<GstMaster />} />
          <Route path="masters/countries" element={<CountryMaster />} />
          <Route path="masters/outlets" element={<OutletMaster />} />
          <Route path="masters/hsn" element={<HsnMaster />} />
          <Route path="masters/warehouse-racking" element={<WarehouseRacking />} />
          <Route path="masters/channels" element={<ChannelPartners />} />
          <Route path="masters/*" element={<Masters />} />
          
          {/* Settings */}
          <Route path="settings/company" element={<CompanySettings />} />
          <Route path="settings/theme" element={<ThemeSettings />} />
          <Route path="help" element={<SystemHelp />} />
          <Route path="portals" element={<PortalHub />} />
          <Route path="reports/audit-logs" element={<AuditLogReport />} />
          
          {/* Billing & Estimates */}
          <Route path="billing/create" element={<Billing />} />
          <Route path="billing/*" element={<Billing />} />
          <Route path="estimates/*" element={<Estimates />} />
          
          {/* Purchases & Inventory */}
          <Route path="purchases/list" element={<Purchases />} />
          <Route path="purchases/grn" element={<Purchases />} />
          <Route path="purchases/po" element={<POList />} />
          <Route path="purchases/po/create" element={<POCreate />} />
          <Route path="purchases/po/edit/:id" element={<POCreate />} />
          <Route path="purchases/po/:id" element={<PODetail />} />
          <Route path="purchases/*" element={<Purchases />} />
          <Route path="inventory/status" element={<Inventory />} />
          <Route path="inventory/sync" element={<GlobalSync />} />
          <Route path="inventory/monitor" element={<SyncMonitor />} />
          <Route path="inventory/*" element={<Inventory />} />
          
          {/* Logistics */}
          <Route path="logistics/list" element={<LogisticList />} />
          <Route path="logistics/new" element={<LogisticTransferWizard />} />
          <Route path="logistics/transfer/:id" element={<LogisticTransferWizard />} />
          
          {/* Accounts & Payments */}
          <Route path="accounts/dashboard" element={<AccountsDashboard />} />
          <Route path="accounts/payments" element={<Payments />} />
          <Route path="accounts/*" element={<AccountsDashboard />} />
          
          {/* Reports Suite — all 10 active */}
          <Route path="reports/center"      element={<ReportCenter />} />
          <Route path="reports/sales"       element={<SalesReport />} />
          <Route path="reports/purchases"   element={<PurchaseReport />} />
          <Route path="reports/stock"       element={<StockReport />} />
          <Route path="reports/pl"          element={<ProfitLossReport />} />
          <Route path="reports/gst"         element={<GSTReport />} />
          <Route path="reports/payments-matrix" element={<PaymentMatrix />} />
          <Route path="reports/outstanding" element={<OutstandingReport />} />
          <Route path="reports/payments"    element={<PaymentCollectionReport />} />
          <Route path="reports/hourly"      element={<HourlySalesReport />} />
          <Route path="reports/hierarchy"   element={<HierarchyReport />} />
          <Route path="reports/ledger"      element={<StockReport />} />
          <Route path="reports/hsn-mismatch" element={<HsnMismatchReport />} />
          <Route path="reports/hsn-mapping" element={<HsnMappingReport />} />
          <Route path="reports/hsn-exceptions" element={<HsnExceptionReport />} />
          <Route path="reports/channel-margin" element={<ChannelMarginReport />} />
          <Route path="reports/low-margin" element={<LowMarginReport />} />
          <Route path="reports/markdown-items" element={<MarkdownItemReport />} />
          <Route path="reports/*"           element={<ReportCenter />} />
          {/* HR & Payroll */}
          <Route path="hr/employees" element={<EmployeeDirectory />} />
          <Route path="hr/attendance" element={<Attendance />} />
          <Route path="hr/payroll" element={<Payroll />} />
          <Route path="hr/*" element={<EmployeeDirectory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
