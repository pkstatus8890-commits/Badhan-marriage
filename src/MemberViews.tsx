import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, ArrowRight, Camera, Check, Heart, MapPin, MessageCircle, Search, Shield,
  SlidersHorizontal, Trash2, UserRound, X,
} from "lucide-react";
import {
  attachMyProfilePhoto, blockMember, deleteMyProfilePhoto, getMemberProfile,
  getMyMarriageProfile, listConversationMessages, listMemberConversations, listMemberRequests,
  listPublicCommunities, listPublicPlans, listPublishedCourses, reportMember, respondToMemberInterest,
  saveMyMarriageProfile, searchMemberProfiles, sendConversationMessage, sendMemberInterest, suggestCommunity,
  requestProfilePhotoUploadUrl,
} from "@workspace/api-client-react";

type Lang = "en" | "hi";
const tr = (lang: Lang, en: string, hi: string) => lang === "hi" ? hi : en;
type Notify = (message: string) => void;
type Profile = Awaited<ReturnType<typeof getMemberProfile>>;
type MyProfile = Awaited<ReturnType<typeof getMyMarriageProfile>>;
type ProfileInput = Parameters<typeof saveMyMarriageProfile>[0];
type Loose = Record<string, any>;
const errorText = (error: unknown) => error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "Please try again.";
const photoSrc = (path?: string) => path ? `/api/storage/objects/${path.replace(/^\/objects\//, "")}` : "";
const formatDate = (value: unknown) => value ? new Date(String(value)).toLocaleDateString() : "";

export function ProfileDirectory({ lang, onNavigate, notify }: { lang: Lang; onNavigate: (path: string) => void; notify: Notify }) {
  const [filters, setFilters] = useState({ q: "", minAge: "", maxAge: "", city: "", gender: "", communityId: "", education: "", profession: "" });
  const communities = useQuery({ queryKey: ["communities", ""], queryFn: () => listPublicCommunities({ limit: 100 }) });
  const queryParams = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "").map(([key, value]) => [key, key === "minAge" || key === "maxAge" ? Number(value) : value])) as Parameters<typeof searchMemberProfiles>[0], [filters]);
  const result = useQuery({
    queryKey: ["profiles", queryParams],
    queryFn: () => searchMemberProfiles(queryParams),
  });
  const update = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  return <section className="space-y-6 enter">
    <div className="hero-head flex items-end justify-between gap-5">
      <div><p className="eyebrow">{tr(lang, "A thoughtful way to meet", "रिश्ते की सोच-समझकर शुरुआत")}</p><h1 className="serif mt-2 text-4xl font-semibold md:text-5xl">{tr(lang, "Find a meaningful connection.", "एक सार्थक रिश्ता खोजें।")}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{tr(lang, "Explore approved marriage profiles. Marital status is shown openly; your search is yours to shape.", "स्वीकृत विवाह प्रोफ़ाइल देखें। वैवाहिक स्थिति स्पष्ट रूप से दिखाई जाती है; खोज के विकल्प आप चुनें।")}</p></div>
      <button className="btn btn-primary shrink-0" onClick={() => onNavigate("/communities/select")}><UserRound size={16} />{tr(lang, "Create marriage profile", "विवाह प्रोफ़ाइल बनाएं")}</button>
    </div>
    <div className="panel p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2"><SlidersHorizontal size={17} className="text-primary" /><h2 className="font-semibold">{tr(lang, "Search filters", "खोज फ़िल्टर")}</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={tr(lang, "Name or keyword", "नाम या शब्द")}><div className="relative"><Search className="absolute left-3 top-3 text-muted-foreground" size={16} /><input className="pl-9" value={filters.q} onChange={(e) => update("q", e.target.value)} placeholder={tr(lang, "Search profiles", "प्रोफ़ाइल खोजें")} /></div></Field>
        <Field label={tr(lang, "Gender", "लिंग")}><select value={filters.gender} onChange={(e) => update("gender", e.target.value)}><option value="">{tr(lang, "Any", "कोई भी")}</option><option value="Woman">{tr(lang, "Woman", "महिला")}</option><option value="Man">{tr(lang, "Man", "पुरुष")}</option><option value="Other">{tr(lang, "Other", "अन्य")}</option></select></Field>
        <Field label={tr(lang, "Caste / community", "जाति / समुदाय")}><select value={filters.communityId} onChange={(e) => update("communityId", e.target.value)}><option value="">{tr(lang, "All communities", "सभी समुदाय")}</option>{communities.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label={tr(lang, "City", "शहर")}><input value={filters.city} onChange={(e) => update("city", e.target.value)} /></Field>
        <Field label={tr(lang, "Minimum age", "न्यूनतम आयु")}><input type="number" min="18" max="100" value={filters.minAge} onChange={(e) => update("minAge", e.target.value)} /></Field>
        <Field label={tr(lang, "Maximum age", "अधिकतम आयु")}><input type="number" min="18" max="100" value={filters.maxAge} onChange={(e) => update("maxAge", e.target.value)} /></Field>
        <Field label={tr(lang, "Education", "शिक्षा")}><input value={filters.education} onChange={(e) => update("education", e.target.value)} /></Field>
        <Field label={tr(lang, "Profession", "पेशा")}><input value={filters.profession} onChange={(e) => update("profession", e.target.value)} /></Field>
      </div>
    </div>
    {result.isLoading ? <Loading text={tr(lang, "Loading profiles…", "प्रोफ़ाइल लोड हो रही हैं…")} /> : result.isError ? <ErrorPanel error={result.error} onRetry={() => result.refetch()} lang={lang} /> : result.data?.length ? <div className="profile-grid grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{result.data.map((profile) => <ProfileCard key={profile.id} profile={profile} lang={lang} onClick={() => onNavigate(`/profile/${profile.id}`)} />)}</div> : <Empty title={tr(lang, "No profiles match these filters", "इन फ़िल्टर से कोई प्रोफ़ाइल नहीं मिली")} detail={tr(lang, "Try widening your search, or come back as new approved profiles are added.", "खोज के विकल्प बदलें या नई स्वीकृत प्रोफ़ाइल के लिए बाद में आएं।")} />}
  </section>;
}

function ProfileCard({ profile, lang, onClick }: { profile: Profile; lang: Lang; onClick: () => void }) {
  const photos = (profile.photos ?? []) as Loose[];
  const photo = photos.find((p: Loose) => p.isPrimary) ?? photos[0];
  return <article className="profile-card cursor-pointer" onClick={onClick} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}>
    <div className="photo-frame h-[320px] bg-secondary">
      {photo?.objectPath ? <img src={photo.url || photoSrc(photo.objectPath)} alt={tr(lang, `Photo of ${profile.name}`, `${profile.name} की तस्वीर`)} loading="lazy" /> : <div className="grid h-full place-items-center text-muted-foreground"><UserRound size={50} strokeWidth={1.2} /></div>}
    </div>
    <div className="profile-body p-5">
      <div className="flex items-start justify-between gap-2"><h2 className="serif text-2xl font-semibold">{profile.name}</h2><span className="chip whitespace-nowrap">{profile.age}</span></div>
      <p className="mt-1 text-sm font-medium text-primary">{profile.community ?? tr(lang, "Community not specified", "समुदाय नहीं बताया")}{profile.subCommunity ? ` · ${profile.subCommunity}` : ""}</p>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={14} />{profile.city}{profile.state ? `, ${profile.state}` : ""}</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{profile.education || tr(lang, "Education not provided", "शिक्षा की जानकारी नहीं")}</p>
      <div className="mt-3 flex flex-wrap gap-2"><span className="chip">{profile.gender}</span><span className="chip">{profile.maritalStatus}</span></div>
      <button className="btn btn-soft mt-4 w-full">{tr(lang, "View full profile", "पूरी प्रोफ़ाइल देखें")}<ArrowRight size={15} /></button>
    </div>
  </article>;
}

