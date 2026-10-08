/* Plain JavaScript; no build, server, analytics or external requests. */
(() => {
  'use strict';
  const scene = document.querySelector('.hero-scene');
  const hero = document.querySelector('.hero');
  if (scene && hero) {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 901px)');
    let frame = 0;
    function paintScene() {
      frame = 0;
      const top = hero.getBoundingClientRect().top;
      const distance = desktop.matches && !motion.matches ? Math.min(28, Math.max(0, -top) * 0.045) : 0;
      scene.style.setProperty('--scene-shift', distance + 'px');
    }
    function scheduleScene() { if (!frame) frame = requestAnimationFrame(paintScene); }
    addEventListener('scroll', scheduleScene, {passive:true});
    addEventListener('resize', scheduleScene, {passive:true});
    motion.addEventListener('change', scheduleScene);
    desktop.addEventListener('change', scheduleScene);
    paintScene();
  }
  const email = 'arkanmuhammad.123@gmail.com';
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const fallbackField = document.getElementById('brief-fallback-field');
  const fallbackText = document.getElementById('brief-fallback');
  function buildBrief() {
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim();
    const lines = ['Hello LUNCH,', '', 'I would like to talk about a project.', '', 'Name: ' + value('name'), 'Email: ' + value('email')];
    for (const [key, label] of [['company', 'Company'], ['website', 'Website / Instagram'], ['project', 'What I am working on'], ['budget', 'Approximate budget'], ['launch', 'Target launch date']]) {
      if (value(key)) lines.push(label + ': ' + value(key));
    }
    return {subject: 'Project enquiry — ' + (value('company') || value('name')), body: lines.join('\n')};
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const brief = buildBrief();
    status.textContent = "Opening your email app. Review and send your brief there. If it doesn't open, copy your brief and email us directly.";
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(brief.subject) + '&body=' + encodeURIComponent(brief.body);
  });
  document.getElementById('copy-brief').addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    const brief = buildBrief();
    const text = 'To: ' + email + '\nSubject: ' + brief.subject + '\n\n' + brief.body;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      status.textContent = 'Brief copied. Paste it into an email to LUNCH when you are ready to send.';
      fallbackField.hidden = true;
      fallbackText.value = '';
    } catch {
      fallbackText.value = text;
      fallbackField.hidden = false;
      status.textContent = 'Select and copy your brief below, then paste it into your email app.';
      fallbackText.focus();
      fallbackText.select();
    }
  });
})();
