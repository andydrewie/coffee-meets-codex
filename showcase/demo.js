// A browser-only presentation of the existing fictional demo fixtures.
// No account, storage, network, model, matching, or messaging operations run here.
const appUrl = 'https://coffee-meets-codex.andydrewie.chatgpt.site/app';
const profiles = {
  mika: { name: 'Mika', age: 28, location: 'Taipei · open to online', headline: 'Making room for little adventures.', introduction: 'Part designer, part sidewalk explorer. I make tiny tools for a slower, more curious life. Tell me about the last thing you made just because.', tags: ['Creative coding', 'City walks', 'Good coffee'], project: 'The Sidewalk Club', description: 'A tiny walking journal that turns a familiar neighborhood into a new adventure.', interest: 'One new street a day', portrait: './assets/mika-portrait.png', art: 'left', palette: 'sage', companion: 'Tracy', companionImage: './assets/tracy.png' },
  jules: { name: 'Jules', age: 30, location: 'Singapore · online & long-distance', headline: 'A little code. A lot of color.', introduction: 'I build playful experiments for people who think they are not creative. Looking for someone to trade unfinished ideas with, over a very finished coffee.', tags: ['Generative art', 'Open source', 'Music'], project: 'Small Joy Machine', description: 'An interactive canvas that turns a few everyday sounds into colorful patterns.', interest: 'Make something on Sundays', art: 'right', palette: 'lavender', companion: 'Tina', companionImage: './assets/tina-blue.png' },
  noah: { name: 'Noah', age: 32, location: 'Taipei · local & online', headline: 'Tools for things worth remembering.', introduction: 'Developer, notebook collector, enthusiastic beginner at pottery. I like small projects that help people find a little more time for each other.', tags: ['Useful tools', 'Notebooks', 'Ceramics'], project: 'Good Things, Kept', description: 'A private collection of little notes, places and moments to return to.', interest: 'The best café has no rush', portrait: './assets/noah-portrait.png', art: 'center', palette: 'peach', companion: 'Owen', companionImage: './assets/noah-companion-green.png' },
  robin: { name: 'Robin', age: 29, location: 'Taipei · local & online', headline: 'Always learning something by hand.', introduction: 'I make helpful websites and occasionally unhelpful ceramics. Curious about people with a project they cannot stop talking about.', tags: ['Web experiments', 'Ceramics', 'Slow weekends'], project: 'Weekend Almanac', description: 'A small collection of creative rituals to make weekends feel a little longer.', interest: 'Curiosity over credentials', art: 'center', palette: 'peach', companion: 'Owen', companionImage: './assets/owen.png' }
};
const grid = document.querySelector('#connections');
const dialog = document.querySelector('#profile-dialog');
let intention = 'friend';
let previousFocus;
const avatar = p => `<div class="avatar ${p.palette}">${p.portrait ? `<img src="${p.portrait}" alt="AI-generated portrait of ${p.name}, a fictional adult" width="70" height="70" loading="lazy">` : `<span aria-hidden="true">${p.name[0]}</span>`}</div>`;
const tags = p => `<div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
function renderCards() {
  const ids = intention === 'friend' ? ['mika', 'jules', 'noah'] : ['mika', 'jules', 'robin'];
  grid.innerHTML = ids.map(id => {
    const p = profiles[id];
    return `<article class="connection-card"><div class="artwork ${p.art}" role="img" aria-label="Illustrative artwork for ${p.project}, a fictional project"><span class="cover-label">${p.project}</span></div><div class="card-body"><div class="card-person">${avatar(p)}<div><h3>${p.name}</h3><p>${p.location}</p></div></div><h3>${p.headline}</h3>${tags(p)}<p class="card-reason"><span aria-hidden="true">✳</span> ${p.interest}. A little shared curiosity can be a lovely place to begin.</p><button class="button card-action" type="button" data-profile="${id}" aria-label="Explore ${p.name}’s fictional profile">A little more about ${p.name} <span aria-hidden="true">↗</span></button><span class="fiction-label">Fictional adult · ${p.age} · Demo profile</span></div></article>`;
  }).join('');
}
document.querySelectorAll('[data-intention]').forEach(button => button.addEventListener('click', () => {
  intention = button.dataset.intention;
  document.querySelectorAll('[data-intention]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  document.querySelector('#intention-copy').textContent = intention === 'friend' ? 'A coffee, a conversation, perhaps something to make together.' : 'A possible romantic connection, on both people’s terms.';
  renderCards();
}));
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-profile]');
  if (!button) return;
  const p = profiles[button.dataset.profile];
  previousFocus = button;
  document.querySelector('#profile-content').innerHTML = `<div class="dialog-head"><p class="eyebrow">FICTIONAL PROFILE · ${intention.toUpperCase()} PREVIEW</p><button class="close-dialog" type="button" autofocus>Close <span aria-hidden="true">×</span></button></div><div class="profile-layout"><div><section class="profile-person"><div class="card-person">${avatar(p)}<div><h2 id="profile-title">${p.name}</h2><p>Fictional adult · ${p.age}</p></div></div><h3>${p.headline}</h3><p>${p.introduction}</p>${tags(p)}</section><section class="project-card"><div class="artwork ${p.art}" role="img" aria-label="Illustrative artwork for this fictional project"></div><div class="project-copy"><p class="eyebrow">A LITTLE THING I MADE</p><h3>${p.project}</h3><p>${p.description}</p></div></section><div class="profile-companion"><img src="${p.companionImage}" alt="${p.companion}, a fictional demo companion" width="69" height="69"><div><p class="eyebrow">MY LITTLE CO-CONSPIRATOR</p><h3>${p.companion}</h3><p>Always up for a good question.</p></div></div></div><aside class="scout-panel"><p class="eyebrow">A SCRIPTED DEMO NOTE</p><h3>A reason to be curious.</h3><p>${p.name} turns curiosity into small, thoughtful projects. “${p.project}” is a natural place to start a conversation.</p><div class="uncertainty"><p class="eyebrow">STILL A LITTLE UNKNOWN</p><p>Shared interests are a starting point. Chemistry, availability and real-world fit are still unknown.</p></div><blockquote class="opener">“I liked the idea behind ${p.project}. What first made you want to build it?”</blockquote><a class="button primary" href="${appUrl}">Explore the signed-in app <span aria-hidden="true">↗</span></a><p class="signin-note">ChatGPT sign-in required.<br>This preview does not send interest or messages.</p></aside></div>`;
  document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.showModal();
  document.body.classList.add('dialog-open');
});
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus(); });
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button, a[href]')];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
renderCards();
