export function filterLogs(logs, { tags, exTags, level, exLevel, logic, searchText }) {
  if (!tags && !exTags && !level && !exLevel && !searchText) return logs;

  return logs.filter((log) => {
    const logTags = (log.tags || []).map((t) => t.toLowerCase());
    const logLevel = (log.level || "").toLowerCase();
    const msg = typeof log.message === "string"
      ? log.message.toLowerCase()
      : JSON.stringify(log.message || "").toLowerCase();

    let tagMatch = true;
    tagMatch =
      logic === "OR"
        ? tags?.some((t) => logTags.includes(t))
        : tags?.every((t) => logTags.includes(t));

    let exTagMatch = true;
    if (exTags) exTagMatch = exTags.every((t) => !logTags.includes(t));

    let levelMatch = true;
    if (level) levelMatch = logLevel === level;

    let exLevelMatch = true;
    if (exLevel) exLevelMatch = logLevel !== exLevel;

    const searchMatch = searchText ? msg.includes(searchText) : true;

    return tagMatch && exTagMatch && levelMatch && exLevelMatch && searchMatch;
  });
}

export function exportLogs(logs) {
  const logText = logs.map(log => JSON.stringify(log)).join("\n");
  const blob = new Blob([logText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `logs-${new Date().toISOString()}.log`;
  a.click();
  URL.revokeObjectURL(url);
}