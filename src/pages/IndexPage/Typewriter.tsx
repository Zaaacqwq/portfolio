import React from "react";

export default function Typewriter({
  words,
  run = true,
  typeMs = 75,
  delMs = 40,
  holdMs = 900,
  loop = true,
}: {
  words: string[];
  run?: boolean;
  typeMs?: number;
  delMs?: number;
  holdMs?: number;
  loop?: boolean;
}) {
  const [w, setW] = React.useState(0);      // 当前词索引
  const [len, setLen] = React.useState(0);  // 当前显示长度
  const [del, setDel] = React.useState(false);

  React.useEffect(() => {
    if (!run || words.length === 0) return; // 暂停时不动
    const word = words[w];
    let t: number;

    if (!del && len < word.length) {
      t = window.setTimeout(() => setLen(len + 1), typeMs);
    } else if (!del && len === word.length) {
      t = window.setTimeout(() => setDel(true), holdMs);
    } else if (del && len > 0) {
      t = window.setTimeout(() => setLen(len - 1), delMs);
    } else {
      // len === 0 且 del === true，切换下一词
      const next = (w + 1) % words.length;
      if (!loop && next === 0) return;
      setW(next);
      setDel(false);
    }

    return () => window.clearTimeout(t);
  }, [run, words, w, len, del, typeMs, delMs, holdMs, loop]);

  return (
    <span className="tw">
      <span className="tw-text">{words[w].slice(0, len)}</span>
      <span className="tw-caret" />
    </span>
  );
}
