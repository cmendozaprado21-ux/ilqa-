/* Ilqa: the order card and the cart. Kept in localStorage so the cart survives a reload. */
(() => {
  const P = {
    clasica:  { name: 'Camiseta clásica', price: 69, img: 'assets/img/c-blanco.webp', colours: [
      { id: 'blanco', name: 'Blanco', hex: '#f2f1ec', img: 'assets/img/c-blanco.webp', alt: 'Camiseta blanca colgada en un perchero de metal sobre fondo blanco' },
      { id: 'gris', name: 'Gris', hex: '#7b7d7f', img: 'assets/img/c-gris.webp', alt: 'Camiseta gris colgada en un perchero de metal sobre fondo blanco' },
      { id: 'negro', name: 'Negro', hex: '#26282b', img: 'assets/img/c-negro.webp', alt: 'Camiseta negra colgada en un perchero de metal sobre fondo blanco' },
      { id: 'marino', name: 'Azul marino', hex: '#1f2a44', img: 'assets/img/c-marino.webp', alt: 'Camiseta azul marino colgada en un perchero de metal sobre fondo blanco' } ] },
    oversize: { name: 'Camiseta oversize', price: 79, colours: [{ id: 'blanco', name: 'Blanco', hex: '#f2f1ec', img: 'assets/img/p-oversize.webp', alt: 'Mujer con camiseta blanca holgada' }] },
    slim:     { name: 'Camiseta slim', price: 69, colours: [{ id: 'blanco', name: 'Blanco', hex: '#f2f1ec', img: 'assets/img/p-slim.webp', alt: 'Hombre con camiseta blanca ajustada' }] },
    pack:     { name: 'Pack de tres camisetas', price: 179, colours: [{ id: 'surtido', name: 'Surtido', hex: '#8a6b4e', img: 'assets/img/p-pack.webp', alt: 'Camisetas dobladas de varios colores' }] },
    polo:     { name: 'Polo piqué', price: 99, colours: [
      { id: 'verde', name: 'Verde', hex: '#2f9d72', img: 'assets/img/p-polo.webp', alt: 'Polos en verde, coral y gris doblados' },
      { id: 'coral', name: 'Coral', hex: '#f0705a', img: 'assets/img/p-polo.webp', alt: 'Polos en verde, coral y gris doblados' },
      { id: 'gris', name: 'Gris', hex: '#8d9091', img: 'assets/img/p-polo.webp', alt: 'Polos en verde, coral y gris doblados' } ] },
    camisa:   { name: 'Camisa de popelina', price: 149, colours: [{ id: 'blanco', name: 'Blanco', hex: '#f2f1ec', img: 'assets/img/p-camisa.webp', alt: 'Hombre con camisa blanca de manga larga' }] },
    sueter:   { name: 'Suéter de punto', price: 189, colours: [{ id: 'tostado', name: 'Marrón tostado', hex: '#7a4a32', img: 'assets/img/p-sueter.webp', alt: 'Suéter de punto marrón en una percha' }] },
    sudadera: { name: 'Sudadera con capucha', price: 169, colours: [{ id: 'marron', name: 'Marrón', hex: '#8a5a3c', img: 'assets/img/p-sudadera.webp', alt: 'Persona con sudadera marrón con capucha' }] },
  };
  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const SHIP = 10;
  const KEY = 'ilqa-cart';
  const $ = (s, r = document) => r.querySelector(s);
  const money = n => 'S/ ' + n.toLocaleString('es-PE');

  const state = { id: 'clasica', colour: 'blanco', size: 'M', qty: 1 };
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }

  const form = $('[data-order]');
  if (!form) return;
  const img = $('[data-order-img]');

  function renderOrder() {
    const p = P[state.id];
    const c = p.colours.find(x => x.id === state.colour) || p.colours[0];
    state.colour = c.id;
    $('[data-order-name]').textContent = p.name;
    $('[data-order-price]').textContent = money(p.price);
    $('[data-order-colour]').textContent = c.name;
    if (img.getAttribute('src') !== c.img) { img.src = c.img; }
    img.alt = c.alt;
    $('[data-swatches]').innerHTML = p.colours.map(x =>
      `<button type="button" class="swatch" style="--sw:${x.hex}" data-colour="${x.id}" aria-pressed="${x.id === c.id}" aria-label="${x.name}"></button>`).join('');
    $('[data-sizes]').innerHTML = SIZES.map(s =>
      `<button type="button" class="size" data-size="${s}" aria-pressed="${s === state.size}">${s}</button>`).join('');
    $('[data-qty-value]').textContent = state.qty;
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }

  function renderCart() {
    const list = $('[data-cart-list]');
    const count = cart.reduce((n, i) => n + i.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; });
    $('[data-cart-empty]').hidden = cart.length > 0;
    $('[data-cart-totals]').hidden = cart.length === 0;
    list.innerHTML = cart.map((i, k) => {
      const p = P[i.id]; const c = p.colours.find(x => x.id === i.colour) || p.colours[0];
      return `<li><img class="cart__thumb" src="${c.img}" alt=""><span class="rows__name">${p.name}</span><span class="rows__value">${money(p.price * i.qty)}</span>` +
        `<span class="cart__meta">${c.name}, talla ${i.size}, ${i.qty} ${i.qty === 1 ? 'unidad' : 'unidades'}</span>` +
        `<button type="button" class="cart__remove" data-remove="${k}">Quitar ${p.name.toLowerCase()}</button></li>`;
    }).join('');
    const sub = cart.reduce((n, i) => n + P[i.id].price * i.qty, 0);
    $('[data-cart-sub]').textContent = money(sub);
    $('[data-cart-total]').textContent = money(sub + (cart.length ? SHIP : 0));
    const field = $('[data-cart-field]');
    if (field) field.value = cart.map(i => `${P[i.id].name} / ${i.colour} / ${i.size} x${i.qty}`).join('; ');
  }

  form.addEventListener('click', e => {
    const sw = e.target.closest('[data-colour]');
    const sz = e.target.closest('[data-size]');
    const q = e.target.closest('[data-qty]');
    if (sw) { state.colour = sw.dataset.colour; renderOrder(); $(`[data-colour="${state.colour}"]`).focus(); }
    if (sz) { state.size = sz.dataset.size; renderOrder(); $(`[data-size="${state.size}"]`).focus(); }
    if (e.target.closest('[data-add]')) addToCart();
    if (q) { state.qty = Math.min(9, Math.max(1, state.qty + Number(q.dataset.qty))); $('[data-qty-value]').textContent = state.qty; }
  });

  function addToCart() {
    const same = cart.find(i => i.id === state.id && i.colour === state.colour && i.size === state.size);
    if (same) same.qty += state.qty; else cart.push({ id: state.id, colour: state.colour, size: state.size, qty: state.qty });
    save(); renderCart();
    const st = $('[data-order-status]');
    st.innerHTML = `Añadido: ${P[state.id].name}, talla ${state.size}. <a class="link" href="#carrito">Ver el carrito</a>`;
  }

  document.addEventListener('click', e => {
    const pick = e.target.closest('[data-pick]');
    if (pick && P[pick.dataset.pick]) {
      state.id = pick.dataset.pick; state.colour = P[state.id].colours[0].id; state.qty = 1;
      $('[data-order-status]').textContent = 'Envío en Lima de 24 a 48 horas.';
      renderOrder();
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { cart.splice(Number(rm.dataset.remove), 1); save(); renderCart(); }
  });

  renderOrder();
  renderCart();
})();
