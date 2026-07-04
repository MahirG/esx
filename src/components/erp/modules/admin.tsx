"use client";

import { useState } from "react";
import {
  Settings,
  Users,
  Shield,
  Building2,
  Plug,
  Cloud,
  Server,
  Container,
  Key,
  Lock,
  Fingerprint,
  Clock,
  Check,
  Copy,
  Terminal,
  Database,
  Globe,
  Download,
  Loader2,
  Plus,
} from "lucide-react";
import { KPICard } from "@/components/erp/ui/kpi-card";
import { ChartCard } from "@/components/erp/ui/chart-card";
import { StatusBadge } from "@/components/erp/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/lib/use-translation";
import { useSystemUsers, useDeleteUser } from "@/lib/api-hooks";
import { UserForm } from "@/components/erp/forms/entity-forms";
import { ConfirmDialog } from "@/components/erp/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const organizationInfo = {
  name: "Addis Trading Enterprise",
  tin: "0009847263",
  vatNumber: "0009847263",
  address: "Bole Road, Friendship Building, Addis Ababa, Ethiopia",
  currency: "ETB (Ethiopian Birr)",
  timezone: "Africa/Addis_Ababa (UTC+3)",
  language: "English (Default) + Amharic",
  fiscalYearStart: "July 7 (Ethiopian New Year)",
};

const integrationsData = [
  { name: "Dashen Bank API", type: "Banking", status: "connected", lastSync: "2 min ago" },
  { name: "Commercial Bank of Ethiopia", type: "Banking", status: "connected", lastSync: "5 min ago" },
  { name: "Awash Bank", type: "Banking", status: "connected", lastSync: "12 min ago" },
  { name: "Telebirr", type: "Mobile Money", status: "connected", lastSync: "1 min ago" },
  { name: "Amole", type: "Mobile Money", status: "connected", lastSync: "8 min ago" },
  { name: "ERCA e-Filing", type: "Government", status: "connected", lastSync: "1 hour ago" },
  { name: "Ethio Post", type: "Logistics", status: "pending", lastSync: "Never" },
  { name: "Ethio Telecom SMS", type: "Communication", status: "connected", lastSync: "30 min ago" },
];

