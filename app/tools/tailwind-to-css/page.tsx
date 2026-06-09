"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

const TailwindToCss = () => {
  const [tw, setTw] = useState("");
  const [css, setCss] = useState("");

  const debounceTw = useDebounce(tw);

  useEffect(() => {
    const run = async () => {
      if (!debounceTw.trim()) {
        setCss("");
        return;
      }

      const response = await fetch("/api/tw-to-css", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classNames: debounceTw })
      });

      const data = (await response.json()) as { css?: string };
      setCss(data.css ?? "");
    };

    void run();
  }, [debounceTw]);

  return (
    <div className="container mx-auto grid grid-cols-2 gap-5 mt-10 text-black">
      <textarea
        className="bg-white rounded-2xl p-4 outline-0"
        id=""
        value={tw}
        onChange={(e) => setTw(e.target.value)}
      ></textarea>
      <textarea
        className="bg-white rounded-2xl p-4 outline-0"
        id=""
        value={css}
        disabled
        onChange={(e) => setCss(e.target.value)}
      ></textarea>

      <iframe></iframe>
    </div>
  );
};

export default TailwindToCss;
