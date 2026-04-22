// ── Brand palette — single source of truth ───────────────────────────────────
export const C = {
  cream:       "#EDE9DE", // backgrounds, avatar, soft fills
  amber:       "#E3AF64", // highlights, delta up, accents
  orange:      "#C9642A", // primary action, logo, active nav
  navy:        "#1C2632", // headings, primary text, sidebar bg
  teal:        "#567375", // subtext, labels, muted icons
 
  // Derived tints (opacity on palette colors)
  creamFaint:  "rgba(237,233,222,0.08)",  // hover fill on dark bg
  creamMid:    "rgba(237,233,222,0.55)",  // inactive nav text
  creamHover:  "rgba(237,233,222,0.80)",  // hover nav text
  tealFaint:   "rgba(86,115,117,0.15)",   // subtle bg tint
  orangeFaint: "rgba(201,100,42,0.12)",   // soft orange fill
  navyFaint:   "rgba(28,38,50,0.06)",     // card shadow base
  divider:     "rgba(237,233,222,0.55)",  // light dividers on dark bg
  dividerLight:"rgba(28,38,50,0.08)",     // dividers on light bg
 
  // Status — derived from palette
  statusPending:  { bg: "rgba(227,175,100,0.15)", text: "#C9642A" },
  statusApproved: { bg: "rgba(86,115,117,0.15)",  text: "#567375" },
  statusRejected: { bg: "rgba(28,38,50,0.10)",    text: "#1C2632" },
  statusCancelled:{ bg: "rgba(237,233,222,0.50)", text: "#567375" },
 
  // Audit action badges — derived from palette
  actionCreate: { bg: "rgba(86,115,117,0.15)",   text: "#567375" },
  actionUpdate: { bg: "rgba(227,175,100,0.15)",  text: "#C9642A" },
  actionDelete: { bg: "rgba(201,100,42,0.15)",   text: "#C9642A" },
  actionLogin:  { bg: "rgba(237,233,222,0.40)",  text: "#1C2632" },
  actionLogout: { bg: "rgba(28,38,50,0.08)",     text: "#567375" },
} as const;