export function ProfileDetail({ id, lang, onBack, onChat, notify }: { id: string; lang: Lang; onBack: () => void; onChat: (profileId: string) => void; notify: Notify }) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["profile", id], queryFn: () => getMemberProfile(id), retry: false });
  const interest = useMutation({ mutationFn: () => sendMemberInterest({ profileId: id }), onSuccess: () => { notify(tr(lang, "Interest sent. You will be notified if it is accepted.", "रुचि भेज दी गई। स्वीकार होने पर आपको सूचना मिलेगी।")); qc.invalidateQueries({ queryKey: ["requests"] }); }, onError: (e) => notify(errorText(e)) });
  const report = useMutation({ mutationFn: (reason: string) => reportMember({ profileId: id, reason }), onSuccess: () => notify(tr(lang, "Report sent to the safety team.", "रिपोर्ट सुरक्षा टीम को भेज दी गई।")), onError: (e) => notify(errorText(e)) });
  const block = useMutation({ mutationFn: () => blockMember({ profileId: id }), onSuccess: () => { notify(tr(lang, "This member is blocked.", "इस सदस्य को ब्लॉक किया गया।")); onBack(); qc.invalidateQueries({ queryKey: ["profiles"] }); }, onError: (e) => notify(errorText(e)) });
  if (query.isLoading) return <Loading text={tr(lang, "Loading profile…", "प्रोफ़ाइल लोड हो रही है…")} />;
  if (query.isError || !query.data) return <ErrorPanel error={query.error} onRetry={() => query.refetch()} lang={lang} />;
  const p = query.data;
  const photos = p.photos ?? [];
  return <section className="space-y-5 enter">
    <button className="btn btn-quiet" onClick={onBack}><ArrowLeft size={15} />{tr(lang, "Back to profiles", "प्रोफ़ाइल पर वापस")}</button>
    <div className="panel grid overflow-hidden lg:grid-cols-[minmax(300px,0.8fr)_1.2fr]">
      <div className="grid grid-cols-2 gap-1 bg-secondary p-1 sm:grid-cols-3 lg:grid-cols-2">{photos.length ? photos.map((photo: any) => <img key={photo.id} className="aspect-[4/5] w-full object-cover" src={photo.url || photoSrc(photo.objectPath)} alt={`${p.name} profile`} />) : <div className="col-span-2 grid aspect-[4/5] place-items-center text-muted-foreground"><UserRound size={54} /></div>}</div>
      <div className="p-6 md:p-9">
        <p className="eyebrow">{tr(lang, "Marriage profile", "विवाह प्रोफ़ाइल")}</p><h1 className="serif mt-2 text-4xl font-semibold">{p.name}</h1><p className="mt-2 text-primary">{p.community ?? ""}{p.subCommunity ? ` · ${p.subCommunity}` : ""}</p>
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
          <Detail label={tr(lang, "Age", "आयु")} value={String(p.age)} /><Detail label={tr(lang, "Gender", "लिंग")} value={p.gender} /><Detail label={tr(lang, "Religion", "धर्म")} value={p.religion} /><Detail label={tr(lang, "Marital status", "वैवाहिक स्थिति")} value={p.maritalStatus} /><Detail label={tr(lang, "City / district", "शहर / जिला")} value={[p.city, p.district].filter(Boolean).join(", ")} /><Detail label={tr(lang, "State", "राज्य")} value={p.state} /><Detail label={tr(lang, "Education", "शिक्षा")} value={p.education} /><Detail label={tr(lang, "Profession", "पेशा")} value={p.profession} /><Detail label={tr(lang, "Height", "कद")} value={p.height} /><Detail label={tr(lang, "Gotra", "गोत्र")} value={p.gotra} />
        </div>
        <Detail label={tr(lang, "About", "परिचय")} value={p.about} /><Detail label={tr(lang, "Family", "परिवार")} value={p.family} /><Detail label={tr(lang, "Preferred partner", "पसंदीदा जीवनसाथी")} value={p.partnerPreference} />
        <div className="mt-6 flex flex-wrap gap-2"><button className="btn btn-primary" disabled={interest.isPending} onClick={() => interest.mutate()}><Heart size={15} />{tr(lang, "Send interest", "रुचि भेजें")}</button><button className="btn btn-quiet" onClick={() => onChat(id)}><MessageCircle size={15} />{tr(lang, "Chat", "चैट")}</button><button className="btn btn-quiet" onClick={() => { const reason = window.prompt(tr(lang, "Why are you reporting this profile?", "इस प्रोफ़ाइल की रिपोर्ट क्यों कर रहे हैं?")); if (reason?.trim()) report.mutate(reason.trim()); }}><Shield size={15} />{tr(lang, "Report", "रिपोर्ट")}</button><button className="btn btn-danger" onClick={() => window.confirm(tr(lang, "Block this member? Their profile will be hidden from you.", "इस सदस्य को ब्लॉक करें? उनकी प्रोफ़ाइल आपको नहीं दिखेगी।")) && block.mutate()}><X size={15} />{tr(lang, "Block", "ब्लॉक")}</button></div>
      </div>
    </div>
  </section>;
}

