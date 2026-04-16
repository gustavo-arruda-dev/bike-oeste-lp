// ======================================================
// FAQ Accordion
// ======================================================
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('faq__item--open');

    // close all
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('faq__item--open'));
    btn.setAttribute('aria-expanded', 'false');

    // open clicked if it was closed
    if (!isOpen) {
      item.classList.add('faq__item--open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ======================================================
// Form submission
// ======================================================
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText = form.querySelector('.btn__text');
    const btnLoading = form.querySelector('.btn__loading');
    const submitBtn = form.querySelector('[type="submit"]');

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    const data = {
      nome: form.nome.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      empresa: form.empresa.value.trim(),
      cidade: form.cidade.value.trim(),
    };

    // Basic validation
    if (!data.nome || !data.whatsapp || !data.empresa || !data.cidade) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        window.location.href = '/obrigado.html';
      } else {
        throw new Error('Erro no servidor');
      }
    } catch (err) {
      // Fallback: redirect to WhatsApp with the lead info
      const msg = encodeURIComponent(
        `Olá! Quero receber a tabela exclusiva da Bike Oeste.\n\n` +
        `Nome: ${data.nome}\n` +
        `Empresa: ${data.empresa}\n` +
        `Cidade: ${data.cidade}`
      );
      window.open(`https://wa.me/551141864579?text=${msg}`, '_blank');
      window.location.href = '/obrigado.html';
    }
  });
}

// ======================================================
// WhatsApp phone mask
// ======================================================
const whatsappInput = document.querySelector('input[name="whatsapp"]');
if (whatsappInput) {
  whatsappInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (val.length >= 3) {
      val = `(${val.slice(0,2)}) ${val.slice(2)}`;
    }
    if (val.length >= 10) {
      const raw = e.target.value.replace(/\D/g, '');
      val = `(${raw.slice(0,2)}) ${raw.slice(2,7)}-${raw.slice(7,11)}`;
    }
    e.target.value = val;
  });
}

// ======================================================
// Footer newsletter (no-op — show confirmation)
// ======================================================
const subscribeBtn = document.querySelector('.footer__subscribe-btn');
const emailInput = document.querySelector('.footer__email-input');
if (subscribeBtn && emailInput) {
  subscribeBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    subscribeBtn.textContent = 'Inscrito! ✓';
    subscribeBtn.disabled = true;
    emailInput.value = '';
  });
}
