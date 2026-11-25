export async function resolve(spec, ctx, next) {
  if (spec === "cloudflare:workers") return { url: new URL("./cfstub.mjs", import.meta.url).href, shortCircuit: true };
  return next(spec, ctx);
}