export function RequestsView({ lang, notify, onChat }: { lang: Lang; notify: Notify; onChat: (id: string) => void }) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["requests"], queryFn: () => listMemberRequests() });
  const respond = useMutation({ mutationFn: ({ id, status }: { id: string; status: "accepted" | "rejected" }) => respondToMemberInterest(id, { status }), onSuccess: (data: any) => { notify(tr(lang, "Request updated.", "अनुरोध अपडेट किया गया।")); qc.invalidateQueries({ queryKey: ["requests"] }); qc.invalidateQueries({ queryKey: ["conversations"] }); if (data.conversationId) onChat(data.conversationId); }, onError: (e) => notify(errorText(e)) });
  if (query.isLoading) return <Loading text={tr(lang, "Loading requests…", "अनुरोध लोड हो रहे हैं…")} />;
  if (query.isError || !query.data) return <ErrorPanel error={query.error} onRetry={() => query.refetch()} lang={lang} />;
  return <section className="space-y-5"><Heading eyebrow={tr(lang, "Connections", "संपर्क")} title={tr(lang, "Interest requests", "रुचि अनुरोध")} /><div className="grid gap-5 lg:grid-cols-2"><RequestList label={tr(lang, "Received", "प्राप्त")} records={query.data.received as Loose[]} onRespond={(id, status) => respond.mutate({ id, status })} lang={lang} /><RequestList label={tr(lang, "Sent", "भेजे गए")} records={query.data.sent as Loose[]} onRespond={(id, status) => respond.mutate({ id, status })} lang={lang} /></div></section>;
}

function RequestList({ label, records, onRespond, lang }: { label: string; records: Loose[]; onRespond: (id: string, status: "accepted" | "rejected") => void; lang: Lang }) {
  return <div className="panel overflow-hidden"><div className="border-b px-5 py-4"><h2 className="serif text-xl font-semibold">{label}</h2></div>{records.length ? records.map((r) => <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4 last:border-0" key={r.id}><div><strong>{r.profile?.name ?? r.name ?? tr(lang, "Member profile", "सदस्य प्रोफ़ाइल")}</strong><p className="text-sm text-muted-foreground">{r.profile?.community ?? ""}{r.profile?.city ? ` · ${r.profile.city}` : ""} · {r.status}</p></div>{label === tr(lang, "Received", "प्राप्त") && r.status === "pending" && <div className="flex gap-2"><button className="btn btn-primary px-3 py-2" onClick={() => onRespond(r.id, "accepted")}><Check size={14} />{tr(lang, "Accept", "स्वीकार")}</button><button className="btn btn-danger px-3 py-2" onClick={() => onRespond(r.id, "rejected")}><X size={14} />{tr(lang, "Decline", "मना करें")}</button></div>}</div>) : <Empty title={tr(lang, "No requests yet", "अभी कोई अनुरोध नहीं")} detail={tr(lang, "Interest requests will appear here.", "रुचि अनुरोध यहां दिखाई देंगे।")} />}
  </div>;
}

export function ChatsView({ lang, notify, selectedId, onSelect }: { lang: Lang; notify: Notify; selectedId?: string; onSelect: (id?: string) => void }) {
  const chats = useQuery({ queryKey: ["conversations"], queryFn: () => listMemberConversations() });
  const selected = selectedId && chats.data?.find((c: any) => c.id === selectedId);
  const messages = useQuery({ queryKey: ["messages", selectedId], queryFn: () => listConversationMessages(selectedId!), enabled: !!selectedId, refetchInterval: 7000 });
  const [content, setContent] = useState("");
  const qc = useQueryClient();
  const send = useMutation({ mutationFn: () => sendConversationMessage(selectedId!, { content: content.trim() }), onSuccess: () => { setContent(""); qc.invalidateQueries({ queryKey: ["messages", selectedId] }); }, onError: (e) => notify(errorText(e)) });
  if (chats.isLoading) return <Loading text={tr(lang, "Loading conversations…", "चैट लोड हो रही हैं…")} />;
  if (chats.isError) return <ErrorPanel error={chats.error} onRetry={() => chats.refetch()} lang={lang} />;
  return <section className="space-y-5"><Heading eyebrow={tr(lang, "Private conversations", "निजी बातचीत")} title={tr(lang, "Your chats", "आपकी चैट")} /><div className="panel grid min-h-[560px] overflow-hidden md:grid-cols-[280px_1fr]">
    <aside className={`${selectedId ? "hidden md:block" : ""} border-r`}>{chats.data?.length ? chats.data.map((c: any) => <button key={c.id} className={`block w-full border-b px-4 py-4 text-left hover:bg-muted ${selectedId === c.id ? "bg-muted" : ""}`} onClick={() => onSelect(c.id)}><strong>{c.otherProfile?.name ?? c.otherName ?? tr(lang, "Member", "सदस्य")}</strong><p className="mt-1 text-xs text-muted-foreground">{c.lastMessage?.content ?? tr(lang, "Open conversation", "बातचीत खोलें")}</p></button>) : <div className="p-5"><Empty title={tr(lang, "No conversations", "अभी कोई चैट नहीं")} detail={tr(lang, "A conversation opens after an interest request is accepted.", "रुचि अनुरोध स्वीकार होने पर चैट खुलेगी।")} /></div>}</aside>
    <div className={`${selectedId ? "" : "hidden md:grid"} chat-pane grid grid-rows-[auto_1fr_auto]`}>
      {selected ? <><div className="flex items-center gap-3 border-b p-4"><button className="btn btn-quiet px-2 py-2 md:hidden" onClick={() => onSelect()}><ArrowLeft size={16} /></button><div className="brand-mark h-9 w-9"><MessageCircle size={16} /></div><div><strong>{(selected as any).otherProfile?.name ?? (selected as any).otherName ?? tr(lang, "Member conversation", "सदस्य से चैट")}</strong><p className="text-xs text-muted-foreground">{tr(lang, "Member-only conversation", "सदस्यों के बीच निजी चैट")}</p></div></div>
        <div className="flex flex-col gap-3 overflow-y-auto p-4">{messages.isLoading ? <p>{tr(lang, "Loading messages…", "संदेश लोड हो रहे हैं…")}</p> : messages.isError ? <p className="text-sm text-red-700">{errorText(messages.error)}</p> : messages.data?.map((m: any) => <div key={m.id} className={`chat-bubble ${m.ownMessage || m.isMine ? "mine self-end" : "self-start"}`}><p className="whitespace-pre-wrap">{m.content}</p><small className="mt-1 block opacity-65">{formatDate(m.createdAt)}</small></div>)}</div>
        <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); if (content.trim()) send.mutate(); }}><input className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2" value={content} onChange={(e) => setContent(e.target.value)} maxLength={4000} placeholder={tr(lang, "Write a message…", "संदेश लिखें…")} /><button className="btn btn-primary" disabled={send.isPending || !content.trim()}><MessageCircle size={15} />{tr(lang, "Send", "भेजें")}</button></form>
      </> : <div className="grid place-items-center p-6 text-center text-muted-foreground"><MessageCircle size={42} strokeWidth={1.2} /><p className="mt-3">{tr(lang, "Choose a conversation", "बातचीत चुनें")}</p></div>}
    </div>
  </div></section>;
}

