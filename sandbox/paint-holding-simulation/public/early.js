performance.mark("new document load");

['pointerdown', 'click'].forEach(type => {
    document.documentElement.addEventListener(type, (event) => {
        const timeStamp = event.timeStamp;
        const processing = performance.now();
        performance.measure(`${type}StartToProcessing`, { start: timeStamp, end: processing });
        requestAnimationFrame((rafTime) => {
            const rafProcessing = performance.now();
            performance.measure(`${type}ProcessingToRafTime`, { start: processing, end: rafTime  });
            performance.measure(`${type}RafTimeToRafProcessing`, { start: rafTime, end: rafProcessing  });
        });
    });
})