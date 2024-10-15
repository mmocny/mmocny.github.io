// https://preactjs.com/guide/v10/getting-started#alternatives-to-jsx
const { h, render } = await import('https://esm.sh/preact');
const { useState } = await import('https://esm.sh/preact/hooks');
const { signal, useSignal, computed, useComputed, effect } = await import('https://esm.sh/@preact/signals');
// const { default: htm } = await import('https://esm.sh/htm');
// const html = htm.bind(h);

// *****

const count = signal(0);

function Counter() {
  const count2 = useSignal(0);
  
  return h('div', null, [
      h('p', null, ['Count: ', count2]),
      h('button', { onClick: () => count.value++ }, 'click me') 
    ]
  );
}

render(h(Counter), document.body);