export function PlansView({ lang, notify }: { lang: Lang; notify: Notify }) {
  const plans = useQuery({ queryKey: ["public-plans"], queryFn: () => listPublicPlans() });
  return <section className="space-y-6"><Heading eyebrow={tr(lang, "Membership", "सदस्यता")} title={tr(lang, "Choose your chat plan", "अपनी चैट योजना चुनें")} /><p className="max-w-2xl text-sm leading-6 text-muted-foreground">{tr(lang, "All plans are billed in Indian rupees. A paid checkout will be available after the payment provider is connected and verified.", "सभी योजनाओं की कीमत भारतीय रुपये में है। भुगतान सेवा सुरक्षित रूप से जोड़ने और सत्यापित करने के बाद ही चेकआउट चालू होगा।")}</p>
    {plans.isLoading ? <Loading text={tr(lang, "Loading plans…", "योजनाएँ लोड हो रही हैं…")} /> : plans.isError ? <ErrorPanel error={plans.error} onRetry={() => plans.refetch()} lang={lang} /> : <div className="grid gap-5 md:grid-cols-3">{plans.data?.filter((p) => Number(p.monthlyPrice) > 0).map((p) => <article className={`panel flex flex-col p-6 ${p.unlimitedMessaging ? "border-primary shadow-lg" : ""}`} key={p.id}><p className="eyebrow">{p.unlimitedMessaging ? "PRIME" : tr(lang, "MEMBERSHIP", "सदस्यता")}</p><h2 className="serif mt-2 text-2xl font-semibold">{p.name}</h2><p className="mt-4"><strong className="serif text-4xl">₹{Number(p.monthlyPrice).toLocaleString("en-IN")}</strong><span className="text-muted-foreground">{tr(lang, " / month", " / माह")}</span></p><ul className="my-6 flex-1 space-y-3 text-sm">{p.features.map((feature, i) => <li key={i} className="flex gap-2"><Check className="mt-0.5 text-accent" size={16} />{feature}</li>)}</ul><button className="btn btn-quiet w-full" disabled title={tr(lang, "Payment gateway connection required", "भुगतान सेवा कॉन्फ़िगरेशन आवश्यक")} onClick={() => notify(tr(lang, "Payment checkout is not enabled until the payment provider is connected and verified.", "भुगतान प्रदाता जुड़ने और सत्यापित होने तक चेकआउट उपलब्ध नहीं है।"))}>{tr(lang, "Checkout unavailable", "चेकआउट उपलब्ध नहीं")}</button></article>)}</div>}
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>{tr(lang, "Secure payment setup required", "सुरक्षित भुगतान कॉन्फ़िगरेशन आवश्यक")}</strong><p className="mt-1">{tr(lang, "No payment will be collected until a real payment provider is configured. Your chat access will only change after a verified payment confirmation.", "वास्तविक भुगतान सेवा कॉन्फ़िगर होने तक कोई भुगतान नहीं लिया जाएगा। चैट सुविधा केवल सत्यापित भुगतान के बाद बदलेगी।")}</p></div>
  </section>;
}

