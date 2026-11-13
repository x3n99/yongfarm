import { h as InvalidComponentArgs, q as AstroError } from "./errors-data_D8O-YH_F.mjs";
import { A as renderHead, N as addAttribute, O as renderTemplate, T as renderSlot } from "./sequence_JKH1RvZ7.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
// node_modules/@astrojs/runtime/dist/internal/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
// src/components/BaseLayout.astro
createAstro("https://astro.build");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title } = Astro.props;
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Fresh farm eggs, thoughtfully raised and carefully selected. Discover Yong Farm favourites and place an order."><meta name="theme-color" content="#fbfaf6"><meta property="og:type" content="website"><meta property="og:title"${addAttribute(`${title} | Yong Farm`, "content")}><meta property="og:description" content="Good eggs, from our farm to your table."><link rel="icon" type="image/svg+xml" href="/img/brand-mark.svg"><title>${title} | Yong Farm</title>${renderHead($$result)}</head><body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/components/BaseLayout.astro", void 0);
export { createComponent as n, $$BaseLayout as t };
