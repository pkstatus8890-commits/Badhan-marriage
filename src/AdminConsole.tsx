import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity, BadgeCheck, BookOpen, Check, CreditCard, Flag, LayoutDashboard,
  ListFilter, LogOut, MessageCircle, ShieldCheck, Users, X,
} from "lucide-react";
import {
  adminLogin, adminLogout, getAdminDashboard, getAdminData, getAdminSession, runAdminAction,
} from "@workspace/api-client-react";

type Lang = "en" | "hi";
type Row = Record<string, any>;
const tr = (lang: Lang, en: string, hi: string) => lang === "hi" ? hi : en;
const rows = (value: unknown): Row[] => Array.isArray(value) ? value as Row[] : [];
const str = (value: unknown) => value == null ? "" : String(value);
const date = (value: unknown) => value ? new Date(String(value)).toLocaleDateString() : "—";

const sections = [
  ["Overview", LayoutDashboard], ["Users", Users], ["Profiles", BadgeCheck],
  ["Requests", MessageCircle], ["Chats", MessageCircle], ["Plans", CreditCard],
  ["Subscriptions", CreditCard], ["Payments", CreditCard], ["Communities", ListFilter],
  ["Courses", BookOpen], ["Reports", Flag], ["Settings", ShieldCheck], ["Activity", Activity],
] as const;