export function CommunitySelection({ lang, onContinue, onBack, notify }: { lang: Lang; onContinue: (id: string) => void; onBack: () => void; notify: Notify }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const query = useQuery({ queryKey: ["communities", search], queryFn: () => listPublicCommunities({ q: search || undefined, limit: 100 }) });
  const add = useMutation({ mutationFn: () => suggestCommunity({ name: suggestion.trim() }), onSuccess: () => { notify(tr(lang, "Suggestion sent for administrator review.", "सुझाव एडमिन की समीक्षा के लिए भेजा गया।")); setSuggestion(""); }, onError: (e) => notify(errorText(e)) });
  return <section className="mx-auto max-w-3xl space-y-5 enter"><button className="btn btn-quiet" onClick={onBack}><ArrowLeft size={15} />{tr(lang, "Back", "वापस")}</button><div><p className="eyebrow">{tr(lang, "Step 1 of 2", "चरण 1 / 2")}</p><h1 className="serif mt-2 text-3xl font-semibold">{tr(lang, "Choose your caste or community", "अपनी जाति या समुदाय चुनें")}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{tr(lang, "Choose how you identify. Communities are searchable; you can suggest a missing one for review.", "अपनी पहचान के अनुसार समुदाय चुनें। खोज उपलब्ध है; न मिलने पर नया नाम समीक्षा के लिए सुझाएं।")}</p></div><div className="panel p-5"><Field label={tr(lang, "Search caste or community", "जाति या समुदाय खोजें")}><div className="relative"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /><input className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr(lang, "Type a community name", "समुदाय का नाम लिखें")} /></div></Field>
      {query.isLoading ? <Loading text={tr(lang, "Loading communities…", "समुदाय लोड हो रहे हैं…")} /> : query.isError ? <ErrorPanel error={query.error} onRetry={() => query.refetch()} lang={lang} /> : <div className="mt-4 grid max-h-[380px] gap-2 overflow-auto sm:grid-cols-2">{query.data?.map((community) => <button key={community.id} className={`rounded-xl border p-3 text-left transition hover:border-primary ${selected === community.id ? "border-primary bg-primary/5" : "bg-background"}`} onClick={() => setSelected(community.id)}><strong>{community.name}</strong><span className="ml-2 text-xs text-muted-foreground">{community.category}</span></button>)}</div>}
      {query.data?.length === 0 && <p className="mt-4 text-sm text-muted-foreground">{tr(lang, "No matching community found.", "इस नाम का समुदाय नहीं मिला।")}</p>}
      <form className="mt-5 flex flex-wrap items-end gap-3 border-t pt-4" onSubmit={(e) => { e.preventDefault(); if (suggestion.trim()) add.mutate(); }}><Field label={tr(lang, "Suggest a community not listed", "सूची में न हो तो नया समुदाय सुझाएं")}><input value={suggestion} onChange={(e) => setSuggestion(e.target.value)} maxLength={160} /></Field><button className="btn btn-quiet" disabled={add.isPending || !suggestion.trim()}>{tr(lang, "Send suggestion", "सुझाव भेजें")}</button></form>
      <button className="btn btn-primary mt-5 w-full" disabled={!selected} onClick={() => onContinue(selected)}>{tr(lang, "Continue to profile details", "प्रोफ़ाइल जानकारी भरें")}<ArrowRight size={15} /></button>
    </div></section>;
}

