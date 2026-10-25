# -*- coding: utf-8 -*-
"""把 DeepSeek 分享链接的 API 原始 JSON 转成一字不差的 markdown 存档。"""
import json, os, sys, datetime, shutil

SHARE_ID = "4twmgea7buwf4om6l5"
SRC = r"D:\GitHub_programe\GitHub\Caizhenxin.github.io\.sisyphus\dl\share-4twmgea7buwf4om6l5.json"
OUT_DIR = r"D:\GitHub_programe\GitHub\Caizhenxin.github.io\source\Reference\deepseek-archive"

with open(SRC, "r", encoding="utf-8") as f:
    raw = json.load(f)

biz = raw["data"]["biz_data"]
msgs = biz["messages"]
title = biz.get("title")
session = biz.get("chat_session") or {}
chat_id = biz.get("chat_session_id") or session.get("id")

os.makedirs(OUT_DIR, exist_ok=True)
# 1) 原始 JSON 原封不动留档
with open(os.path.join(OUT_DIR, f"share-{SHARE_ID}.raw.json"), "w", encoding="utf-8", newline="\n") as f:
    json.dump(raw, f, ensure_ascii=False, indent=2)

TYPE_LABEL = {"REQUEST": "提问", "RESPONSE": "回答", "THINK": "思考过程", "TYPING": "typing"}


def ts(sec):
    if not sec:
        return ""
    try:
        return datetime.datetime.fromtimestamp(float(sec)).strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        return str(sec)


lines = []
lines.append(f"# DeepSeek 对话存档 · {SHARE_ID}")
lines.append("")
lines.append("> 本文件由 `chat.deepseek.com/api/v0/share/content?share_id=%s` 的原始响应生成，" % SHARE_ID)
lines.append("> 正文与思考过程均未做任何改写、删减或错别字修正。原始 JSON 见同目录 `share-%s.raw.json`。" % SHARE_ID)
lines.append("")
lines.append("| 字段 | 值 |")
lines.append("|---|---|")
lines.append(f"| 分享链接 | https://chat.deepseek.com/share/{SHARE_ID} |")
lines.append(f"| 会话标题 | {title or '（接口未给出，显示为 Shared Conversation）'} |")
lines.append(f"| 消息条数 | {len(msgs)} |")
lines.append(f"| 导出时间 | {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} |")
lines.append("")

stat_rows = []
for m in msgs:
    role = m.get("role")
    who = "**我**" if role == "USER" else "**DeepSeek**"
    lines.append("---")
    lines.append("")
    lines.append(f"## {who}（message_id={m.get('message_id')} · {ts(m.get('inserted_at'))}）")
    lines.append("")
    frags = m.get("fragments") or []
    think_parts, answer_parts, other = [], [], []
    for fr in frags:
        t = fr.get("type")
        c = fr.get("content") or ""
        if t == "THINK":
            think_parts.append(c)
        elif t in ("RESPONSE", "REQUEST"):
            answer_parts.append(c)
        else:
            other.append((t, c))
    think = "\n\n".join(x for x in think_parts if x.strip())
    answer = "\n\n".join(x for x in answer_parts if x.strip())

    if think:
        lines.append("<details open>")
        lines.append("<summary>思考过程（原文）</summary>")
        lines.append("")
        lines.append(think)
        lines.append("")
        lines.append("</details>")
        lines.append("")
    if answer:
        lines.append(answer)
        lines.append("")
    for t, c in other:
        lines.append(f"（fragment type={t}）")
        lines.append("")
        lines.append(c)
        lines.append("")

    meta = []
    if m.get("model"):
        meta.append(m["model"])
    if m.get("thinking_enabled") is not None:
        meta.append("thinking_enabled=%s" % m["thinking_enabled"])
    if m.get("search_enabled") is not None:
        meta.append("search_enabled=%s" % m["search_enabled"])
    if m.get("accumulated_token_usage"):
        meta.append("tokens=%s" % m["accumulated_token_usage"])
    if m.get("incomplete_message"):
        meta.append("**incomplete_message=%s**" % m["incomplete_message"])
    lines.append(f"<sub>{' · '.join(meta)}</sub>")
    lines.append("")
    stat_rows.append((m.get("role"), m.get("message_id"), len(think), len(answer),
                      [fr.get("type") for fr in frags], m.get("status"), m.get("incomplete_message")))

with open(os.path.join(OUT_DIR, f"share-{SHARE_ID}.md"), "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(lines))

print("title:", title)
print("chat_session_id:", chat_id)
print("messages:", len(msgs))
print("out_md_chars:", sum(len(x) for x in lines))
print("roles:", [r[0] for r in stat_rows])
print("frag_types:", [r[4] for r in stat_rows])
print("status:", [r[5] for r in stat_rows])
print("incomplete:", [r[6] for r in stat_rows])
print("think_len:", [r[2] for r in stat_rows])
print("answer_len:", [r[3] for r in stat_rows])
print("keys_first_msg:", list(msgs[0].keys()))
print("biz_top_keys:", list(biz.keys()))
