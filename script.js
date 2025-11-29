document.addEventListener('DOMContentLoaded', () => {

  // -------------------------
  // Navbar: Hamburger menu toggle
  // -------------------------
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('nav ul');
  menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });

  // -------------------------
  // Quantity buttons + 3D tilt for main cards
  // -------------------------
  document.querySelectorAll('.card').forEach(card => {
    const plus = card.querySelector('.plus');
    const minus = card.querySelector('.minus');
    const quantity = card.querySelector('.quantity');
    const priceEl = card.querySelector('.price');

    let unitPrice = parseFloat(priceEl.textContent.replace('$', ''));

    if (plus) plus.addEventListener('click', () => {
      quantity.textContent = parseInt(quantity.textContent) + 1;
      priceEl.textContent = '$' + (unitPrice * parseInt(quantity.textContent)).toFixed(2);
    });

    if (minus) minus.addEventListener('click', () => {
      let val = parseInt(quantity.textContent);
      if (val > 1) {
        quantity.textContent = val - 1;
        priceEl.textContent = '$' + (unitPrice * parseInt(quantity.textContent)).toFixed(2);
      }
    });

    const container = card.querySelector('.image-container');
    const img = container?.querySelector('img');
    if (container && img) {
      container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * 10;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
        img.style.transform = `scale(1.1) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
      });
      container.addEventListener('mouseleave', () => {
        img.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
      });
    }
  });

  // -------------------------
  // Add to Cart logic
  // -------------------------
  const cartTableBody = document.querySelector('.cart-table tbody');
  const cartTotalEl = document.getElementById('cart-total');
  const emptyCartEl = document.querySelector('.empty-cart');
  const navCart = document.querySelector('.nav-cart');

  document.querySelectorAll('.card .add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const name = card.querySelector('h3').textContent;
      const qty = parseInt(card.querySelector('.quantity').textContent);
      const pricePerUnit = parseFloat(card.querySelector('.price').textContent.replace('$', '')) / qty;
      const totalPrice = (pricePerUnit * qty).toFixed(2);

      let existingRow = Array.from(cartTableBody.children).find(row => row.dataset.name === name);
      if(existingRow){
        let newQty = parseInt(existingRow.querySelector('.cart-qty').textContent) + qty;
        existingRow.querySelector('.cart-qty').textContent = newQty;
        existingRow.querySelector('.cart-total').textContent = '$' + (pricePerUnit * newQty).toFixed(2);
      } else {
        const row = document.createElement('tr');
        row.dataset.name = name;
        row.innerHTML = `
          <td>${name}</td>
          <td>$${pricePerUnit.toFixed(2)}</td>
          <td class="cart-qty">${qty}</td>
          <td class="cart-total">$${totalPrice}</td>
          <td><button class="remove-btn">Remove</button></td>
        `;
        cartTableBody.appendChild(row);

        row.querySelector('.remove-btn').addEventListener('click', () => {
          row.remove();
          updateCartTotal();
          if(cartTableBody.children.length === 0) emptyCartEl.style.display = 'block';
        });
      }

      emptyCartEl.style.display = 'none';
      updateCartTotal();
      navCart.classList.add('active'); // show cart dropdown

      alert(`${qty} "${name}" added to cart!`);
    });
  });

  function updateCartTotal(){
    let total = 0;
    document.querySelectorAll('.cart-total').forEach(el => {
      total += parseFloat(el.textContent.replace('$', ''));
    });
    cartTotalEl.textContent = total.toFixed(2);
  }

  // -------------------------
  // Navbar cart toggle
  // -------------------------
  const cartLink = navCart.querySelector('a');
  cartLink?.addEventListener('click', e => {
    e.preventDefault();
    navCart.classList.toggle('active');
  });

  document.addEventListener('click', e => {
    if (!navCart.contains(e.target) && !cartLink.contains(e.target)) {
      navCart.classList.remove('active');
    }
  });

  // -------------------------
  // Carousel logic
  // -------------------------
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const track = document.querySelector('.carousel-container');
  const leftBtn = document.querySelector('.carousel-wrapper .arrow.left');
  const rightBtn = document.querySelector('.carousel-wrapper .arrow.right');
  const cards = document.querySelectorAll('.carousel-card');

  if(track && leftBtn && rightBtn && cards.length > 0){
    let itemsPerView = window.innerWidth <= 500 ? 2 : 4;
    let totalItems = cards.length;
    let pageIndex = 0;
    let maxPageIndex = Math.max(0, Math.ceil(totalItems / itemsPerView) - 1);

    function recalc(){
      itemsPerView = window.innerWidth <= 500 ? 2 : 4;
      maxPageIndex = Math.max(0, Math.ceil(totalItems / itemsPerView) - 1);
      if(pageIndex > maxPageIndex) pageIndex = maxPageIndex;
      updateButtons();
      moveToPage(pageIndex, false);
    }

    function updateButtons(){
      leftBtn.disabled = pageIndex <= 0;
      rightBtn.disabled = pageIndex >= maxPageIndex;
    }

    function moveToPage(index, animated = true){
      const gap = parseFloat(getComputedStyle(track).gap) || 12;
      const cardWidth = cards[0].getBoundingClientRect().width + gap;
      const translateX = -(index * itemsPerView * cardWidth);
      track.style.transition = animated ? '' : 'none';
      track.style.transform = `translateX(${translateX}px)`;
      if(!animated) track.getBoundingClientRect();
      updateButtons();
    }

    leftBtn.addEventListener('click', () => { if(pageIndex > 0) { pageIndex--; moveToPage(pageIndex); } });
    rightBtn.addEventListener('click', () => { if(pageIndex < maxPageIndex) { pageIndex++; moveToPage(pageIndex); } });

    let autoSlide = setInterval(() => { pageIndex++; if(pageIndex > maxPageIndex) pageIndex = 0; moveToPage(pageIndex); }, 3000);
    carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carouselWrapper.addEventListener('mouseleave', () => autoSlide = setInterval(() => { pageIndex++; if(pageIndex > maxPageIndex) pageIndex = 0; moveToPage(pageIndex); }, 3000));

    window.addEventListener('resize', recalc);
    recalc();
  }

  // -------------------------
  // Search toggle & filter
  // -------------------------
  const searchToggle = document.getElementById('searchToggle');
  const navSearch = document.querySelector('.nav-search');
  const searchInput = document.getElementById('searchInput');
  const drinkCards = document.querySelectorAll('.cards-container .card');
  const carouselCards = document.querySelectorAll('.carousel-card');

  searchToggle?.addEventListener('click', () => {
    navSearch.classList.toggle('active');
    if(navSearch.classList.contains('active')) searchInput.focus();
  });

  document.addEventListener('click', e => {
    if(!navSearch.contains(e.target) && !searchToggle.contains(e.target)){
      navSearch.classList.remove('active');
    }
  });

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    drinkCards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = name.includes(query) ? '' : 'none';
    });
    carouselCards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      card.style.display = name.includes(query) ? '' : 'none';
    });
  });

  // -------------------------
  // Featured cards: quantity + 3D tilt
  // -------------------------
  document.querySelectorAll('.featured-card').forEach(card => {
    const plus = card.querySelector('.plus');
    const minus = card.querySelector('.minus');
    const quantity = card.querySelector('.quantity');

    if(plus) plus.addEventListener('click', () => quantity.textContent = parseInt(quantity.textContent) + 1);
    if(minus) minus.addEventListener('click', () => {
      let val = parseInt(quantity.textContent);
      if(val > 1) quantity.textContent = val - 1;
    });

    const container = card.querySelector('.image-container');
    const img = container?.querySelector('img');
    if(container && img){
      container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * 10;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
        img.style.transform = `scale(1.1) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
      });
      container.addEventListener('mouseleave', () => {
        img.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
      });
    }
  });

});
