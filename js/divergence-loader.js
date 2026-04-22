
(function () {
  const loader = document.getElementById('divergence-loader');
  const html = document.documentElement;

  if (!loader || !html) return;

  html.classList.add('is-loading');

  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const majorDigits = ['0', '1', '2', '3'];
  const frames = Array.from(loader.querySelectorAll('.divergence-loader__frame'));
  const [majorFrame, dotFrame, ...digitFrames] = frames;

  const randomDigit = (list) => list[Math.floor(Math.random() * list.length)];

  const tick = () => {
    if (majorFrame) majorFrame.textContent = randomDigit(majorDigits);
    if (dotFrame) dotFrame.textContent = '.';
    digitFrames.forEach((frame) => {
      frame.textContent = randomDigit(digits);
    });
  };

  tick();
  const timer = window.setInterval(tick, 220);

  const hideLoader = () => {
    window.clearInterval(timer);
    loader.classList.add('is-hidden');
    html.classList.remove('is-loading');
    window.setTimeout(() => loader.remove(), 900);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
})();