export function ProfileEditor({ lang, communityId, onBack, onSaved, notify }: { lang: Lang; communityId?: string; onBack: () => void; onSaved: () => void; notify: Notify }) {
  const qc = useQueryClient();
  const existing = useQuery({ queryKey: ["my-profile"], queryFn: () => getMyMarriageProfile(), retry: false });
  const communities = useQuery({ queryKey: ["communities", ""], queryFn: () => listPublicCommunities({ limit: 100 }) });
  const [form, setForm] = useState<ProfileInput>({
    name: "", dateOfBirth: "", gender: "", city: "", district: "", state: "", religion: "Hindu",
    communityId: communityId ?? "", subCommunity: "", privateAddress: "", education: "",
    profession: "", maritalStatus: "Never married", gotra: "", height: "", family: "", about: "", partnerPreference: "",
  } as ProfileInput);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (existing.data && !loaded) {
      setForm({ ...(existing.data as unknown as ProfileInput), dateOfBirth: String((existing.data as any).dateOfBirth).slice(0, 10), communityId: communityId || (existing.data as any).communityId || "" });
      setLoaded(true);
    }
  }, [existing.data, loaded, communityId]);
  useEffect(() => { if (communityId) setForm((current) => ({ ...current, communityId })); }, [communityId]);
  const save = useMutation({ mutationFn: () => saveMyMarriageProfile(form), onSuccess: async () => { notify(tr(lang, "Profile saved and sent for review.", "प्रोफ़ाइल सहेजकर समीक्षा के लिए भेजी गई।")); await qc.invalidateQueries({ queryKey: ["my-profile"] }); await qc.invalidateQueries({ queryKey: ["member-session"] }); onSaved(); }, onError: (e) => notify(errorText(e)) });
  const removePhoto = useMutation({ mutationFn: (id: string) => deleteMyProfilePhoto(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["my-profile"] }), onError: (e) => notify(errorText(e)) });
  const set = (key: keyof ProfileInput, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const photos = ((existing.data as any)?.photos ?? []) as Loose[];
  const onFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      if (!form.name.trim()) throw new Error(tr(lang, "Save your profile details before uploading photos.", "तस्वीरें जोड़ने से पहले प्रोफ़ाइल जानकारी सहेजें।"));
      const upload = await requestProfilePhotoUploadUrl({ name: file.name, size: file.size, contentType: file.type as "image/jpeg" | "image/png" | "image/webp" });
      const response = await fetch(upload.uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!response.ok) throw new Error(tr(lang, "The image could not be uploaded.", "तस्वीर अपलोड नहीं हो सकी।"));
      await attachMyProfilePhoto({ objectPath: upload.objectPath, isPrimary: photos.length === 0 });
      await qc.invalidateQueries({ queryKey: ["my-profile"] });
      notify(tr(lang, "Photo uploaded and waiting for review.", "तस्वीर अपलोड हो गई और समीक्षा की प्रतीक्षा में है।"));
    } catch (e) { notify(errorText(e)); }
    finally { setUploading(false); }
  };
  const fields: Array<[keyof ProfileInput, string, string, string?]> = [
    ["name", "Full name", "पूरा नाम"], ["dateOfBirth", "Date of birth", "जन्म तिथि", "date"], ["gender", "Gender", "लिंग"], ["religion", "Religion", "धर्म"],
    ["city", "City", "शहर"], ["district", "District", "जिला"], ["state", "State", "राज्य"],
    ["subCommunity", "Sub-caste", "उपजाति"], ["education", "Education", "शिक्षा"], ["profession", "Job / profession", "नौकरी / पेशा"],
    ["maritalStatus", "Marital status", "वैवाहिक स्थिति"], ["gotra", "Gotra", "गोत्र"], ["height", "Height", "कद"],
  ];
  if (existing.isLoading) return <Loading text={tr(lang, "Loading your profile…", "आपकी प्रोफ़ाइल लोड हो रही है…")} />;
  return <section className="mx-auto max-w-4xl space-y-5 enter"><button className="btn btn-quiet" onClick={onBack}><ArrowLeft size={15} />{tr(lang, "Back", "वापस")}</button><div><p className="eyebrow">{tr(lang, "Marriage profile", "विवाह प्रोफ़ाइल")}</p><h1 className="serif mt-2 text-3xl font-semibold">{existing.data ? tr(lang, "Update your profile", "अपनी प्रोफ़ाइल अपडेट करें") : tr(lang, "Create your marriage profile", "अपनी विवाह प्रोफ़ाइल बनाएं")}</h1>{existing.data && <p className="mt-2 text-sm text-muted-foreground">{tr(lang, "Review status:", "समीक्षा स्थिति:")} <strong>{(existing.data as any).approvalStatus}</strong></p>}</div>
    <form className="panel space-y-6 p-5 md:p-7" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
      <div><h2 className="serif text-xl font-semibold">{tr(lang, "Personal details", "व्यक्तिगत जानकारी")}</h2><div className="form-grid mt-4 grid grid-cols-2 gap-4">{fields.slice(0, 2).map(([key, en, hi, type]) => <Field key={key} label={tr(lang, en, hi)}><input required type={type ?? "text"} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} /></Field>)}<Field label={tr(lang, "Gender", "लिंग")}><select required value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="">{tr(lang, "Select gender", "लिंग चुनें")}</option><option value="Man">{tr(lang, "Boy / man", "लड़का / पुरुष")}</option><option value="Woman">{tr(lang, "Girl / woman", "लड़की / महिला")}</option><option value="Other">{tr(lang, "Other", "अन्य")}</option></select></Field><Field label={tr(lang, "Religion", "धर्म")}><input required value={form.religion ?? ""} onChange={(e) => set("religion", e.target.value)} /></Field></div></div>
      <div><h2 className="serif text-xl font-semibold">{tr(lang, "Community and location", "समुदाय और पता")}</h2><div className="form-grid mt-4 grid grid-cols-2 gap-4"><Field label={tr(lang, "Caste / community", "जाति / समुदाय")}><select required value={form.communityId} onChange={(e) => set("communityId", e.target.value)}><option value="">{tr(lang, "Select community", "समुदाय चुनें")}</option>{communities.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>{fields.slice(4, 7).map(([key, en, hi]) => <Field key={key} label={tr(lang, en, hi)}><input required value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} /></Field>)}<Field label={tr(lang, "Sub-caste", "उपजाति")}><input value={form.subCommunity ?? ""} onChange={(e) => set("subCommunity", e.target.value)} /></Field><Field label={tr(lang, "Private address (not shown publicly)", "निजी पता (सार्वजनिक नहीं)")}><input value={form.privateAddress ?? ""} onChange={(e) => set("privateAddress", e.target.value)} /></Field></div></div>
      <div><h2 className="serif text-xl font-semibold">{tr(lang, "Education and work", "शिक्षा और काम")}</h2><div className="form-grid mt-4 grid grid-cols-2 gap-4">{fields.slice(8, 10).map(([key, en, hi]) => <Field key={key} label={tr(lang, en, hi)}><input required value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} /></Field>)}<Field label={tr(lang, "Marital status", "वैवाहिक स्थिति")}><select value={form.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)}><option value="Never married">{tr(lang, "Never married", "अविवाहित")}</option><option value="Divorced">{tr(lang, "Divorced", "तलाकशुदा")}</option><option value="Widowed">{tr(lang, "Widowed", "विधवा / विधुर")}</option><option value="Separated">{tr(lang, "Separated", "अलग रह रहे हैं")}</option></select></Field>{fields.slice(11, 13).map(([key, en, hi]) => <Field key={key} label={tr(lang, en, hi)}><input value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} /></Field>)}</div></div>
      <div><h2 className="serif text-xl font-semibold">{tr(lang, "Family and preferences", "परिवार और पसंद")}</h2><div className="mt-4 grid gap-4"><Field label={tr(lang, "Family information", "परिवार की जानकारी")}><textarea value={form.family ?? ""} onChange={(e) => set("family", e.target.value)} /></Field><Field label={tr(lang, "About you", "आपके बारे में")}><textarea value={form.about ?? ""} onChange={(e) => set("about", e.target.value)} /></Field><Field label={tr(lang, "Preferred life partner", "पसंदीदा जीवनसाथी")}><textarea value={form.partnerPreference ?? ""} onChange={(e) => set("partnerPreference", e.target.value)} /></Field></div></div>
      <div><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="serif text-xl font-semibold">{tr(lang, "Profile photos", "प्रोफ़ाइल तस्वीरें")}</h2><p className="mt-1 text-sm text-muted-foreground">{tr(lang, "JPG, PNG, or WebP; up to 10 MB each. Photos are reviewed before appearing to other members.", "JPG, PNG या WebP; प्रत्येक 10 MB तक। दूसरों को दिखने से पहले तस्वीरों की समीक्षा होगी।")}</p></div><label className="btn btn-soft cursor-pointer"><Camera size={16} />{uploading ? tr(lang, "Uploading…", "अपलोड हो रहा है…") : tr(lang, "Add photo", "तस्वीर जोड़ें")}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || photos.length >= 6} onChange={(e) => { void onFile(e.target.files?.[0]); e.currentTarget.value = ""; }} /></label></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{photos.map((photo) => <div className="relative overflow-hidden rounded-xl border" key={photo.id}><img className="aspect-[4/3] w-full object-cover" src={photo.url || photoSrc(photo.objectPath)} alt={tr(lang, "Profile photo", "प्रोफ़ाइल तस्वीर")} /><span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-1 text-xs text-white">{photo.moderationStatus}</span><button type="button" className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-700" aria-label={tr(lang, "Delete photo", "तस्वीर हटाएं")} onClick={() => removePhoto.mutate(photo.id)}><Trash2 size={15} /></button></div>)}</div></div>
      <div className="flex justify-end border-t pt-5"><button className="btn btn-primary" disabled={save.isPending}>{save.isPending ? tr(lang, "Saving…", "सहेज रहे हैं…") : tr(lang, "Save profile", "प्रोफ़ाइल सहेजें")}<ArrowRight size={15} /></button></div>
    </form>
  </section>;
}

