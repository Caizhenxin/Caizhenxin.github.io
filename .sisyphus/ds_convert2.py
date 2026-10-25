# -*- coding: utf-8 -*-
"""把 DeepSeek 分享链接的 API 原始 JSON 转成一字不差的 markdown 存档（v2：含思考、联网搜索、打开网页、引用）。"""
import json, os, datetime

SHARE_ID = "4twmgea7buwf4om6l5"
SRC = r"D:\GitHub_programe\GitHub\Caizhenxin.github.io\.sisyphus\dl\share-4twmgea7buwf4om6l5.json"
OUT_DIR = r"D:\GitHub_programe\GitHub\Caizhenxin.github.io\source\Reference\deepseek-archive"

with open(SRC, "r", encoding="utf-8") as f:
    raw = json.load(f)

biz = raw["data"]["biz_data"]
msgs = biz["messages"]
title = biz.get("title") or "Shared Conversation"
model_type = biz.get("model_type")

os.makedirs(OUT_DIR, exist_ok=True)
with open(os.path.join(OUT_DIR, f"share-{SHARE_ID}.raw.json"), "w", encoding="utf-8", newline="\n") as f:
    json.dump(raw, f, ensure_ascii=False, indent=2)


def dt(sec):
    if not sec:
        return ""
    try:
        return datetime.datetime.fromtimestamp(float(sec)).strftime("%Y-%m-%d %H:%M")
    except Exception:
        return str(sec)


def refs_block(refs, lines):
    if not refs:
        return
    lines.append("**引用来源**")
    lines.append("")
    for r in refs:
        t = r.get("title") or ""
        u = r.get("url") or ""
        lines.append(f"- [{t}]({u})" if u else f"- {t}")
    lines.append("")


L = []
L.append(f"# DeepSeek 对话存档 · {SHARE_ID}")
L.append("")
L.append("> **一字不差**：以下全部文字由 `chat.deepseek.com/api/v0/share/content?share_id=%s` 的原始响应直接转出，" % SHARE_ID)
L.append("> 没有改写、删减、错别字修正或标点统一。唯一增加的是分节标题、时间戳与「思考过程」这层标签。")
L.append("> 原始 JSON（真正的原文）见同目录 `share-%s.raw.json`。" % SHARE_ID)
L.append("")
L.append("| 字段 | 值 |")
L.append("|---|---|")
L.append(f"| 分享链接 | https://chat.deepseek.com/share/{SHARE_ID} |")
L.append(f"| 会话标题 | {title} |")
L.append(f"| 模型标记 | {model_type or '（接口未给）'} |")
L.append(f"| 消息条数 | {len(msgs)}（{sum(1 for m in msgs if m.get('role')=='USER')} 问 / {sum(1 for m in msgs if m.get('role')=='ASSISTANT')} 答）|")
L.append(f"| 时间跨度 | {dt(msgs[0].get('inserted_at'))} → {dt(msgs[-1].get('inserted_at'))} |")
L.append(f"| 导出时间 | {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} |")
L.append("")

stats = []
for i, m in enumerate(msgs):
    role = m.get("role")
    who = "我" if role == "USER" else "DeepSeek"
    L.append("---")
    L.append("")
    L.append(f"## {i+1}. {who} · {dt(m.get('inserted_at'))}")
    L.append("")

    think_parts, answer_parts = [], []
    for fr in m.get("fragments") or []:
        t = fr.get("type")
        c = (fr.get("content") or "")

        if t == "THINK":
            if c.strip():
                think_parts.append(c)

        elif t == "RESPONSE":
            if c.strip():
                answer_parts.append(c)
            refs_block(fr.get("references"), L)

        elif t == "REQUEST":
            answer_parts.append(c)

        elif t == "TOOL_SEARCH":
            L.append(f"**联网搜索**（{c or 'status=%s' % fr.get('status')}）")
            L.append("")
            for q in fr.get("queries") or []:
                L.append(f"- 查询：`{q.get('query')}`")
            L.append("")
            res = fr.get("results") or []
            if res:
                L.append(f"<details><summary>返回结果（{len(res)} 条，含摘要）</summary>")
                L.append("")
                for r in res:
                    L.append(f"- [{r.get('title')}]({r.get('url')}) — {r.get('site_name') or ''} {dt(r.get('published_at'))}")
                    if r.get("snippet"):
                        L.append(f"  > {r.get('snippet')}")
                L.append("")
                L.append("</details>")
                L.append("")

        elif t == "TOOL_OPEN":
            r = fr.get("result") or {}
            L.append(f"**打开网页**：[{r.get('title')}]({r.get('url')})")
            L.append("")
            if r.get("snippet"):
                L.append(f"> {r.get('snippet')}")
                L.append("")

        elif t == "TIP":
            pass  # 固定模板提示语，不占正文

        else:
            L.append(f"（fragment type={t}）")
            L.append("")
            L.append(c)
            L.append("")

    if think_parts:
        think = "\n\n".join(think_parts)
        L.append(f"**思考过程**（原文 · {len(think)} 字）")
        L.append("")
        L.append(think)
        L.append("")

    for a in answer_parts:
        L.append(a)
        L.append("")

    meta = []
    if m.get("model"):
        meta.append(m["model"])
    meta.append("thinking_enabled=%s" % m.get("thinking_enabled"))
    meta.append("search_enabled=%s" % m.get("search_enabled"))
    if m.get("accumulated_token_usage"):
        meta.append("累计 tokens=%s" % m["accumulated_token_usage"])
    if m.get("incomplete_message"):
        meta.append("**incomplete_message=%s**" % m["incomplete_message"])
    L.append(f"<sub>{' · '.join(meta)}</sub>")
    L.append("")
    stats.append((who, len("".join(think_parts)), len("".join(answer_parts))))

with open(os.path.join(OUT_DIR, f"share-{SHARE_ID}.md"), "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(L))

md_path = os.path.join(OUT_DIR, f"share-{SHARE_ID}.md")
print("md chars:", os.path.getsize(md_path))
print("think total:", sum(s[1] for s in stats), "answer total:", sum(s[2] for s in stats))
print("assistant msgs:", sum(1 for s in stats if s[0] == "DeepSeek"))
print("user msgs:", sum(1 for s in stats if s[0] == "我"))
print("longest answer:", max(stats, key=lambda s: s[2]))
