/**
 * Ark İnovasyon Bilişim Tic. Ltd. Şti. - Kurumsal Web Sitesi
 * Temel Etkileşim ve Navigasyon Mantığı
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobil Menü Aç/Kapat
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Mobil Dropdown Aç/Kapa
    const dropdownItems = navMenu.querySelectorAll('.nav-item-dropdown');
    dropdownItems.forEach((item) => {
      const link = item.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          // Genişlik tıklama anında kontrol edilir (ekran döndürme / pencere boyutu değişimi)
          if (window.innerWidth > 768) return;
          e.preventDefault();
          item.classList.toggle('active');
        });
      }
    });

    // Menü dışına tıklandığında kapatma
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  // Header Scroll Efekti
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // İletişim / Talep Formu İşleme (FormSubmit.co üzerinden e-posta ile iletilir)
  // Alıcı adresi değiştirilecekse yalnızca bu satır güncellenir.
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/sarinihatt@gmail.com';
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  const showFeedback = (type, html) => {
    formFeedback.innerHTML = html;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';
    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn ? submitBtn.innerHTML : '';
      const value = (id) => (document.getElementById(id) || {}).value || '';
      const category = document.getElementById('serviceCategory');

      // Gizli tuzak alanı doluysa gönderen bir bottur
      if (value('website')) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'İletiliyor...';
      }

      const payload = {
        'Ad Soyad': value('fullName'),
        'Firma / Kurum': value('companyName'),
        'E-Posta': value('email'),
        'Telefon': value('phone'),
        'Faaliyet Alanı': category && category.selectedIndex > 0 ? category.options[category.selectedIndex].text : '',
        'Talep': value('message'),
        _subject: `Web Sitesi Talep Formu - ${value('companyName') || value('fullName')}`,
        _replyto: value('email'),
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || res.status);

        contactForm.reset();
        showFeedback('success', `
          <strong>Talebiniz Alındı:</strong> Bilgileriniz danışmanlık ve teknik ekibimize iletilmiştir.
          Mesai saatleri içerisinde (09:00 - 18:00) tarafınıza dönüş sağlanacaktır.
        `);
      } catch (err) {
        showFeedback('error', `
          <strong>Talebiniz iletilemedi.</strong> Lütfen biraz sonra tekrar deneyin veya
          <a href="tel:03122298606">(0312) 229 86 06</a> numaralı telefondan bize ulaşın.
        `);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
        }
      }
    });
  }
});
