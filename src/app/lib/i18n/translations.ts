export type Locale = "en" | "tl";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  tl: "Tagalog",
};

/**
 * Flat key–value dictionaries. Keys use dot-separated namespaces:
 *   nav.dashboard, common.loading, state.emptyTitle, etc.
 *
 * Only shared / high-visibility strings go here — page-specific copy
 * stays in the page files themselves (we don't need to translate everything).
 */
export type TranslationDict = Record<string, string>;

const en: TranslationDict = {
  /* ── common ── */
  "common.loading": "Loading",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.submit": "Submit",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.back": "Back",
  "common.next": "Next",
  "common.close": "Close",
  "common.logout": "Logout",
  "common.loggingOut": "Logging out...",
  "common.goHome": "Go back home",

  /* ── nav (admin) ── */
  "nav.dashboard": "Dashboard",
  "nav.properties": "Properties and Dorms",
  "nav.rooms": "Rooms",
  "nav.users": "Users",
  "nav.billings": "Billings",
  "nav.reports": "Reports",
  "nav.auditLogs": "Audit Logs",
  "nav.applications": "Applications",
  "nav.accommodations": "Accommodations",
  "nav.complaints": "Complaints",
  "nav.profile": "Profile",
  "nav.browse": "Browse Housing",

  /* ── state messages ── */
  "state.noData": "No data yet",
  "state.noDataDesc": "There's nothing here at the moment.",
  "state.error": "Something went wrong",
  "state.errorDesc": "Please try again in a moment.",
  "state.loadingProfile": "Loading profile…",

  /* ── auth ── */
  "auth.login": "Log In",
  "auth.register": "Register",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.forgotPassword": "Forgot password?",
  "auth.signInWith": "Sign in with",
  "auth.confirmLogout": "Confirm Logout",
  "auth.confirmLogoutDesc": "Are you sure you want to log out?",

  /* ── student ── */
  "student.browseHousing": "Browse Available Housing",
  "student.myApplications": "My Applications",
  "student.myDashboard": "My Dashboard",

  /* ── manager ── */
  "manager.propertyMgmt": "Property Management",

  /* ── 404 / 403 ── */
  "error.404.title": "This page doesn't exist",
  "error.404.desc": "The page you're looking for has moved, been removed, or never existed. Let's get you back on track.",
  "error.403.title": "You don't have access here",
  "error.unauthorized.title": "You can't access this page!",
  "error.unauthorized.desc": "You don't have access to the page you tried to visit.",
};

const tl: TranslationDict = {
  /* ── common ── */
  "common.loading": "Naglo-load",
  "common.save": "I-save",
  "common.cancel": "Kanselahin",
  "common.confirm": "Kumpirmahin",
  "common.submit": "Ipasa",
  "common.delete": "Burahin",
  "common.edit": "I-edit",
  "common.search": "Maghanap",
  "common.filter": "Salain",
  "common.back": "Bumalik",
  "common.next": "Susunod",
  "common.close": "Isara",
  "common.logout": "Mag-logout",
  "common.loggingOut": "Nagla-logout...",
  "common.goHome": "Bumalik sa home",

  /* ── nav (admin) ── */
  "nav.dashboard": "Dashboard",
  "nav.properties": "Mga Ari-arian at Dorm",
  "nav.rooms": "Mga Kwarto",
  "nav.users": "Mga User",
  "nav.billings": "Mga Singil",
  "nav.reports": "Mga Ulat",
  "nav.auditLogs": "Mga Audit Log",
  "nav.applications": "Mga Aplikasyon",
  "nav.accommodations": "Mga Tirahan",
  "nav.complaints": "Mga Reklamo",
  "nav.profile": "Profile",
  "nav.browse": "Mag-browse ng Tirahan",

  /* ── state messages ── */
  "state.noData": "Wala pang datos",
  "state.noDataDesc": "Wala pang laman dito sa ngayon.",
  "state.error": "May nangyaring mali",
  "state.errorDesc": "Subukan ulit mamaya.",
  "state.loadingProfile": "Naglo-load ng profile…",

  /* ── auth ── */
  "auth.login": "Mag-login",
  "auth.register": "Mag-rehistro",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.forgotPassword": "Nakalimutan ang password?",
  "auth.signInWith": "Mag-sign in gamit ang",
  "auth.confirmLogout": "Kumpirmahin ang Pag-logout",
  "auth.confirmLogoutDesc": "Sigurado ka bang gusto mong mag-logout?",

  /* ── student ── */
  "student.browseHousing": "Mag-browse ng Mga Tirahan",
  "student.myApplications": "Mga Aplikasyon Ko",
  "student.myDashboard": "Dashboard Ko",

  /* ── manager ── */
  "manager.propertyMgmt": "Pamamahala ng Ari-arian",

  /* ── 404 / 403 ── */
  "error.404.title": "Hindi umiiral ang pahinang ito",
  "error.404.desc": "Ang hinahanap mong pahina ay inilipat, tinanggal, o hindi talaga nag-exist. Ibalik ka namin sa tamang daan.",
  "error.403.title": "Wala kang access dito",
  "error.unauthorized.title": "Hindi mo ma-access ang pahinang ito!",
  "error.unauthorized.desc": "Wala kang access sa pahinang sinubukan mong bisitahin.",
};

export const translations: Record<Locale, TranslationDict> = { en, tl };
