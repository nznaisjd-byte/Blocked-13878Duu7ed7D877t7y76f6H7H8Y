// blocked.js - show reason and offer an optional password override
(function(){
  const params = location.hash ? location.hash.slice(1) : '';
  const ps = new URLSearchParams(params);
  const orig = ps.get('url') || '';
  const reason = ps.get('reason') || 'Blocked';
  const pattern = ps.get('pattern') || '';

  document.getElementById('origUrl').textContent = orig;
  document.getElementById('reasonLine').textContent = 'Reason: ' + reason;
  if (pattern) document.getElementById('patternLine').textContent = 'Matched pattern: ' + pattern;

  document.getElementById('goHome').addEventListener('click', () => {
    window.location.href = 'about:blank';
  });

  document.getElementById('tryPwd').addEventListener('click', async () => {
    const pw = prompt('Enter password to continue to the original site:');
    if (!pw) return;
    // verify password via background; if ok, redirect to orig
    chrome.runtime.sendMessage({type:'verifyPassword', password: pw}, (resp) => {
      if (resp === true) {
        window.location.href = orig;
      } else {
        document.getElementById('msg').textContent = 'Wrong password.';
      }
    });
  });
})();