export function CoursesView({ lang }: { lang: Lang }) {
  const query = useQuery({ queryKey: ["courses"], queryFn: () => listPublishedCourses() });
  if (query.isLoading) return <Loading text={tr(lang, "Loading courses…", "पाठ्यक्रम लोड हो रहे हैं…")} />;
  if (query.isError) return <ErrorPanel error={query.error} onRetry={() => query.refetch()} lang={lang} />;
  return <section className="space-y-5"><Heading eyebrow={tr(lang, "Learn together", "साथ सीखें")} title={tr(lang, "Relationship courses", "रिश्तों पर पाठ्यक्रम")} />{query.data?.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{query.data.map((course: any) => <article className="panel p-5" key={course.id}><p className="eyebrow">{course.isFree ? tr(lang, "Free course", "निःशुल्क") : `₹${course.price}`}</p><h2 className="serif mt-2 text-xl font-semibold">{course.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{course.shortDescription}</p><p className="mt-3 text-xs text-muted-foreground">{course.duration}</p>{course.externalLink && <a className="btn btn-soft mt-4" href={course.externalLink} target="_blank" rel="noreferrer">{tr(lang, "Open course", "पाठ्यक्रम खोलें")}<ArrowRight size={15} /></a>}</article>)}</div> : <Empty title={tr(lang, "No published courses yet", "अभी कोई पाठ्यक्रम प्रकाशित नहीं है")} detail={tr(lang, "Published courses will appear here.", "प्रकाशित पाठ्यक्रम यहां दिखाई देंगे।")} />}</section>;
}

export function ProfileStatus({ lang, profile, onEdit, onCreate }: { lang: Lang; profile?: MyProfile; onEdit: () => void; onCreate: () => void }) {
  const query = useQuery({ queryKey: ["my-profile"], queryFn: () => getMyMarriageProfile(), retry: false });
  useEffect(() => { if (query.data && profile !== query.data) { /* parent shares no profile state */ } }, [query.data, profile]);
  return <section className="mx-auto max-w-3xl space-y-5"><Heading eyebrow={tr(lang, "Your account", "आपका खाता")} title={tr(lang, "My marriage profile", "मेरी विवाह प्रोफ़ाइल")} />{query.isLoading ? <Loading text={tr(lang, "Loading your profile…", "आपकी प्रोफ़ाइल लोड हो रही है…")} /> : query.data ? <div className="panel p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="serif text-2xl font-semibold">{query.data.name}</h2><p className="mt-1 text-sm text-muted-foreground">{query.data.community} · {query.data.city}, {query.data.state}</p><p className="mt-3 text-sm">{tr(lang, "Review status:", "समीक्षा स्थिति:")} <strong>{query.data.approvalStatus}</strong></p>{query.data.rejectionReason && <p className="mt-2 text-sm text-red-800">{query.data.rejectionReason}</p>}</div><button className="btn btn-primary" onClick={onEdit}>{tr(lang, "Edit profile", "प्रोफ़ाइल संपादित करें")}</button></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{query.data.photos.map((p: any) => <img key={p.id} className="aspect-square w-full rounded-xl object-cover" src={p.url || photoSrc(p.objectPath)} alt={query.data!.name} />)}</div></div> : <div className="panel p-6"><Empty title={tr(lang, "You haven't created a marriage profile", "आपने अभी विवाह प्रोफ़ाइल नहीं बनाई है")} detail={tr(lang, "Create a separate profile to be considered for marriage and to send or receive interest.", "विवाह के लिए अलग प्रोफ़ाइल बनाएं ताकि आप रुचि भेज और प्राप्त कर सकें।")} /><button className="btn btn-primary mt-5" onClick={onCreate}>{tr(lang, "Create marriage profile", "विवाह प्रोफ़ाइल बनाएं")}<ArrowRight size={15} /></button></div>}</section>;
}

export function AccountView({ lang, phone, onLogout, onNavigate }: { lang: Lang; phone: string; onLogout: () => void; onNavigate: (path: string) => void }) {
  return <section className="mx-auto max-w-2xl space-y-5"><Heading eyebrow={tr(lang, "Security and preferences", "सुरक्षा और प्राथमिकताएं")} title={tr(lang, "Account", "खाता")} /><div className="panel divide-y"><div className="p-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">{tr(lang, "Verified mobile number", "सत्यापित मोबाइल नंबर")}</p><strong className="mt-1 block">{phone}</strong></div><button className="flex w-full items-center justify-between p-5 text-left hover:bg-muted" onClick={() => onNavigate("/my-profile")}><span><strong>{tr(lang, "My marriage profile", "मेरी विवाह प्रोफ़ाइल")}</strong><span className="mt-1 block text-sm text-muted-foreground">{tr(lang, "View and update profile information and photos.", "प्रोफ़ाइल की जानकारी और तस्वीरें देखें या अपडेट करें।")}</span></span><ArrowRight size={16} /></button><div className="p-5"><strong>{tr(lang, "Privacy", "गोपनीयता")}</strong><p className="mt-1 text-sm leading-6 text-muted-foreground">{tr(lang, "Your private address and phone number are never included in public profile responses. Photos are visible only to signed-in members after approval.", "आपका निजी पता और मोबाइल नंबर सार्वजनिक प्रोफ़ाइल में नहीं दिखते। तस्वीरें स्वीकृति के बाद केवल साइन-इन सदस्यों को दिखती हैं।")}</p></div><div className="flex flex-wrap gap-2 p-5"><button className="btn btn-quiet" onClick={() => onNavigate("/privacy")}>{tr(lang, "Privacy policy", "गोपनीयता नीति")}</button><button className="btn btn-quiet" onClick={() => onNavigate("/terms")}>{tr(lang, "Terms of service", "सेवा की शर्तें")}</button><button className="btn btn-danger" onClick={onLogout}>{tr(lang, "Sign out", "साइन आउट")}</button></div></div></section>;
}

export function LegalView({ lang, type }: { lang: Lang; type: "privacy" | "terms" }) {
  const privacy = type === "privacy";
  return <section className="mx-auto max-w-3xl space-y-5"><Heading eyebrow={tr(lang, "Member information", "सदस्य जानकारी")} title={privacy ? tr(lang, "Privacy policy", "गोपनीयता नीति") : tr(lang, "Terms of service", "सेवा की शर्तें")} /><div className="panel space-y-4 p-6 text-sm leading-7 text-muted-foreground"><p>{privacy ? tr(lang, "We use your verified mobile number to secure your account. Your address is private and is not shown on public profiles. Profile photos are stored privately and are shown to signed-in members only after moderation.", "खाते की सुरक्षा के लिए सत्यापित मोबाइल नंबर का उपयोग होता है। आपका पता निजी रहता है और सार्वजनिक प्रोफ़ाइल पर नहीं दिखता। तस्वीरें निजी रूप से संग्रहीत होती हैं और समीक्षा के बाद ही साइन-इन सदस्यों को दिखाई जाती हैं।") : tr(lang, "Members must be at least 18 years old to create a marriage profile. Do not misrepresent your identity or use the service to harass, threaten, or defraud another person.", "विवाह प्रोफ़ाइल बनाने के लिए सदस्य की आयु कम से कम 18 वर्ष होनी चाहिए। गलत पहचान न दें और सेवा का उपयोग किसी को परेशान करने, धमकाने या धोखा देने के लिए न करें।")}</p><p>{privacy ? tr(lang, "We retain account, profile, interest, chat, and payment records as needed to operate the service, protect members, and meet legal obligations. You may contact the service operator to request access or correction of your account information.", "सेवा चलाने, सदस्यों की सुरक्षा और कानूनी दायित्वों के लिए खाते, प्रोफ़ाइल, रुचि, चैट और भुगतान रिकॉर्ड रखे जा सकते हैं। खाते की जानकारी देखने या ठीक कराने के लिए सेवा संचालक से संपर्क करें।") : tr(lang, "Profile details and photos may be reviewed before publication. Chat is available only after the other member accepts an interest request and remains subject to plan limits. Use the report or block controls to raise a safety concern.", "प्रकाशित होने से पहले प्रोफ़ाइल की जानकारी और तस्वीरों की समीक्षा हो सकती है। चैट तभी उपलब्ध होती है जब दूसरा सदस्य रुचि स्वीकार करे और यह सदस्यता सीमा के अधीन है। सुरक्षा संबंधी चिंता के लिए रिपोर्ट या ब्लॉक विकल्प चुनें।")}</p></div></section>;
}

function RequestListPlaceholder() { return null; }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field min-w-0"><span>{label}</span>{children}</label>;
}
function Detail({ label, value }: { label: string; value?: string | null }) {
  return <div className="border-b pb-2"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 whitespace-pre-wrap font-medium">{value || "—"}</p></div>;
}
function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="eyebrow">{eyebrow}</p><h1 className="serif mt-2 text-3xl font-semibold">{title}</h1></div>;
}
function Loading({ text }: { text: string }) {
  return <div className="panel p-10 text-center text-sm text-muted-foreground" role="status">{text}</div>;
}
function Empty({ title, detail }: { title: string; detail: string }) {
  return <div className="py-8 text-center"><p className="font-semibold">{title}</p><p className="mt-2 text-sm text-muted-foreground">{detail}</p></div>;
}
function ErrorPanel({ error, onRetry, lang }: { error: unknown; onRetry: () => void; lang: Lang }) {
  return <div className="panel p-8 text-center"><p className="font-semibold text-red-800">{errorText(error)}</p><button className="btn btn-quiet mt-4" onClick={onRetry}>{tr(lang, "Retry", "फिर कोशिश करें")}</button></div>;
}