export function AdminModule() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("users");
  const [userModal, setUserModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const deleteUser = useDeleteUser();
  const [copied, setCopied] = useState(false);

  const { data: users, isLoading } = useSystemUsers();

  const deploymentSteps = [
    {
      title: "Option 1: Cloud Deployment (AWS)",
      icon: <Cloud className="h-5 w-5" />,
      steps: [
        "Install AWS CLI: curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip && unzip awscliv2.zip && sudo ./aws/install",
        "Configure credentials: aws configure",
        "Build Docker image: docker build -t addis-erp:latest .",
        "Push to ECR: aws ecr create-repository --repository-name addis-erp",
        "Deploy to ECS/Fargate: aws ecs create-cluster --cluster-name addis-erp-prod",
        "Set up RDS PostgreSQL: aws rds create-db-instance --db-instance-identifier addis-erp-db",
        "Configure Application Load Balancer and Route53 DNS",
      ],
    },
    {
      title: "Option 2: On-Premise Server",
      icon: <Server className="h-5 w-5" />,
      steps: [
        "Install Node.js 20+: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -",
        "Install PostgreSQL 15: sudo apt install postgresql postgresql-contrib",
        "Clone repository: git clone https://github.com/addis-erp/suite.git",
        "Install dependencies: cd addis-erp && npm install",
        "Set environment variables: cp .env.example .env && nano .env",
        "Run database migrations: npx prisma migrate deploy",
        "Build and start: npm run build && npm start",
        "Set up Nginx reverse proxy and SSL with Let's Encrypt",
      ],
    },
    {
      title: "Option 3: Docker Container",
      icon: <Container className="h-5 w-5" />,
      steps: [
        "Install Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh",
        "Pull image: docker pull addiserp/suite:latest",
        "Create network: docker network create addis-erp-net",
        "Start PostgreSQL: docker run -d --name addis-db --network addis-erp-net -e POSTGRES_PASSWORD=secure addiserp/db:latest",
        "Start ERP: docker run -d --name addis-erp --network addis-erp-net -p 3000:3000 -e DATABASE_URL=postgresql://... addiserp/suite:latest",
        "Or use Docker Compose: docker-compose up -d",
      ],
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <UserForm open={userModal} onClose={() => setUserModal(false)} />
      <ConfirmDialog
        open={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={() => {
          if (deleteUserId) {
            deleteUser.mutate(deleteUserId, { onSuccess: () => setDeleteUserId(null) });
          }
        }}
        title="Delete User?"
        description="This will permanently delete the user account. They will no longer be able to access the system."
        isPending={deleteUser.isPending}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title="System Users"
          value={(users?.length || 0).toString()}
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="emerald"
          subtitle={`${users?.filter((u: { status: string }) => u.status === "online").length || 0} online now`}
        />
        <KPICard
          title="Active Integrations"
          value={integrationsData.filter((i) => i.status === "connected").length.toString()}
          icon={<Plug className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="deep"
          subtitle={`${integrationsData.length} total configured`}
        />
        <KPICard
          title="Security Score"
          value="A+"
          icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="amber"
          subtitle="2FA + Biometric active"
        />
        <KPICard
          title="System Uptime"
          value="99.98%"
          icon={<Cloud className="h-5 w-5 sm:h-6 sm:w-6" />}
          accent="terracotta"
          subtitle="Last 30 days"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="users" className="text-xs sm:text-sm py-2">{t.admin.users}</TabsTrigger>
          <TabsTrigger value="roles" className="text-xs sm:text-sm py-2">{t.admin.roles}</TabsTrigger>
          <TabsTrigger value="organization" className="text-xs sm:text-sm py-2">{t.admin.organization}</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs sm:text-sm py-2">{t.admin.integrations}</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm py-2">{t.admin.security}</TabsTrigger>
          <TabsTrigger value="deployment" className="text-xs sm:text-sm py-2">{t.admin.deployment}</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <ChartCard
            title={t.admin.users}
            subtitle={`${users?.length || 0} users with role-based access`}
            action={<Button size="sm" className="gradient-emerald text-white" onClick={() => setUserModal(true)}><Plus className="h-4 w-4 mr-1.5" />{t.admin.addUser}</Button>}
          >
            {isLoading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t.admin.userName}</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Email</TableHead>
                      <TableHead className="text-xs">{t.admin.role}</TableHead>
                      <TableHead className="text-xs">2FA</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">{t.admin.lastActive}</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user: { id: string; name: string; email: string; role: string; avatar: string; twoFactor: boolean; status: string; lastActive: string }) => (
                      <TableRow key={user.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full gradient-emerald flex items-center justify-center text-white text-xs font-bold shrink-0 relative">
                              {user.avatar}
                              {user.status === "online" && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />
                              )}
                            </div>
                            <span className="text-sm font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-block text-xs font-medium px-2 py-0.5 rounded-md capitalize",
                            user.role === "admin" && "bg-primary/10 text-primary",
                            user.role === "manager" && "bg-[oklch(0.40_0.10_162)]/10 text-[oklch(0.40_0.10_162)]",
                            user.role === "staff" && "bg-muted text-muted-foreground"
                          )}>
                            {t.login[user.role as "admin" | "manager" | "staff"]}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.twoFactor ? (
                            <span className="inline-flex items-center gap-1 text-xs text-primary"><Check className="h-3 w-3" />Enabled</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Disabled</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs hidden md:table-cell text-muted-foreground">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </TableCell>
                        <TableCell><StatusBadge status={user.status as "online" | "offline" | "away"} /></TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-destructive h-7"
                            onClick={() => setDeleteUserId(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ChartCard>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                role: "Administrator",
                color: "emerald",
                users: users?.filter((u: { role: string }) => u.role === "admin").length || 0,
                permissions: ["Full system access", "User management", "All modules", "Compliance & audit", "System settings", "API keys"],
              },
              {
                role: "Manager",
                color: "deep",
                users: users?.filter((u: { role: string }) => u.role === "manager").length || 0,
                permissions: ["Finance module", "Inventory module", "HR & Payroll", "Sales & CRM", "Reports (read)", "Limited compliance"],
              },
              {
                role: "Staff",
                color: "terracotta",
                users: users?.filter((u: { role: string }) => u.role === "staff").length || 0,
                permissions: ["Sales & CRM", "Inventory (own warehouse)", "Own profile", "Limited reports", "No compliance access"],
              },
            ].map((role) => (
              <Card key={role.role} className="border-border/60 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center",
                      role.color === "emerald" && "bg-primary/10 text-primary",
                      role.color === "deep" && "bg-[oklch(0.40_0.10_162)]/10 text-[oklch(0.40_0.10_162)]",
                      role.color === "terracotta" && "bg-[oklch(0.60_0.10_35)]/10 text-[oklch(0.60_0.10_35)]"
                    )}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{role.users} users</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{role.role}</p>
                  <div className="mt-4 space-y-2">
                    {role.permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-primary shrink-0" />
                        <span className="text-muted-foreground">{perm}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization">
          <ChartCard title={t.admin.organization} subtitle="Business registration details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.organizationName}</Label>
                  <Input value={organizationInfo.name} readOnly className="mt-1 bg-muted/30" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.tin}</Label>
                  <Input value={organizationInfo.tin} readOnly className="mt-1 bg-muted/30 font-mono" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.vatNumber}</Label>
                  <Input value={organizationInfo.vatNumber} readOnly className="mt-1 bg-muted/30 font-mono" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.address}</Label>
                  <Input value={organizationInfo.address} readOnly className="mt-1 bg-muted/30" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.currency}</Label>
                  <Input value={organizationInfo.currency} readOnly className="mt-1 bg-muted/30" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.timezone}</Label>
                  <Input value={organizationInfo.timezone} readOnly className="mt-1 bg-muted/30" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.language}</Label>
                  <Input value={organizationInfo.language} readOnly className="mt-1 bg-muted/30" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fiscal Year Start</Label>
                  <Input value={organizationInfo.fiscalYearStart} readOnly className="mt-1 bg-muted/30" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button className="gradient-emerald text-white">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </ChartCard>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationsData.map((integration) => (
              <Card key={integration.name} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {integration.type === "Banking" && <Building2 className="h-5 w-5" />}
                      {integration.type === "Mobile Money" && <Globe className="h-5 w-5" />}
                      {integration.type === "Government" && <Shield className="h-5 w-5" />}
                      {integration.type === "Logistics" && <Container className="h-5 w-5" />}
                      {integration.type === "Communication" && <Plug className="h-5 w-5" />}
                    </div>
                    <StatusBadge status={integration.status as "connected" | "pending"} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{integration.type}</p>
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground">Last sync</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{integration.lastSync}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <ChartCard title={t.admin.security} subtitle="Authentication and access control settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.admin.twoFactorRequired}</p>
                    <p className="text-xs text-muted-foreground">All users must enable 2FA</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Fingerprint className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.admin.biometricEnabled}</p>
                    <p className="text-xs text-muted-foreground">Fingerprint & face recognition</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.admin.sessionTimeout}</p>
                    <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                </div>
                <Input type="number" defaultValue={30} className="w-20" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.admin.apiKeys}</p>
                    <p className="text-xs text-muted-foreground">Manage API access tokens</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage Keys</Button>
              </div>
            </div>
          </ChartCard>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5 flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Security Best Practices Active</p>
                <p className="text-xs text-muted-foreground mt-1">
                  256-bit AES encryption • ISO 27001 certified • Ethiopian data residency •
                  Regular security audits • OWASP Top 10 protected
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl gradient-emerald flex items-center justify-center text-white">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.admin.deploymentInstructions}</p>
                  <p className="text-xs text-muted-foreground">Cloud, on-premise, and Docker deployment guides</p>
                </div>
              </div>

              <div className="space-y-6">
                {deploymentSteps.map((option, idx) => (
                  <div key={idx} className="border border-border/60 rounded-xl overflow-hidden">
                    <div className="bg-muted/30 p-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {option.icon}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{option.title}</p>
                    </div>
                    <div className="p-4 space-y-2">
                      {option.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3 group">
                          <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <code className="text-xs font-mono text-foreground/90 break-all flex-1 bg-muted/40 px-2 py-1 rounded">
                            {step}
                          </code>
                          <button
                            onClick={() => copyToClipboard(step)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary shrink-0 mt-1"
                          >
                            {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5 text-center">
                <Database className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-semibold">Database Setup</p>
                <p className="text-xs text-muted-foreground mt-1">PostgreSQL 15+ recommended</p>
                <Button variant="outline" size="sm" className="mt-3 text-xs">
                  <Download className="h-3 w-3 mr-1" />DB Guide
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5 text-center">
                <Globe className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-semibold">Domain & SSL</p>
                <p className="text-xs text-muted-foreground mt-1">Nginx + Let's Encrypt</p>
                <Button variant="outline" size="sm" className="mt-3 text-xs">
                  <Download className="h-3 w-3 mr-1" />SSL Guide
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5 text-center">
                <Server className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-semibold">Backup & Recovery</p>
                <p className="text-xs text-muted-foreground mt-1">Automated daily backups</p>
                <Button variant="outline" size="sm" className="mt-3 text-xs">
                  <Download className="h-3 w-3 mr-1" />Backup Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
