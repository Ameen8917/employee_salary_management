import { useMemo, useState } from "react";
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Drawer,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu,
  Progress,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  type TableProps,
} from "antd";
import {
  BarChartOutlined,
  BellOutlined,
  DownOutlined,
  GlobalOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { countryStats, departmentStats, employees as initialEmployees } from "./data/mockData";
import type { Employee } from "./types";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const statusColors: Record<Employee["employmentStatus"], string> = {
  active: "green", inactive: "default", on_leave: "gold", terminated: "red",
};

const formatCurrency = (value: number, currency = "INR") => new Intl.NumberFormat("en-IN", {
  style: "currency", currency, maximumFractionDigits: 0,
}).format(value);

function StatCard({ title, value, prefix, helper, accent }: { title: string; value: string | number; prefix?: React.ReactNode; helper: string; accent: string }) {
  return (
    <Card className="soft-card border-0" styles={{ body: { padding: 20 } }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Text className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</Text>
          <Statistic value={value} prefix={prefix} valueStyle={{ fontSize: 26, color: "#17332a", fontWeight: 700, marginTop: 7 }} />
          <Text className="text-xs text-slate-500">{helper}</Text>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${accent}`}>{prefix}</span>
      </div>
    </Card>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [employeeRows, setEmployeeRows] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string | undefined>();
  const [country, setCountry] = useState<string | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm<Employee>();
  const { message } = AntApp.useApp();

  const filteredEmployees = useMemo(() => employeeRows.filter((employee) => {
    const text = `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.employeeNumber}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase()))
      && (!department || employee.department === department)
      && (!country || employee.country === country);
  }), [employeeRows, search, department, country]);

  const columns: TableProps<Employee>["columns"] = [
    {
      title: "Employee", dataIndex: "firstName", sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      render: (_, employee) => <Space size={10}><Avatar className="bg-emerald-100 text-emerald-800">{employee.firstName[0]}{employee.lastName[0]}</Avatar><span><b className="block text-slate-800">{employee.firstName} {employee.lastName}</b><Text className="text-xs text-slate-500">{employee.employeeNumber}</Text></span></Space>,
    },
    { title: "Department", dataIndex: "department", responsive: ["md"] },
    { title: "Country", dataIndex: "country", responsive: ["lg"] },
    { title: "Salary", dataIndex: "salary", sorter: (a, b) => a.salary - b.salary, align: "right", render: (salary, employee) => <b>{formatCurrency(salary, employee.currency)}</b> },
    { title: "Status", dataIndex: "employmentStatus", render: (status: Employee["employmentStatus"]) => <Tag color={statusColors[status]} className="m-0 capitalize">{status.replace("_", " ")}</Tag> },
  ];

  const addEmployee = (values: Employee) => {
    setEmployeeRows((rows) => [{ ...values, id: Date.now(), employeeNumber: `EMP${String(rows.length + 1000).padStart(6, "0")}`, employmentStatus: "active", currency: "INR" }, ...rows]);
    form.resetFields();
    setDrawerOpen(false);
    message.success("Employee added to the local preview");
  };

  const navItems = [
    { key: "overview", icon: <BarChartOutlined />, label: "Overview" },
    { key: "employees", icon: <TeamOutlined />, label: "Employees" },
    { key: "analytics", icon: <WalletOutlined />, label: "Salary analytics" },
  ];

  const sidebar = <>
    <div className="flex h-16 items-center gap-3 px-5 text-white"><span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-400 font-black text-emerald-950">C</span>{!collapsed && <b className="text-lg tracking-tight">Compense</b>}</div>
    <div className="px-3 pt-6"><Text className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/70">Workspace</Text></div>
    <Menu theme="dark" mode="inline" selectedKeys={[activeSection]} items={navItems} className="mt-2 border-0 bg-transparent" onClick={({ key }) => { setActiveSection(key); setMobileMenu(false); }} />
    {!collapsed && <div className="mx-4 mt-auto mb-5 rounded-2xl bg-emerald-800/70 p-4 text-emerald-50"><Text className="block text-xs font-semibold text-emerald-50">Salary insights</Text><Text className="mt-1 block text-xs leading-5 text-emerald-100/70">A clear view of your team’s compensation.</Text></div>}
  </>;

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} breakpoint="lg" collapsed={collapsed} onCollapse={setCollapsed} className="relative hidden !bg-[#12372a] lg:block">
        {sidebar}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          className="absolute bottom-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-xl border border-emerald-700 bg-emerald-800 text-emerald-100 transition hover:bg-emerald-700 hover:text-white"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </Sider>
      <Drawer placement="left" open={mobileMenu} onClose={() => setMobileMenu(false)} closable={false} width={250} styles={{ body: { padding: 0, display: "flex", flexDirection: "column", background: "#12372a" } }}>{sidebar}</Drawer>
      <Layout>
        <Header className="flex h-16 items-center justify-between border-b border-slate-200 bg-[#f5f7f5] px-4 sm:px-8">
          <div className="flex items-center gap-3"><Button className="lg:hidden" type="text" icon={<MenuOutlined />} onClick={() => setMobileMenu(true)} /><div><Text className="text-xs text-slate-500">Wednesday, 11 July</Text><Title level={4} className="!m-0 !text-[#17332a]">Good morning, Olivia</Title></div></div>
          <Space size="middle"><Tooltip title="Notifications"><Button type="text" icon={<BellOutlined />} /></Tooltip><Dropdown menu={{ items: [{ key: "profile", label: "HR Manager" }, { key: "settings", label: "Settings" }] }}><Button type="text"><Space><Avatar size="small" className="bg-emerald-700">OM</Avatar><span className="hidden sm:inline">Olivia Martin</span><DownOutlined className="text-xs" /></Space></Button></Dropdown></Space>
        </Header>
        <Content className="p-4 sm:p-8">
          <div className="mx-auto max-w-[1440px] space-y-6">
            <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div><Text className="font-medium text-emerald-700">COMPENSATION OVERVIEW</Text><Title level={2} className="!mb-1 !mt-1 !text-[#17332a]">Salary dashboard</Title><Text className="text-slate-500">Monitor pay trends and employee records in one place.</Text></div>
              <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>Add employee</Button>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total employees" value="10,000" prefix={<TeamOutlined />} helper="Across 5 countries" accent="bg-emerald-100 text-emerald-700" />
              <StatCard title="Average salary" value="₹12.6L" prefix={<WalletOutlined />} helper="Current annual compensation" accent="bg-amber-100 text-amber-700" />
              <StatCard title="Highest salary" value="₹16.2L" prefix={<BarChartOutlined />} helper="Highest recorded package" accent="bg-blue-100 text-blue-700" />
              <StatCard title="Countries" value="5" prefix={<GlobalOutlined />} helper="Distributed workforce" accent="bg-violet-100 text-violet-700" />
            </section>

            <section className="grid gap-6 xl:grid-cols-5">
              <Card className="soft-card border-0 xl:col-span-3" title={<span className="text-base font-semibold text-[#17332a]">Employees</span>} extra={<Button type="link" onClick={() => setActiveSection("employees")}>View all</Button>}>
                <div className="mb-4 flex flex-col gap-3 md:flex-row"><Input allowClear prefix={<SearchOutlined className="text-slate-400" />} placeholder="Search name, email or employee ID" value={search} onChange={(event) => setSearch(event.target.value)} /><Select allowClear placeholder="Department" className="md:w-44" value={department} onChange={setDepartment} options={[...new Set(employeeRows.map((employee) => employee.department))].map((value) => ({ value }))} /><Select allowClear placeholder="Country" className="md:w-44" value={country} onChange={setCountry} options={[...new Set(employeeRows.map((employee) => employee.country))].map((value) => ({ value }))} /></div>
                <Table rowKey="id" columns={columns} dataSource={filteredEmployees} size="middle" scroll={{ x: 680 }} pagination={{ pageSize: 5, showSizeChanger: false, showTotal: (total) => `${total} employees` }} />
              </Card>
              <Card className="soft-card border-0 xl:col-span-2" title={<span className="text-base font-semibold text-[#17332a]">Employees by country</span>}>
                <div className="space-y-5">{countryStats.map((item) => <div key={item.name}><div className="mb-2 flex justify-between text-sm"><b>{item.name}</b><Text>{item.count.toLocaleString()}</Text></div><Progress className="salary-bar" percent={item.share} showInfo={false} strokeColor="#2f8c6c" /></div>)}</div>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="soft-card border-0" title={<span className="text-base font-semibold text-[#17332a]">Average salary by department</span>} extra={<Text className="text-xs text-slate-500">Annual average</Text>}>
                <div className="space-y-5">{departmentStats.map((item) => <div key={item.name}><div className="mb-2 flex justify-between"><span className="font-medium">{item.name}</span><b>{formatCurrency(item.average)}</b></div><Progress className="salary-bar" percent={item.share} showInfo={false} strokeColor="#d99830" /></div>)}</div>
              </Card>
              <Card className="soft-card border-0" title={<span className="text-base font-semibold text-[#17332a]">Salary distribution</span>}>
                <div className="grid h-full grid-cols-4 items-end gap-3 pt-3"><div className="flex h-48 flex-col justify-end gap-2"><div className="rounded-t-xl bg-emerald-200" style={{ height: "31%" }} /><Text className="text-center text-xs">&lt; ₹5L</Text></div><div className="flex h-48 flex-col justify-end gap-2"><div className="rounded-t-xl bg-emerald-300" style={{ height: "58%" }} /><Text className="text-center text-xs">₹5–10L</Text></div><div className="flex h-48 flex-col justify-end gap-2"><div className="rounded-t-xl bg-emerald-500" style={{ height: "82%" }} /><Text className="text-center text-xs">₹10–15L</Text></div><div className="flex h-48 flex-col justify-end gap-2"><div className="rounded-t-xl bg-[#12372a]" style={{ height: "47%" }} /><Text className="text-center text-xs">₹15L+</Text></div></div>
              </Card>
            </section>
          </div>
        </Content>
      </Layout>
      <Drawer title="Add employee" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={440} extra={<Button type="primary" onClick={() => form.submit()}>Save employee</Button>}>
        <Form form={form} layout="vertical" onFinish={addEmployee} initialValues={{ department: "Engineering", country: "India", salary: 800000, hireDate: "2024-01-01" }}>
          <div className="grid grid-cols-2 gap-x-3"><Form.Item name="firstName" label="First name" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="lastName" label="Last name" rules={[{ required: true }]}><Input /></Form.Item></div>
          <Form.Item name="email" label="Work email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}><Select options={["Engineering", "Product", "Finance", "Human Resources", "Sales"].map((value) => ({ value }))} /></Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}><Select options={["India", "United States", "Canada", "Germany", "United Kingdom"].map((value) => ({ value }))} /></Form.Item>
          <Form.Item name="salary" label="Annual salary" rules={[{ required: true }]}><Input type="number" prefix="₹" /></Form.Item>
          <Form.Item name="hireDate" label="Hire date" rules={[{ required: true }]}><Input type="date" /></Form.Item>
        </Form>
      </Drawer>
    </Layout>
  );
}

export default function RootApp() {
  return <ConfigProvider><AntApp><App /></AntApp></ConfigProvider>;
}
