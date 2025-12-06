export const themeScript = `
(function() {
  const storageKey = 'yueats-theme';
  const theme = localStorage.getItem(storageKey) || 'dark';
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
})();
`
