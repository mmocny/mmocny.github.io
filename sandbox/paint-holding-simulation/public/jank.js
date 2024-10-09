function block(ms) {
    const target = performance.now() + ms;
    while (performance.now() < target);
}

function jank(event) {
    block(100);
    console.log("Event:", event.type, "count:", performance.interactionCount);
}

performance.mark('Add Event Listeners');

['pointerdown', 'pointerup'].forEach(type => {
    document.body.addEventListener(type, jank);
});


console.log(performance.now(), "jank injected, you're welcome");