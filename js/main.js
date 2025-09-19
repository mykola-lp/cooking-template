// main.js

document.addEventListener("DOMContentLoaded", async () => {

  async function initAll() {
    const modulesConfig = [
      { path: './scripts/logo-animation.js', fn: 'initLogoAnimations' },
      { path: './scripts/burger-menu.js', fn: 'initBurgerMenu' },
      { path: './scripts/link-status.js', fn: 'initLinkStatus' },
      { path: './scripts/carousel.js', fn: 'initCarousel' },
      { path: './scripts/load-more.js', fn: 'initLoadMore', query: '[data-js-load-more]' },
      { path: './scripts/toggle-favorite.js', fn: 'initFavoriteToggles' }
    ];

    await Promise.all(modulesConfig.map(async mod => {
      const module = await import(mod.path);

      // does NOT need specific DOM elements
      if (!mod.query) return module[mod.fn]?.(...(mod.args || []));

      // needs DOM elements
      const elems = mod.all ? document.querySelectorAll(mod.query) : document.querySelector(mod.query);

      // skip if no elements found
      if (!elems || (mod.all && elems.length === 0)) return;

      // run the module function on all elements or just one
      mod.all
        ? elems.forEach(el => module[mod.fn]?.(el, ...(mod.args || [])))
        : module[mod.fn]?.(elems, ...(mod.args || []));
    }));
  }

  // initialize all modules
  await initAll();
});
