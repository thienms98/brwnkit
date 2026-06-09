import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { compile } from "tailwindcss";

function extractCssVariables(css: string) {
  const variables = new Set<string>();

  for (const match of css.matchAll(/var\((--[a-zA-Z0-9_-]+)\)/g)) {
    variables.add(match[1]);
  }

  for (const match of css.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*[^;]+/g)) {
    variables.add(match[1]);
  }

  return [...variables].sort();
}

function extractRootVariables(css: string) {
  const declarations = new Set<string>();

  for (const match of css.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g)) {
    declarations.add(`${match[1]}: ${match[2].trim()};`);
  }

  return [...declarations].sort();
}

function mergeCompiledCssToClass(css: string, classNames: string[]) {
  const selectors = new Set(
    classNames
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => `.${item.replace(/:/g, "\\:")}`)
  );

  const blocks = [...css.matchAll(/([^{]+)\{([^{}]+)\}/g)];
  const declarations = new Set<string>();

  for (const [, selectorText, body] of blocks) {
    const selector = selectorText.trim();

    if (!selector || selector.startsWith("@")) {
      continue;
    }

    const selectorList = selector
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const matches = selectorList.some((item) => selectors.has(item));

    if (!matches) {
      continue;
    }

    for (const declaration of body.split(";")) {
      const trimmed = declaration.trim();
      if (trimmed) {
        declarations.add(trimmed.replace(/;$/, "") + ";");
      }
    }
  }

  const rootVariables = extractRootVariables(css);
  const rootCss = rootVariables.length
    ? `:root {\n  ${rootVariables.join("\n  ")}\n}`
    : "";

  const generatedCss =
    declarations.size > 0
      ? `.tw-generated {\n  ${[...declarations].join("\n  ")}\n}`
      : "";

  return [rootCss, generatedCss].filter(Boolean).join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const { classNames } = (await req.json()) as { classNames?: string };

    if (!classNames || typeof classNames !== "string") {
      return NextResponse.json({ css: "" }, { status: 400 });
    }

    const classes = classNames
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (classes.length === 0) {
      return NextResponse.json({ css: "" });
    }

    const stylesheetPath = path.join(
      process.cwd(),
      "node_modules",
      "tailwindcss",
      "index.css"
    );

    const { build } = await compile('@import "tailwindcss";', {
      loadStylesheet: async (id: string) => {
        if (id !== "tailwindcss") {
          throw new Error(`Unsupported stylesheet id: ${id}`);
        }

        const content = await readFile(stylesheetPath, "utf8");

        return {
          path: id,
          base: process.cwd(),
          content
        };
      }
    });

    const compiledCss = build(classes);
    const mergedCss = mergeCompiledCssToClass(compiledCss, classes);
    const cssVariables = extractCssVariables(compiledCss);

    return NextResponse.json({ css: mergedCss, cssVariables });
  } catch (error) {
    console.error("tailwind compile error", error);

    return NextResponse.json(
      {
        css: "",
        error:
          error instanceof Error
            ? error.message
            : "Failed to compile Tailwind classes"
      },
      { status: 500 }
    );
  }
}
