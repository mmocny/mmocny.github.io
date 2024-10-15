class BufferedChannel {
    pending_ = [];
    signal_ = null;
  
    push(entry) {
      this.pending_.push(entry);
      this.signal_if_needed();
    }
  
    signal_if_needed() {
      if (this.signal_) {
        this.signal_();
        this.signal_ = null;
      }
    }
  
    async pop() {
      if (this.pending_.length == 0) {
        await new Promise(resolve => {
          this.signal_ = resolve;
        });
      }
      return this.pending_.shift();
    }
  }
  
  
  
  async function* perfit(options) {
    options = {
      type: options,
      buffered: true,
      durationThreshold: 0,
      ...options
    };
    
    const ch = new BufferedChannel();
  
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        ch.push(entry);
      }
    });
    
    observer.observe(options);
  
    for (;;) {
      const ret = yield await ch.pop();
      if (ret) {
        break;
      }
    }
  
    observer.disconnect();
  }
  
  
  // Just a simple helper
  async function printit(type) {
    for await (let entry of perfit({
          type: type,
          buffered: true,
          durationThreshold: 0
        })) {
      console.log(`[${entry.entryType}]`, entry.duration || entry.startTime, entry);
    }
  }