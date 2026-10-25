(() => {
  const out = {};
  out.title = document.title;
  out.bodyTextLen = document.body.innerText.length;
  const hist = new Map();
  for (const e of document.querySelectorAll("[class]")) {
    const c = typeof e.className === "string" ? e.className.trim() : "";
    if (!c) continue;
    for (const cls of c.split(/\s+/)) hist.set(cls, (hist.get(cls) || 0) + 1);
  }
  out.classTop = [...hist].filter(x => x[1] > 1).sort((a, b) => b[1] - a[1]).slice(0, 30);
  out.markdownBlocks = document.querySelectorAll(".ds-markdown").length;
  out.thinkToggles = document.querySelectorAll("[class*=think], [class*=Think]").length;
  out.buttons = [...document.querySelectorAll("button")].map(b => (b.innerText || "").trim().slice(0, 20)).slice(0, 20);
  return JSON.stringify(out);
})()
