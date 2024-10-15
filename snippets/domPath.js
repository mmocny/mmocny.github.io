function domPath(node, maxLen = 100) {
    let sel = '';
    try {
      while (node && node.nodeType !== 9) {
        const part = node.id ? '#' + node.id : node.nodeName.toLowerCase() + (
          (node.className && node.className.length) ?
          '.' + Array.from(node.classList.values()).join('.') : '');
        if (sel.length + part.length > maxLen - 1) return sel || part;
        sel = sel ? part + '>' + sel : part;
        if (node.id) break;
        node = node.parentNode;
      }
    } catch (err) {
      // Do nothing...
    }
    return sel;
  }