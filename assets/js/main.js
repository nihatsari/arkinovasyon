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
      if (link && window.innerWidth <= 768) {
        link.addEventListener('click', (e) => {
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

  // İletişim / Talep Formu İşleme (Statik demo & geri bildirim)
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form elemanlarını al
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Gönder';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'İletiliyor...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }

        formFeedback.innerHTML = `
          <strong>Talebiniz Alındı:</strong> Bilgileriniz danışmanlık ve teknik ekibimize iletilmiştir. 
          Mesai saatleri içerisinde (09:00 - 18:00) tarafınıza dönüş sağlanacaktır.
        `;
        formFeedback.className = 'form-feedback success';
        formFeedback.style.display = 'block';

        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);
    });
  }
});
