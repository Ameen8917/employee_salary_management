import { useEffect, useState } from "react";
import {
  App as AntApp,
  Alert,
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Progress,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import {
  BarChartOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  api,
  type DashboardSummary,
  type DepartmentSalary,
  type SalaryDistribution,
} from "./api/client";
import type { Employee } from "./types";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Finance",
  "Human Resources",
  "Sales",
  "Marketing",
  "Operations",
  "Legal",
];
const COUNTRIES = [
  "India",
  "United States",
  "Canada",
  "Germany",
  "United Kingdom",
];
const STATUSES: Employee["employmentStatus"][] = [
  "active",
  "inactive",
  "on_leave",
  "terminated",
];
const colors: Record<Employee["employmentStatus"], string> = {
  active: "green",
  inactive: "default",
  on_leave: "gold",
  terminated: "red",
};
const money = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
type FormValues = {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  country: string;
  currency: string;
  salary: number;
  hireDate: string;
};

function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [status, setStatus] = useState<Employee["employmentStatus"]>();
  const [salaryMin, setSalaryMin] = useState<number | null>(null);
  const [salaryMax, setSalaryMax] = useState<number | null>(null);
  const [summary, setSummary] = useState<DashboardSummary>();
  const [departmentSalary, setDepartmentSalary] = useState<DepartmentSalary[]>(
    [],
  );
  const [distribution, setDistribution] = useState<SalaryDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [form] = Form.useForm<FormValues>();
  const { message } = AntApp.useApp();
  const employeePage = path === "/employees";
  const navigate = (next: string) => {
    window.history.pushState({}, "", next);
    setPath(next);
    setMobileOpen(false);
  };
  const resetPage = () => setPage(1);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const [a, b, c] = await Promise.all([
          api.getDashboardSummary(),
          api.getSalaryByDepartment(),
          api.getSalaryDistribution(),
        ]);
        setSummary(a);
        setDepartmentSalary(b);
        setDistribution(c);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);
  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        void (async () => {
          try {
            setEmployeeLoading(true);
            const result = await api.getEmployees({
              page,
              limit: employeePage ? 10 : 5,
              search,
              department: employeePage ? department : undefined,
              country: employeePage ? country : undefined,
              employmentStatus: employeePage ? status : undefined,
              salaryMin: employeePage ? (salaryMin ?? undefined) : undefined,
              salaryMax: employeePage ? (salaryMax ?? undefined) : undefined,
            });
            setEmployees(result.employees);
            setTotal(result.pagination.total);
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "Unable to load employees.",
            );
          } finally {
            setEmployeeLoading(false);
          }
        })(),
      250,
    );
    return () => window.clearTimeout(timer);
  }, [
    page,
    search,
    department,
    country,
    status,
    salaryMin,
    salaryMax,
    employeePage,
    refresh,
  ]);

  const columns: TableProps<Employee>["columns"] = [
    {
      title: "Employee",
      render: (_, row) => (
        <Space>
          <Avatar className="bg-emerald-100 text-emerald-800">
            {row.firstName[0]}
            {row.lastName[0]}
          </Avatar>
          <span>
            <b className="block">
              {row.firstName} {row.lastName}
            </b>
            <Text className="text-xs text-slate-500">{row.employeeNumber}</Text>
          </span>
        </Space>
      ),
    },
    { title: "Department", dataIndex: "department", responsive: ["md"] },
    { title: "Country", dataIndex: "country", responsive: ["lg"] },
    {
      title: "Salary",
      align: "right",
      render: (_, row) => <b>{money(row.salary, row.currency)}</b>,
    },
    {
      title: "Status",
      dataIndex: "employmentStatus",
      render: (value: Employee["employmentStatus"]) => (
        <Tag color={colors[value]} className="capitalize">
          {value.replace("_", " ")}
        </Tag>
      ),
    },
  ];
  const submitEmployee = async (values: FormValues) => {
    try {
      await api.createEmployee({
        ...values,
        salary: String(values.salary),
        employmentStatus: "active",
      });
      setFormOpen(false);
      form.resetFields();
      setRefresh((value) => value + 1);
      message.success("Employee created successfully");
    } catch (e) {
      message.error(
        e instanceof Error ? e.message : "Unable to create employee.",
      );
    }
  };
  const maxDepartment = Math.max(
    ...departmentSalary.map((item) => item.averageSalary),
    1,
  );
  const maxDistribution = Math.max(
    ...distribution.map((item) => item.employeeCount),
    1,
  );
  const nav = (
    <>
      <div className="flex h-16 items-center gap-3 px-5 text-white">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-400 font-black text-emerald-950">
          C
        </span>
        {!collapsed && <b className="text-lg">Compense</b>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[employeePage ? "employees" : "overview"]}
        className="mt-6 border-0 bg-transparent"
        onClick={({ key }) =>
          navigate(key === "employees" ? "/employees" : "/")
        }
        items={[
          { key: "overview", icon: <BarChartOutlined />, label: "Overview" },
          { key: "employees", icon: <TeamOutlined />, label: "Employees" },
          {
            key: "analytics",
            icon: <WalletOutlined />,
            label: "Salary analytics",
          },
        ]}
      />
    </>
  );
  const employeeTable = (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={employees}
      loading={employeeLoading}
      scroll={{ x: 680 }}
      pagination={{
        current: page,
        pageSize: employeePage ? 10 : 5,
        total,
        showSizeChanger: false,
        onChange: setPage,
      }}
    />
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={setCollapsed}
        className="relative hidden !bg-[#12372a] lg:block"
      >
        {nav}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-xl border border-emerald-700 bg-emerald-800 text-emerald-100"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </Sider>
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        closable={false}
        styles={{ body: { padding: 0, background: "#12372a" } }}
      >
        {nav}
      </Drawer>
      <Layout>
        <Header className="flex items-center border-b border-slate-200 bg-[#f5f7f5] px-4 sm:px-8">
          <Button
            className="mr-3 lg:hidden"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileOpen(true)}
          />
          <div>
            <Text className="text-xs text-slate-500">
              Compensation workspace
            </Text>
            <Title level={4} className="!m-0">
              {employeePage ? "Employees" : "Salary dashboard"}
            </Title>
          </div>
        </Header>
        <Content className="p-4 sm:p-8">
          <div className="mx-auto max-w-[1440px] space-y-6">
            {error && (
              <Alert
                type="error"
                showIcon
                message="API connection issue"
                description={error}
                closable
                onClose={() => setError("")}
              />
            )}
            {employeePage ? (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <Text className="font-medium text-emerald-700">
                      EMPLOYEE MANAGEMENT
                    </Text>
                    <Title level={2} className="!mb-0">
                      All employees
                    </Title>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setFormOpen(true)}
                  >
                    Add employee
                  </Button>
                </div>
                <Card className="soft-card border-0">
                  <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <Input
                      allowClear
                      prefix={<SearchOutlined />}
                      placeholder="Search name, email or ID"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        resetPage();
                      }}
                    />
                    <Select
                      allowClear
                      placeholder="Department"
                      value={department}
                      onChange={(v) => {
                        setDepartment(v);
                        resetPage();
                      }}
                      options={DEPARTMENTS.map((value) => ({ value }))}
                    />
                    <Select
                      allowClear
                      placeholder="Country"
                      value={country}
                      onChange={(v) => {
                        setCountry(v);
                        resetPage();
                      }}
                      options={COUNTRIES.map((value) => ({ value }))}
                    />
                    <Select
                      allowClear
                      placeholder="Employment status"
                      value={status}
                      onChange={(v) => {
                        setStatus(v);
                        resetPage();
                      }}
                      options={STATUSES.map((value) => ({
                        value,
                        label: value.replace("_", " "),
                      }))}
                    />
                    <InputNumber
                      className="!w-full"
                      min={0}
                      placeholder="Minimum salary"
                      value={salaryMin}
                      onChange={(v) => {
                        setSalaryMin(v);
                        resetPage();
                      }}
                    />
                    <InputNumber
                      className="!w-full"
                      min={0}
                      placeholder="Maximum salary"
                      value={salaryMax}
                      onChange={(v) => {
                        setSalaryMax(v);
                        resetPage();
                      }}
                    />
                  </div>
                  {employeeTable}
                </Card>
              </>
            ) : (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <Text className="font-medium text-emerald-700">
                      LIVE DATA
                    </Text>
                    <Title level={2} className="!mb-0">
                      Salary dashboard
                    </Title>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setFormOpen(true)}
                  >
                    Add employee
                  </Button>
                </div>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Card>
                    <Statistic
                      title="Total employees"
                      value={summary?.totalEmployees ?? "—"}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                  <Card>
                    <Statistic
                      title="Average salary"
                      value={summary ? money(summary.averageSalary) : "—"}
                      prefix={<WalletOutlined />}
                    />
                  </Card>
                  <Card>
                    <Statistic
                      title="Highest salary"
                      value={summary ? money(summary.highestSalary) : "—"}
                      prefix={<BarChartOutlined />}
                    />
                  </Card>
                  <Card>
                    <Statistic
                      title="Departments"
                      value={summary?.departments ?? "—"}
                      prefix={<GlobalOutlined />}
                    />
                  </Card>
                </section>
                <section className="grid gap-6 xl:grid-cols-5">
                  <Card
                    className="soft-card border-0 xl:col-span-3"
                    title="Employees"
                    extra={
                      <Button
                        type="link"
                        onClick={() => navigate("/employees")}
                      >
                        View all employees
                      </Button>
                    }
                  >
                    <div className="mb-4">
                      <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        placeholder="Search name, email or employee ID"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          resetPage();
                        }}
                      />
                    </div>
                    {employeeTable}
                  </Card>
                  <Card
                    className="soft-card border-0 xl:col-span-2"
                    title="Employees by country"
                    loading={loading}
                  >
                    {summary?.employeesByCountry.map((item) => (
                      <div key={item.country} className="mb-4">
                        <div className="flex justify-between">
                          <b>{item.country}</b>
                          <Text>{item.count.toLocaleString()}</Text>
                        </div>
                        <Progress
                          percent={Math.round(
                            (item.count / Math.max(summary.totalEmployees, 1)) *
                              100,
                          )}
                          showInfo={false}
                          strokeColor="#2f8c6c"
                        />
                      </div>
                    ))}
                  </Card>
                </section>
                <section className="grid gap-6 lg:grid-cols-2">
                  <Card title="Average salary by department" loading={loading}>
                    {departmentSalary.map((item) => (
                      <div key={item.department} className="mb-4">
                        <div className="flex justify-between">
                          <span>{item.department}</span>
                          <b>{money(item.averageSalary)}</b>
                        </div>
                        <Progress
                          percent={Math.round(
                            (item.averageSalary / maxDepartment) * 100,
                          )}
                          showInfo={false}
                          strokeColor="#d99830"
                        />
                      </div>
                    ))}
                  </Card>
                  <Card title="Salary distribution" loading={loading}>
                    <div className="grid grid-cols-4 items-end gap-3">
                      {distribution.map((item, index) => (
                        <div
                          key={item.range}
                          className="flex h-48 flex-col justify-end gap-2"
                        >
                          <div
                            className={
                              [
                                "bg-emerald-200",
                                "bg-emerald-300",
                                "bg-emerald-500",
                                "bg-[#12372a]",
                              ][index]
                            }
                            style={{
                              height: `${Math.max(8, (item.employeeCount / maxDistribution) * 100)}%`,
                            }}
                          />
                          <Text className="text-center text-xs">
                            {item.range}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </Card>
                </section>
              </>
            )}
          </div>
        </Content>
      </Layout>
      <Drawer
        title="Add employee"
        open={formOpen}
        onClose={() => setFormOpen(false)}
        extra={
          <Button type="primary" onClick={() => form.submit()}>
            Save employee
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitEmployee}
          initialValues={{
            department: "Engineering",
            country: "India",
            currency: "INR",
            salary: 800000,
            hireDate: "2024-01-01",
          }}
        >
          <div className="grid grid-cols-2 gap-x-3">
            <Form.Item
              name="firstName"
              label="First name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            name="employeeNumber"
            label="Employee number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Work email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true }]}
          >
            <Select options={DEPARTMENTS.map((value) => ({ value }))} />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true }]}
          >
            <Select options={COUNTRIES.map((value) => ({ value }))} />
          </Form.Item>
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, len: 3 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Annual salary"
            rules={[{ required: true }]}
          >
            <InputNumber className="!w-full" min={0} />
          </Form.Item>
          <Form.Item
            name="hireDate"
            label="Hire date"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Drawer>
    </Layout>
  );
}

export default function RootApp() {
  return (
    <ConfigProvider>
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  );
}
