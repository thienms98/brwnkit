import { readFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { compile } from "tailwindcss";

export async function POST(req: NextRequest) {
  const { classNames } = (await req.json()) as { classNames: string };

  const { build } = await compile('@import "tailwindcss";', {
    loadStylesheet: async (id: string, base: string) => {
      console.log({ id, base });
      let content = "";

      await readFile(
        "node_modules/tailwindcss/index.css",
        {
          encoding: "utf-8"
        },
        (err, data) => {
          console.log("🚀 ~ POST ~ data:", data);
          // console.log({ err, data });
          content = data;
        }
      );
      console.log("🚀 ~ POST ~ content:", content);

      return {
        path: "virtual:tailwindcss/index.css",
        base,
        // try to find more elegant ways of loading tailwind index.css depending on your bundler
        content
      };
      // if (id === "tailwindcss") {
      // }

      // throw new Error(`can't load stylesheet id:${id} base:${base}`);
    }
  });

  const classes = ["grid", "grid-cols-4"];
  const compiledCss = build(classes);

  return NextResponse.json({ msg: "hehe", compiledCss });
}