export default function AdminConsole({ lang }: { lang: Lang }) {
  const [section, setSection] = useState<string>("Overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [communityType, setCommunityType] = useState("Caste");
  const qc = useQueryClient();
  const session = useQuery({ queryKey: ["admin-session"], queryFn: () => getAdminSession(), retry: false });
  const dashboard = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => getAdminDashboard(), enabled: !!session.data, retry: false });
  const data = useQuery({ queryKey: ["admin-data"], queryFn: () => getAdminData(), enabled: !!session.data, retry: false });
  const login = useMutation({
    mutationFn: () => adminLogin({ email, password }),
    onSuccess: async () => { setError(""); await qc.invalidateQueries({ queryKey: ["admin-session"] }); },
    onError: (e) => setError(errorText(e)),
  });
  const logout = useMutation({
    mutationFn: () => adminLogout(),
    onSuccess: async () => { qc.removeQueries({ queryKey: ["admin-session"] }); qc.removeQueries({ queryKey: ["admin-dashboard"] }); qc.removeQueries({ queryKey: ["admin-data"] }); },
  });
  const action = useMutation({
    mutationFn: (input: { action: string; payload: Row }) => runAdminAction(input),
    onSuccess: async () => { setNotice(tr(lang, "Saved successfully.", "सफलतापूर्वक सहेजा गया।")); setError(""); await qc.invalidateQueries({ queryKey: ["admin-data"] }); await qc.invalidateQueries({ queryKey: ["admin-dashboard"] }); },
    onError: (e) => { setNotice(""); setError(errorText(e)); },
  });
  const doAction = (name: string, payload: Row) => action.mutate({ action: name, payload });
  const result = data.data as unknown as Row | undefined;
  const users = rows(result?.users);
  const communities = rows(result?.communities);
  const plans = rows(result?.plans);
  const subscriptions = rows(result?.subscriptions);
  const payments = rows(result?.payments);
  const requests = rows(result?.requests);
  const conversations = rows(result?.conversations);
  const reports = rows(result?.reports);
  const courses = rows(result?.courses);
  const activity = rows(result?.activity);
  const settings = rows(result?.settings);

  if (session.isLoading) return <AdminShell><div className="panel p-8 text-center">Loading secure admin session…</div></AdminShell>;
  if (!session.data) return (
    <AdminShell>
      <div className="panel mx-auto max-w-md p-8">
        <div className="mb-6 flex items-center gap-3"><div className="brand-mark"><ShieldCheck size={19} /></div><div><p className="eyebrow">{tr(lang, "Secure access", "सुरक्षित प्रवेश")}</p><h1 className="serif text-2xl font-semibold">{tr(lang, "Administrator sign in", "एडमिन साइन इन")}</h1></div></div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); login.mutate(); }}>
          <Field label={tr(lang, "Email", "ईमेल")}><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label={tr(lang, "Password", "पासवर्ड")}><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}
          <button className="btn btn-primary w-full" disabled={login.isPending}>{login.isPending ? tr(lang, "Signing in…", "साइन इन हो रहा है…") : tr(lang, "Sign in", "साइन इन")}</button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">{tr(lang, "Administrator credentials are configured securely in workspace secrets.", "एडमिन लॉगिन सुरक्षित workspace configuration से नियंत्रित होता है।")}</p>
      </div>
    </AdminShell>
  );

  const dashboardData = dashboard.data as unknown as Row | undefined;
  const countCards = dashboardData ? Object.entries(dashboardData).filter(([, v]) => typeof v === "number") : [];

  return (
    <div className="app-shell min-h-screen">
      <header className="topbar flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3"><div className="brand-mark"><ShieldCheck size={19} /></div><div><p className="eyebrow">{tr(lang, "Administration", "प्रशासन")}</p><strong className="serif text-lg">बंधन मैरिज</strong></div></div>
        <div className="flex items-center gap-2"><span className="hidden text-sm text-muted-foreground md:inline">{session.data.email}</span><button className="btn btn-quiet" onClick={() => logout.mutate()}><LogOut size={15} />{tr(lang, "Sign out", "साइन आउट")}</button></div>
      </header>
      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 md:grid-cols-[220px_1fr] md:px-7">
        <aside className="panel h-fit p-2">
          {sections.map(([name, Icon]) => <button key={name} onClick={() => setSection(name)} className={`nav-item flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${section === name ? "active font-semibold" : ""}`}><Icon size={17} />{tr(lang, name, translateAdmin(name))}</button>)}
        </aside>
        <main className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">{tr(lang, "Bandhan Marriage", "बंधन मैरिज")}</p><h1 className="serif text-3xl font-semibold">{tr(lang, section, translateAdmin(section))}</h1></div><span className="chip">{session.data.role}</span></div>
          {notice && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900" role="status">{notice}</div>}
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">{error}</div>}
          {data.isLoading ? <div className="panel p-8 text-center">Loading administration data…</div> : data.isError ? <div className="panel p-8 text-center text-red-800">{errorText(data.error)} <button className="btn btn-quiet ml-2" onClick={() => data.refetch()}>Retry</button></div> : (
            <>
              {section === "Overview" && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{countCards.map(([key, value]) => <div className="panel p-5" key={key}><p className="text-sm text-muted-foreground">{labelize(key)}</p><p className="serif mt-2 text-3xl font-semibold">{String(value)}</p></div>)}</div>}
              {section === "Users" && <DataTable headers={["Member", "Phone", "Status", "Created", "Actions"]} empty={users.length === 0} rows={users.map((u) => [<div><strong>{str(u.profile?.name) || tr(lang, "No marriage profile", "विवाह प्रोफ़ाइल नहीं")}</strong><small className="block text-muted-foreground">{str(u.email) || str(u.id)}</small></div>, str(u.phone), str(u.status), date(u.createdAt), <div className="flex flex-wrap gap-2"><button className="btn btn-quiet" onClick={() => doAction("user-status", { id: u.id, status: u.status === "active" ? "suspended" : "active" })}>{u.status === "active" ? tr(lang, "Suspend", "निलंबित") : tr(lang, "Activate", "सक्रिय")}</button><button className="btn btn-danger" onClick={() => window.confirm(tr(lang, "Permanently delete this member account?", "क्या इस सदस्य का खाता स्थायी रूप से हटाएं?")) && doAction("user-delete", { id: u.id })}><X size={14} />{tr(lang, "Delete", "हटाएं")}</button></div>])} />}
              {section === "Profiles" && <div className="space-y-4">{users.filter((u) => u.profile).map((u) => <div key={u.id} className="panel grid gap-4 p-4 lg:grid-cols-[1fr_1.4fr]"><div><strong>{str(u.profile.name)}</strong><p className="text-sm text-muted-foreground">{str(u.profile.community)} · {str(u.profile.city)}, {str(u.profile.state)} · {str(u.profile.approvalStatus)}</p><div className="mt-3 flex flex-wrap gap-2"><button className="btn btn-primary" onClick={() => doAction("profile-status", { id: u.profile.id, status: "approved" })}><Check size={14} />{tr(lang, "Approve", "स्वीकृत")}</button><button className="btn btn-danger" onClick={() => doAction("profile-status", { id: u.profile.id, status: "rejected" })}>{tr(lang, "Reject", "अस्वीकार")}</button><button className="btn btn-quiet" onClick={() => doAction("profile-status", { id: u.profile.id, status: u.profile.activityStatus === "active" ? "suspended" : "active" })}>{u.profile.activityStatus === "active" ? tr(lang, "Suspend", "निलंबित") : tr(lang, "Reactivate", "फिर सक्रिय")}</button></div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{rows(u.profile.photos).map((p) => <div key={p.id} className="overflow-hidden rounded-xl border bg-white"><img src={photoUrl(p.objectPath)} className="h-28 w-full object-cover" alt={`${u.profile.name} profile`} /><div className="flex gap-1 p-2"><button className="btn btn-primary flex-1 px-2 py-1" onClick={() => doAction("photo-status", { id: p.id, status: "approved" })}><Check size={13} />{tr(lang, "Approve", "स्वीकृत")}</button><button className="btn btn-danger flex-1 px-2 py-1" onClick={() => doAction("photo-status", { id: p.id, status: "rejected" })}>{tr(lang, "Reject", "अस्वीकार")}</button></div></div>)}</div></div>)}</div>}
              {section === "Requests" && <DataTable headers={["From profile", "To profile", "Status", "Sent"]} empty={!requests.length} rows={requests.map((r) => [str(r.from), str(r.to), str(r.status), date(r.createdAt)])} />}
              {section === "Chats" && <DataTable headers={["Conversation", "Members", "Status", "Messages"]} empty={!conversations.length} rows={conversations.map((c) => [str(c.id), `${str(c.profileA)} · ${str(c.profileB)}`, str(c.status), str(c.messageCount)])} />}
              {section === "Plans" && <DataTable headers={["Plan", "Price / month", "Messages", "Status", "Actions"]} empty={!plans.length} rows={plans.map((p) => [str(p.name), `₹${Number(p.monthlyPrice).toLocaleString("en-IN")}`, p.unlimitedMessaging ? tr(lang, "Unlimited", "असीमित") : str(p.messageLimit), p.active ? tr(lang, "Active", "सक्रिय") : tr(lang, "Inactive", "निष्क्रिय"), <button className="btn btn-quiet" onClick={() => { const price = window.prompt(tr(lang, "Monthly price in INR", "मासिक कीमत (₹)"), str(p.monthlyPrice)); if (price !== null) doAction("plan-save", { id: p.id, name: p.name, monthlyPrice: Number(price), durationDays: p.durationDays, messageLimit: p.messageLimit, unlimitedMessaging: p.unlimitedMessaging, profileVisibility: p.profileVisibility, advancedSearch: p.advancedSearch, priorityListing: p.priorityListing, features: p.features }); }} >{tr(lang, "Edit price", "कीमत बदलें")}</button>])} />}
              {section === "Subscriptions" && <DataTable headers={["Member", "Plan", "Amount", "Status", "Expires", "Actions"]} empty={!subscriptions.length} rows={subscriptions.map((s) => [str(s.userId), str(s.planName), `₹${Number(s.amount).toLocaleString("en-IN")}`, str(s.status), date(s.expiresAt), <button className="btn btn-quiet" onClick={() => doAction("subscription-status", { id: s.id, status: s.status === "active" ? "cancelled" : "active" })}>{s.status === "active" ? tr(lang, "Cancel", "रद्द करें") : tr(lang, "Activate", "सक्रिय करें")}</button>])} />}
              {section === "Payments" && <DataTable headers={["Member", "Amount", "Provider", "Status", "Paid at", "Reference"]} empty={!payments.length} rows={payments.map((p) => [str(p.user), `₹${Number(p.amount).toLocaleString("en-IN")}`, str(p.provider), str(p.status), date(p.paidAt), str(p.providerPaymentRef)])} />}
              {section === "Communities" && <><form className="panel mb-4 flex flex-wrap items-end gap-3 p-4" onSubmit={(e) => { e.preventDefault(); if (communityName.trim()) { doAction("community-save", { name: communityName.trim(), category: communityType, active: true }); setCommunityName(""); } }}><Field label={tr(lang, "Add a caste / community", "जाति / समुदाय जोड़ें")}><input value={communityName} onChange={(e) => setCommunityName(e.target.value)} required /></Field><Field label={tr(lang, "Type", "प्रकार")}><select value={communityType} onChange={(e) => setCommunityType(e.target.value)}><option>Caste</option><option>Sub-caste</option><option>Community</option><option>Other</option></select></Field><button className="btn btn-primary">{tr(lang, "Add", "जोड़ें")}</button></form><DataTable headers={["Community", "Category", "State coverage", "Status", "Actions"]} empty={!communities.length} rows={communities.map((c) => [str(c.name), str(c.category), str(c.stateCoverage), c.active ? tr(lang, "Active", "सक्रिय") : tr(lang, "Inactive", "निष्क्रिय"), <button className="btn btn-quiet" onClick={() => doAction("community-deactivate", { id: c.id, active: !c.active })}>{c.active ? tr(lang, "Deactivate", "निष्क्रिय करें") : tr(lang, "Activate", "सक्रिय करें")}</button>])} /></>}
              {section === "Courses" && <DataTable headers={["Course", "Price", "Status", "Updated"]} empty={!courses.length} rows={courses.map((c) => [str(c.title), c.isFree ? tr(lang, "Free", "निःशुल्क") : `₹${str(c.price)}`, str(c.status), date(c.updatedAt)])} />}
              {section === "Reports" && <DataTable headers={["Reported member", "Reporter", "Reason", "Status", "Received", "Actions"]} empty={!reports.length} rows={reports.map((r) => [str(r.reportedUser), str(r.reporter), str(r.reason), str(r.status), date(r.createdAt), <div className="flex gap-2"><button className="btn btn-primary px-2 py-1" onClick={() => doAction("report-action", { id: r.id, status: "resolved", resolution: "Reviewed by administrator" })}><Check size={14} />{tr(lang, "Resolve", "समाधान")}</button><button className="btn btn-quiet px-2 py-1" onClick={() => doAction("report-action", { id: r.id, status: "dismissed", resolution: "Reviewed by administrator" })}>{tr(lang, "Dismiss", "खारिज")}</button></div>])} />}
              {section === "Settings" && <div className="panel divide-y">{settings.map((s) => <div key={s.key} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><strong>{labelize(str(s.key))}</strong><p className="text-sm text-muted-foreground">{str(s.value)}</p></div><button className="btn btn-quiet" onClick={() => { const next = window.prompt(tr(lang, "New value", "नया मान"), str(s.value)); if (next !== null) doAction("message-settings", { [s.key]: next }); }}>{tr(lang, "Update", "अपडेट")}</button></div>)}</div>}
              {section === "Activity" && <DataTable headers={["Administrator", "Action", "Target", "Details", "Time"]} empty={!activity.length} rows={activity.map((a) => [str(a.email), str(a.action), `${str(a.targetType)} · ${str(a.targetId)}`, JSON.stringify(a.details ?? {}), date(a.createdAt)])} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return <div className="app-shell grid min-h-screen place-items-center p-4"><div className="w-full">{children}</div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field min-w-[180px] flex-1"><span>{label}</span>{children}</label>;
}

function DataTable({ headers, rows: body, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: boolean }) {
  return <div className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left text-sm"><thead className="bg-muted/50"><tr>{headers.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y">{empty ? <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-muted-foreground">No records to show.</td></tr> : body.map((row, i) => <tr key={i} className="align-top">{row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}</tr>)}</tbody></table></div></div>;
}

function translateAdmin(key: string) {
  const map: Record<string, string> = {
    Overview: "सारांश", Users: "सदस्य", Profiles: "विवाह प्रोफ़ाइल", Requests: "रुचि अनुरोध",
    Chats: "चैट", Plans: "योजनाएँ", Subscriptions: "सदस्यताएँ", Payments: "भुगतान",
    Communities: "जाति और समुदाय", Courses: "पाठ्यक्रम", Reports: "रिपोर्ट", Settings: "सेटिंग",
    Activity: "गतिविधि",
  };
  return map[key] ?? key;
}

function labelize(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
}

function photoUrl(path: string) {
  return `/api/storage/objects/${path.replace(/^\/objects\//, "")}`;
}

function errorText(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String((error as { message: unknown }).message);
  return "The request could not be completed.";
}
