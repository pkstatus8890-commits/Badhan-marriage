import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck, BookOpen, Globe2, HeartHandshake, LogOut, MessageCircle, Search,
  ShieldCheck, UserRound, Users, X,
} from "lucide-react";
import {
  getMemberSession, listMemberConversations, logoutMember, requestMemberOtp, verifyMemberOtp,
} from "@workspace/api-client-react";
import AdminConsole from "./AdminConsole";
import {
  AccountView, ChatsView, CommunitySelection, CoursesView, LegalView, PlansView, ProfileDetail,
  ProfileDirectory, ProfileEditor, ProfileStatus, RequestsView,
} from "./MemberViews";

type Lang = "en" | "hi";
type Notify = (message: string) => void;
const tr = (lang: Lang, en: string, hi: string) => lang === "hi" ? hi : en;
const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function localRoute() {
  let path = window.location.pathname;
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || "/";
  return `${path}${window.location.search}`;
}

function urlFor(path: string) {
  const [pathname, query] = path.split("?");
  const target = `${basePath}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return `${target || "/"}${query ? `?${query}` : ""}`;
}

export default function App() {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 20_000, refetchOnWindowFocus: true } },
  }));
  return <QueryClientProvider client={client}><RootApp /></QueryClientProvider>;
}

function RootApp() {
  const [route, setRoute] = useState(localRoute);
  const [lang, setLang] = useState<Lang>(() => localStorage.getItem("bandhan-language") === "hi" ? "hi" : "en");
  const [notice, setNotice] = useState("");
  const qc = useQueryClient();
  const adminRoute = route.split("?")[0].startsWith("/admin");
  const session = useQuery({ queryKey: ["member-session"], queryFn: () => getMemberSession(), retry: false });
  const logout = useMutation({
    mutationFn: () => logoutMember(),
    onSuccess: async () => { await qc.clear(); setRoute("/"); window.history.pushState({}, "", urlFor("/")); },
    onError: (e) => show(errorText(e)),
  });

  useEffect(() => {
    const onPop = () => setRoute(localRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", urlFor(path));
    setRoute(localRoute());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const show: Notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 6000);
  };
  const changeLanguage = (next: Lang) => {
    setLang(next);
    localStorage.setItem("bandhan-language", next);
  };

  if (adminRoute) return <><AdminConsole lang={lang} /><LanguageButton lang={lang} onChange={changeLanguage} fixed /></>;
  if (session.isLoading) return <LoadingPage text={tr(lang, "Checking your secure sign-in…", "आपका सुरक्षित साइन-इन जांच रहे हैं…")} lang={lang} onChange={changeLanguage} />;
  if (!session.data) {
    const status = (session.error as any)?.status ?? (session.error as any)?.response?.status;
    if (session.isError && status && status !== 401) return <ServiceUnavailable lang={lang} onChange={changeLanguage} onRetry={() => session.refetch()} error={session.error} />;
    return <LoginPage lang={lang} onChange={changeLanguage} onSignedIn={(member) => {
      qc.setQueryData(["member-session"], member);
      navigate("/");
    }} />;
  }
  return <MemberShell
    lang={lang}
    onLanguage={changeLanguage}
    route={route}
    navigate={navigate}
    notify={show}
    phone={session.data.phone}
    onLogout={() => logout.mutate()}
    notice={notice}
    onDismissNotice={() => setNotice("")}
  />;
}

function LoginPage({ lang, onChange, onSignedIn }: { lang: Lang; onChange: (lang: Lang) => void; onSignedIn: (session: Awaited<ReturnType<typeof getMemberSession>>) => void }) {
  const [phoneEntry, setPhoneEntry] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const request = useMutation({
    mutationFn: (phone: string) => requestMemberOtp({ phone }),
    onSuccess: () => { setSent(true); setError(""); setInfo(tr(lang, "Verification code sent. Check your messages.", "सत्यापन कोड भेज दिया गया है। अपने संदेश देखें।")); },
    onError: (e) => { setError(errorText(e)); setInfo(""); },
  });
  const verify = useMutation({
    mutationFn: ({ phone, code: otp }: { phone: string; code: string }) => verifyMemberOtp({ phone, code: otp }),
    onSuccess: onSignedIn,
    onError: (e) => { setError(errorText(e)); setInfo(""); },
  });
  const phone = normalizePhone(phoneEntry);
  const submitPhone = (event: React.FormEvent) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 11 || digits.length > 15) { setError(tr(lang, "Enter a valid mobile number, including country code if outside India.", "सही मोबाइल नंबर दर्ज करें। भारत के बाहर देश कोड भी लिखें।")); return; }
    setError("");
    request.mutate(phone);
  };
  const submitCode = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.trim().length < 4) { setError(tr(lang, "Enter the verification code.", "सत्यापन कोड दर्ज करें।")); return; }
    setError("");
    verify.mutate({ phone, code: code.trim() });
  };
  return <main className="app-shell grain grid min-h-screen place-items-center p-4 md:p-8">
    <div className="absolute right-4 top-4"><LanguageButton lang={lang} onChange={onChange} /></div>
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border bg-card shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden min-h-[620px] overflow-hidden bg-[#733748] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 20%, #eac89a 0, transparent 44%), radial-gradient(circle at 90% 80%, #bf7c65 0, transparent 42%)" }} />
        <div className="relative"><div className="brand-mark bg-white/15 text-white"><HeartHandshake size={22} /></div><p className="eyebrow mt-8 text-[#f0d1aa]">{tr(lang, "A thoughtful way to meet", "रिश्ते की सोच-समझकर शुरुआत")}</p><h1 className="serif mt-3 max-w-lg text-5xl leading-tight">{tr(lang, "Build a life together, with clarity.", "साथ मिलकर जीवन बनाएं, पूरी स्पष्टता के साथ।")}</h1><p className="mt-5 max-w-md leading-7 text-white/75">{tr(lang, "Verified members, reviewed marriage profiles and private conversations that begin only by mutual interest.", "सत्यापित सदस्य, समीक्षा की गई विवाह प्रोफ़ाइल और आपसी सहमति के बाद निजी बातचीत।")}</p></div>
        <div className="relative grid grid-cols-3 gap-4 border-t border-white/20 pt-5 text-sm text-white/80"><span>{tr(lang, "Verified sign-in", "सत्यापित लॉगिन")}</span><span>{tr(lang, "Member privacy", "सदस्य गोपनीयता")}</span><span>{tr(lang, "Reviewed profiles", "समीक्षित प्रोफ़ाइल")}</span></div>
      </section>
      <section className="flex min-h-[620px] flex-col justify-center p-6 sm:p-10 lg:p-12">
        <div className="mb-8 flex items-center gap-3 lg:hidden"><div className="brand-mark"><HeartHandshake size={20} /></div><div><p className="eyebrow">{tr(lang, "A thoughtful way to meet", "रिश्ते की सोच-समझकर शुरुआत")}</p><strong className="serif text-xl">बंधन मैरिज</strong></div></div>
        <p className="eyebrow">{tr(lang, "Welcome", "स्वागत है")}</p><h2 className="serif mt-2 text-3xl font-semibold">{sent ? tr(lang, "Verify your number", "अपना नंबर सत्यापित करें") : tr(lang, "Sign in with your mobile", "मोबाइल से साइन इन करें")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{sent ? tr(lang, `Enter the code sent to ${phone}.`, `${phone} पर भेजा गया कोड दर्ज करें।`) : tr(lang, "A verified mobile number keeps your account secure. If you are new, your member account is created after successful verification.", "सत्यापित मोबाइल नंबर खाते को सुरक्षित रखता है। नए सदस्य का खाता सफल सत्यापन के बाद बनेगा।")}</p>
        {sent ? <form className="mt-7 space-y-4" onSubmit={submitCode}><Field label={tr(lang, "Verification code", "सत्यापन कोड")}><input autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••••" required /></Field><button className="btn btn-primary w-full py-3" disabled={verify.isPending}>{verify.isPending ? tr(lang, "Verifying…", "सत्यापित हो रहा है…") : tr(lang, "Verify and continue", "सत्यापित करें और आगे बढ़ें")}</button><div className="flex justify-between gap-2"><button type="button" className="btn btn-quiet" onClick={() => { setSent(false); setCode(""); setError(""); }}>{tr(lang, "Change number", "नंबर बदलें")}</button><button type="button" className="btn btn-quiet" disabled={request.isPending} onClick={() => request.mutate(phone)}>{tr(lang, "Resend code", "कोड फिर भेजें")}</button></div></form> : <form className="mt-7 space-y-4" onSubmit={submitPhone}><Field label={tr(lang, "Mobile number", "मोबाइल नंबर")}><div className="flex"><span className="grid place-items-center rounded-l-xl border border-r-0 bg-muted px-3 text-sm font-semibold">+91</span><input className="rounded-l-none" inputMode="tel" autoComplete="tel-national" maxLength={18} value={phoneEntry} onChange={(e) => setPhoneEntry(e.target.value)} placeholder="98765 43210" required /></div></Field><p className="text-xs leading-5 text-muted-foreground">{tr(lang, "For numbers outside India, enter the full number with its country code, such as +1.", "भारत के बाहर के नंबर के लिए देश कोड सहित पूरा नंबर लिखें, जैसे +1।")}</p><button className="btn btn-primary w-full py-3" disabled={request.isPending}>{request.isPending ? tr(lang, "Sending code…", "कोड भेज रहे हैं…") : tr(lang, "Send verification code", "सत्यापन कोड भेजें")}</button></form>}
        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}{info && <p className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900" role="status">{info}</p>}
        <div className="mt-6 flex items-start gap-2 border-t pt-5 text-xs leading-5 text-muted-foreground"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" />{tr(lang, "We never display your private address or mobile number on a public profile.", "आपका निजी पता या मोबाइल नंबर सार्वजनिक प्रोफ़ाइल पर नहीं दिखाया जाता।")}</div>
      </section>
    </div>
    <a className="fixed bottom-3 right-4 text-xs text-muted-foreground underline" href={urlFor("/admin")}>{tr(lang, "Administrator access", "एडमिन लॉगिन")}</a>
  </main>;
}

function MemberShell({ lang, onLanguage, route, navigate, notify, phone, onLogout, notice, onDismissNotice }: {
  lang: Lang; onLanguage: (lang: Lang) => void; route: string; navigate: (path: string) => void;
  notify: Notify; phone: string; onLogout: () => void; notice: string; onDismissNotice: () => void;
}) {
  const qc = useQueryClient();
  const conversations = useQuery({ queryKey: ["conversations"], queryFn: () => listMemberConversations() });
  const path = route.split("?")[0] || "/";
  const query = new URLSearchParams(route.split("?")[1] ?? "");
  const items = [
    ["/", tr(lang, "Discover", "खोजें"), Search], ["/requests", tr(lang, "Requests", "अनुरोध"), HeartHandshake],
    ["/chats", tr(lang, "Chats", "चैट"), MessageCircle], ["/plans", tr(lang, "Plans", "योजनाएँ"), BadgeCheck],
    ["/courses", tr(lang, "Courses", "पाठ्यक्रम"), BookOpen], ["/my-profile", tr(lang, "My profile", "मेरी प्रोफ़ाइल"), UserRound],
  ] as const;
  const go = (target: string) => navigate(target);
  const onChatProfile = (profileId: string) => {
    const found = conversations.data?.find((c: any) => [c.otherProfileId, c.profileId, c.profile?.id, c.otherProfile?.id].includes(profileId)) as any;
    if (found?.id) go(`/chats?conversation=${found.id}`);
    else { notify(tr(lang, "Chat becomes available after the other member accepts your interest.", "दूसरे सदस्य द्वारा रुचि स्वीकार करने के बाद चैट उपलब्ध होगी।")); go("/requests"); }
  };
  const editRoute = path === "/profile/edit";
  const detailsMatch = path.match(/^\/profile\/([^/]+)$/);
  const communityId = query.get("communityId") ?? undefined;
  let view: ReactNode;
  if (path === "/communities/select") view = <CommunitySelection lang={lang} onBack={() => go("/")} onContinue={(id) => go(`/profile/new?communityId=${encodeURIComponent(id)}`)} notify={notify} />;
  else if (path === "/profile/new" || editRoute) view = <ProfileEditor lang={lang} communityId={communityId} onBack={() => go("/my-profile")} onSaved={() => go("/my-profile")} notify={notify} />;
  else if (detailsMatch) view = <ProfileDetail id={decodeURIComponent(detailsMatch[1])} lang={lang} onBack={() => go("/")} onChat={onChatProfile} notify={notify} />;
  else if (path === "/requests") view = <RequestsView lang={lang} notify={notify} onChat={(id) => go(`/chats?conversation=${encodeURIComponent(id)}`)} />;
  else if (path === "/chats") view = <ChatsView lang={lang} notify={notify} selectedId={query.get("conversation") ?? undefined} onSelect={(id) => go(id ? `/chats?conversation=${encodeURIComponent(id)}` : "/chats")} />;
  else if (path === "/plans") view = <PlansView lang={lang} notify={notify} />;
  else if (path === "/courses") view = <CoursesView lang={lang} />;
  else if (path === "/my-profile") view = <ProfileStatus lang={lang} onCreate={() => go("/communities/select")} onEdit={() => go("/profile/edit")} />;
  else if (path === "/account") view = <AccountView lang={lang} phone={phone} onLogout={onLogout} onNavigate={go} />;
  else if (path === "/privacy") view = <LegalView lang={lang} type="privacy" />;
  else if (path === "/terms") view = <LegalView lang={lang} type="terms" />;
  else view = <ProfileDirectory lang={lang} onNavigate={go} notify={notify} />;
  return <div className="app-shell min-h-screen">
    <header className="topbar flex items-center justify-between px-4 md:px-7">
      <button className="flex items-center gap-3 text-left" onClick={() => go("/")}><div className="brand-mark"><HeartHandshake size={19} /></div><span><strong className="serif block text-lg leading-tight">बंधन मैरिज</strong><small className="text-xs text-muted-foreground">Bandhan Marriage</small></span></button>
      <nav className="desktop-nav flex items-center gap-1">{items.map(([href, label, Icon]) => <button key={href} onClick={() => go(href)} className={`nav-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${path === href ? "active font-semibold" : ""}`}><Icon size={15} />{label}</button>)}</nav>
      <div className="flex items-center gap-2"><LanguageButton lang={lang} onChange={onLanguage} /><button className={`nav-item rounded-xl p-2 ${path === "/account" ? "active" : ""}`} title={tr(lang, "Account", "खाता")} onClick={() => go("/account")}><Users size={17} /></button><button className="nav-item rounded-xl p-2" title={tr(lang, "Sign out", "साइन आउट")} onClick={onLogout}><LogOut size={17} /></button></div>
    </header>
    {notice && <div className="fixed left-1/2 top-[84px] z-50 flex w-[min(92vw,620px)] -translate-x-1/2 items-start justify-between gap-4 rounded-xl border bg-white p-4 text-sm shadow-lg" role="status"><p>{notice}</p><button aria-label={tr(lang, "Dismiss", "बंद करें")} onClick={onDismissNotice}><X size={16} /></button></div>}
    <main className="page-wrap">{view}</main>
    <nav className="mobile-nav fixed inset-x-0 bottom-0 z-40 hidden justify-around border-t bg-card/95 px-1 py-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur">{items.slice(0, 5).map(([href, label, Icon]) => <button key={href} onClick={() => go(href)} className={`nav-item flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] ${path === href ? "active font-semibold" : ""}`}><Icon size={18} />{label}</button>)}</nav>
  </div>;
}

function LanguageButton({ lang, onChange, fixed = false }: { lang: Lang; onChange: (lang: Lang) => void; fixed?: boolean }) {
  return <button className={`btn btn-quiet ${fixed ? "fixed right-4 top-4 z-50" : "px-3 py-2"}`} title="Change language" onClick={() => onChange(lang === "en" ? "hi" : "en")}><Globe2 size={15} />{lang === "en" ? "हिंदी" : "English"}</button>;
}
function LoadingPage({ text, lang, onChange }: { text: string; lang: Lang; onChange: (lang: Lang) => void }) {
  return <main className="app-shell grid min-h-screen place-items-center p-5"><LanguageButton lang={lang} onChange={onChange} fixed /><div className="panel p-8 text-center text-sm text-muted-foreground" role="status">{text}</div></main>;
}
function ServiceUnavailable({ lang, onChange, onRetry, error }: { lang: Lang; onChange: (lang: Lang) => void; onRetry: () => void; error: unknown }) {
  return <main className="app-shell grid min-h-screen place-items-center p-5"><LanguageButton lang={lang} onChange={onChange} fixed /><div className="panel max-w-lg p-8 text-center"><h1 className="serif text-2xl font-semibold">{tr(lang, "Sign-in service unavailable", "साइन-इन सेवा उपलब्ध नहीं है")}</h1><p className="mt-3 text-sm text-muted-foreground">{errorText(error)}</p><button className="btn btn-primary mt-5" onClick={onRetry}>{tr(lang, "Try again", "फिर कोशिश करें")}</button></div></main>;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}
function normalizePhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits}`;
  return `+91${digits}`;
}
function errorText(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String((error as { message: unknown }).message);
  return "The request could not be completed.";
}
