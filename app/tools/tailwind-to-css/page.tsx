"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

const TailwindToCss = () => {
  const [tw, setTw] = useState("");
  const [css, setCss] = useState("");

  const debounceTw = useDebounce(tw);

  useEffect(() => {
    fetch("/api/tw-to-css", {
      method: "POST",
      body: JSON.stringify({
        classNames: debounceTw
      })
    });
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
    </div>
  );
};

export default TailwindToCss;
