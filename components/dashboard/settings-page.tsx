"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Shield, AlertTriangle, Bell, Lock, Globe, Database } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Settings & Compliance</h1>
        <p className="text-sm text-muted-foreground">Platform configuration, compliance rules, and system settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <CardTitle className="text-sm font-medium text-foreground">Compliance Rules</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">Configure KYC, AML, and regulatory compliance settings.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">Mandatory KYC</Label>
                <span className="text-xs text-muted-foreground">Require KYC verification for all users</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">AML Screening</Label>
                <span className="text-xs text-muted-foreground">Auto-screen transactions against sanctions lists</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">Transaction Limits</Label>
                <span className="text-xs text-muted-foreground">Enable daily/monthly transaction limits</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">Max Daily Borrow Limit</Label>
              <Input defaultValue="5,000,000" className="bg-secondary border-border text-foreground" />
              <span className="text-xs text-muted-foreground">In Naira equivalent per user</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning" />
              <CardTitle className="text-sm font-medium text-foreground">Risk Parameters</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">Manage liquidation thresholds and risk limits.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">Max LTV Ratio</Label>
              <Input defaultValue="80" className="bg-secondary border-border text-foreground" />
              <span className="text-xs text-muted-foreground">Percentage - loans above this trigger alerts</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">Liquidation Threshold</Label>
              <Input defaultValue="90" className="bg-secondary border-border text-foreground" />
              <span className="text-xs text-muted-foreground">Percentage - auto-liquidation trigger point</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">Min Collateral Coverage</Label>
              <Input defaultValue="150" className="bg-secondary border-border text-foreground" />
              <span className="text-xs text-muted-foreground">Percentage - minimum required collateral</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">Auto Liquidation</Label>
                <span className="text-xs text-muted-foreground">Automatically liquidate under-collateralized loans</span>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              <CardTitle className="text-sm font-medium text-foreground">Notifications</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">Configure alert preferences for admin team.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">High-Value Transactions</Label>
                <span className="text-xs text-muted-foreground">Alert on transactions above $10,000</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">Failed Transactions</Label>
                <span className="text-xs text-muted-foreground">Notify on consecutive failed transactions</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">Loan Default Alerts</Label>
                <span className="text-xs text-muted-foreground">Immediate alert on loan defaults</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm text-foreground">System Health Alerts</Label>
                <span className="text-xs text-muted-foreground">Alert when system health drops below 95%</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="size-4 text-primary" />
              <CardTitle className="text-sm font-medium text-foreground">System Status</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">Platform infrastructure and service health.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { service: "API Gateway", status: "operational", latency: "45ms" },
              { service: "Database Cluster", status: "operational", latency: "12ms" },
              { service: "Blockchain Node", status: "operational", latency: "180ms" },
              { service: "KYC Provider", status: "degraded", latency: "850ms" },
              { service: "Price Oracle", status: "operational", latency: "25ms" },
              { service: "Email Service", status: "operational", latency: "200ms" },
            ].map((item) => (
              <div key={item.service} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${
                      item.status === "operational" ? "bg-success" : "bg-warning"
                    }`}
                  />
                  <span className="text-sm text-foreground">{item.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{item.latency}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      item.status === "operational"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        <Button variant="outline" className="border-border bg-secondary text-foreground">Reset to Defaults</Button>
      </div>
    </div>
  )
}
