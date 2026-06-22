"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Shield, AlertTriangle, Bell, Info } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Settings & Compliance</h1>
        <p className="text-sm text-muted-foreground">Platform configuration, compliance rules, and system settings.</p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
        <Info className="mt-0.5 size-4 shrink-0 text-warning" />
        <p className="text-xs text-muted-foreground">
          Settings persistence is not yet available — the backend does not expose
          read/write endpoints for configuration. The controls below show defaults
          and will be wired once <span className="font-mono">GET/PATCH /admin/settings</span> ships.
        </p>
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
              <Shield className="size-4 text-primary" />
              <CardTitle className="text-sm font-medium text-foreground">System Status</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">Platform infrastructure and service health.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Info className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">System health metrics are not available.</p>
            <p className="text-xs text-muted-foreground">
              The backend does not expose a system-health endpoint yet.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        <Button variant="outline" disabled className="border-border bg-secondary text-foreground">Reset to Defaults</Button>
        <span className="text-xs text-muted-foreground">Saving is disabled until settings endpoints are available.</span>
      </div>
    </div>
  )
}
