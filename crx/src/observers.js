const observers = [];

let mutationObserver, overlayMutationObserver, bodyMutationObserver;

function createMutationObserver(updateFn) {
  const observer = new MutationObserver(function() {
    disconnectMutationObservers();
    updateFn();
    setTimeout(() => startMutationObservers(), 100);
  });
  observers.push(observer);
  return observer;
}

export function disconnectMutationObservers() {
  for (const observer of observers) {
    observer.disconnect();
  }
}

export function createMutationObservers(updateFn) {
  // When tweets are added to UI (by scrolling, etc.)
  mutationObserver = createMutationObserver(updateFn);
  
  // When permalink overlay is turned on or off.
  overlayMutationObserver = createMutationObserver(updateFn);
  
  // When page changes (navigation within SPA)
  bodyMutationObserver = createMutationObserver(updateFn);
}

export function startMutationObservers() {
  if (document.body) {
    bodyMutationObserver.observe(document.body, {
      attributeFilter: ["class"]
    });
  }
  if (document.getElementById("timeline")) {
    mutationObserver.observe(document.getElementById("timeline"), {
      childList: true,
      subtree: true
    });
  }
  if (document.getElementById("permalink-overlay")) {
    overlayMutationObserver.observe(
      document.getElementById("permalink-overlay"),
      {
        childList: true,
        subtree: true
      }
    );
  }
}