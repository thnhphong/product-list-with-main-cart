document.addEventListener('DOMContentLoaded', () => {
  fetchJSONData()
})
let cartItems = {}
const uniqueItems = new Set()
function fetchJSONData(){
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const menuContainer = document.getElementById('menu-container')
      populateMenu(data, menuContainer)
      attachEventListeners()
    })
    .catch(error => {
      console.error('Error fetching data: ', error)
    })
}
function populateMenu(data, menuContainer){
  function renderMenuItems(){ 
  const isMobile = window.matchMedia("(max-width: 375px").matches
  data.forEach(item => {
    const menuItem = document.createElement('div')
    menuItem.classList.add('menu-item')
    const imageUrl = isMobile ? item.image.mobile : item.image.desktop
    menuItem.innerHTML = `
      <div class="card border-0">
        <img src="${imageUrl}" alt="${item.name}" class="desserts-img img-fluid">
        <button class="add-to-cart fw-medium" data-name="${item.name}" data-price="${item.price}" data-image="${item.image.desktop}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 21 20">
            <g fill="#C73B0F" clip-path="url(#a)">
              <path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/>
              <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/>
            </g>
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M.333 0h20v20h-20z"/>
              </clipPath>
            </defs>
          </svg>
          Add to Cart
        </button>
        <div class="quantity-control" data-name="${item.name}">
          <button class="decrease">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
              <path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
            </svg>
          </button>
          <span class="quantity text-center">1</span>
          <button class="increase">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
              <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
            </svg>
          </button>
        </div>
      </div>
      <p class="category fw-light">${item.category}</p>
      <h5 class="name fw-bold">${item.name}</h5>
      <p class="price text-danger fw-bold">$${item.price.toFixed(2)}</p>
    `;
    menuContainer.appendChild(menuItem)
  })
}
    renderMenuItems()
    window.addEventListener('resize', renderMenuItems)
}
function attachEventListeners(){
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', handleAddToCart)
  })
  document.getElementById('cart').addEventListener('click', (e) => {
    if (e.target.classList.contains('confirm-order_btn')) {
      confirmOrder();
    }
  })
}
function showOverlay(){
  const overlay = document.getElementById('screen-overlay')
  const popup = document.querySelector('.order-confirm-popup')
  if(overlay){
    overlay.style.display = 'block'
    overlay.addEventListener('click', hideOverlay)
  }
  if(popup){
    popup.style.display = 'block'
  }
}
function hideOverlay() {
    const overlay = document.getElementById('screen-overlay');
    const popup = document.querySelector('.order-confirm-popup')
    if (overlay) {
        overlay.style.display = 'none';
    }
     if (popup) {
        popup.style.display = 'none'; 
    }
}
function checkItems0(){
  const cart = document.getElementById('cart')
  if(Object.keys(cartItems).length === 0){
    cart.classList.add('cart-default')
    cart.classList.remove('cart')
  }
}
function confirmOrder() {
    showOverlay()
    const totalAmount = Object.values(cartItems).reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2)   
    const popup = document.createElement('div')
    popup.classList.add('order-confirm-popup')
    const isMobile = window.innerWidth <= 375
    console.log(isMobile)
    const maxItemsToShow = isMobile ? 3 : 5
    let itemsHTML = `
                <span class="order-confirm-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 32.121L13.5 24.6195L15.6195 22.5L21 27.879L32.3775 16.5L34.5 18.6225L21 32.121Z" fill="#1EA575"/>
<path d="M24 3C19.8466 3 15.7865 4.23163 12.333 6.53914C8.8796 8.84665 6.18798 12.1264 4.59854 15.9636C3.0091 19.8009 2.59323 24.0233 3.40352 28.0969C4.21381 32.1705 6.21386 35.9123 9.15077 38.8492C12.0877 41.7861 15.8295 43.7862 19.9031 44.5965C23.9767 45.4068 28.1991 44.9909 32.0364 43.4015C35.8736 41.812 39.1534 39.1204 41.4609 35.667C43.7684 32.2135 45 28.1534 45 24C45 18.4305 42.7875 13.089 38.8493 9.15076C34.911 5.21249 29.5696 3 24 3ZM24 42C20.4399 42 16.9598 40.9443 13.9997 38.9665C11.0397 36.9886 8.73256 34.1774 7.37018 30.8883C6.0078 27.5992 5.65134 23.98 6.34587 20.4884C7.04041 16.9967 8.75474 13.7894 11.2721 11.2721C13.7894 8.75473 16.9967 7.0404 20.4884 6.34587C23.98 5.65133 27.5992 6.00779 30.8883 7.37017C34.1774 8.73255 36.9886 11.0397 38.9665 13.9997C40.9443 16.9598 42 20.4399 42 24C42 28.7739 40.1036 33.3523 36.7279 36.7279C33.3523 40.1036 28.7739 42 24 42Z" fill="#1EA575"/>
</svg>
            </span>
                <h4 class="fw-bold fs-2">Order Confirmed</h4>
                <p class="text-black-50">We hope you enjoy our food!</p>
                <div class="order-confirm-list ${Object.keys(cartItems).length > maxItemsToShow ? 'scrollable' : ''}">
                `
                ;
    let itemCount = 0
    console.log(maxItemsToShow)
    for (const [itemId, item] of Object.entries(cartItems)) {
      itemCount++
        itemsHTML += `
            <div class="order-confirm h-90 p-3 border-bottom">
                <img class="rounded" width="50" height="50" src="${item.image}"/>
                <div class="confirmed-details">
                <h4 class="name ml-2">${itemId}</h4>
               <div class="confirmed-details_mini d-flex">
                <p class="quantity text-danger">${item.quantity}x</p>
                <p class="price">@${item.price.toFixed(2)}</p>
               </div>
                </div>
                <div class="total d-flex align-items-center justify-content-end fw-bold">$${(item.quantity * item.price).toFixed(2)}</div>
             </div>
        `;
    }
    itemCount += '</div>'
    popup.innerHTML = itemsHTML;
    popup.innerHTML += `
        <div class="order-summary d-flex justify-content-between mt-4">
            <p class="total-amount fw-medium">Order Total: </p>
            <h4 class="fw-bold">$${totalAmount}</h4>
        </div>
        </div>
        <button onclick="startNew()" class="start-new-order">Start New Order</button>
    `;
    document.body.appendChild(popup);

    const listElement = document.querySelector('.order-confirm-list');
    if (itemCount > maxItemsToShow && listElement) {
        listElement.classList.add('scrollable');
    }
    requestAnimationFrame(() =>{
      popup.classList.add('show')
    })
}
function resetCart() {
  const cart = document.getElementById('cart');
  const cartTitle = cart.querySelector('h4');
  cartTitle.textContent = 'Your Cart(0)';
  cart.innerHTML = `
    <h4 class="text-danger fw-semibold">Your Cart(${getTotalItemCount()})</h4>
    <div class="list-of-order">
      ${orderHTML}
    </div>
    <div class="d-flex justify-content-between mt-4">
      <p>Order Total</p>
      <h3 class="total">$${total.toFixed(2)}</h3>
    </div>
     <div class="carbon-neutral-delivery">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
                    <path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/>
                    <path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/>
                </svg>
                <p class="m-0>   This is a <b>carbon-neutral</b> delivery</p>
            </div>
            <button class="confirm-order_btn">Confirm Order</button>
  `;
}
function startNew(){
  cartItems = {}
  uniqueItems.clear()
  updateCart()
  document.querySelectorAll('.menu-item .desserts-img').forEach(img => img.classList.remove('red-border'))
  document.querySelectorAll('.quantity-control').forEach(control => control.classList.remove('show'))
  document.querySelector('.order-confirm-popup').remove()
  hideOverlay()
  resetCart()
}
function handleAddToCart(e){
  const button = e.currentTarget
  const menuItem = e.currentTarget.closest('.menu-item')
  if (menuItem) {
     const {name, price} = button.dataset
     const priceNumber = parseFloat(price);
    const dessertsImg = menuItem.querySelector('.card .desserts-img')
    const imageUrl = dessertsImg ? dessertsImg.src: ''
    const quantityControl = menuItem.querySelector('.quantity-control')
    dessertsImg.classList.add('red-border')
    e.currentTarget.classList.add('hidden')
    quantityControl.classList.add('show')
    const quantityNum = quantityControl.querySelector('.quantity')
    const decrease = quantityControl.querySelector('.decrease')
    const increase = quantityControl.querySelector('.increase')
    let currentQuantity = parseInt(quantityNum.textContent, 10)
    quantityNum.addEventListener('click', () => {
      quantityControl.contentEditable = true
      quantityControl.focus()
    })
    decrease.addEventListener('click', () => {
      if(currentQuantity <= 0){
        resetCart();
      }
      if(currentQuantity > 1){
        currentQuantity--
        quantityNum.textContent = currentQuantity
        console.log(currentQuantity)
        addToCart(name, currentQuantity, priceNumber, imageUrl);
      }else if(currentQuantity === 1){
        removeFromCart(name)
        if(dessertsImg){
          dessertsImg.classList.remove('red-border')
        }
        if(quantityControl){
          quantityControl.querySelector('.quantity').textContent = '1'
          quantityControl.classList.remove('show')
        }
      }
    })
    increase.addEventListener('click', () => {
      currentQuantity++
      quantityNum.textContent = currentQuantity
      addToCart(name, currentQuantity, priceNumber, imageUrl);
    })
     addToCart(name, currentQuantity, priceNumber, imageUrl);
     updateCartHeight()
  }
}
  let itemCount = 0;
function updateCartHeight() {
  const listOfOrder = document.querySelector('.list-of-order')
  const itemCount = listOfOrder.children.length
  const initialHeight = 340
  const itemHeight = 80
  const maxHeight = initialHeight + itemHeight * 4
  const newHeight = initialHeight + (itemCount - 1) * itemHeight
  cart.style.height = `${newHeight}px`
  if(newHeight <= maxHeight){
    cart.style.height = `${newHeight}px`
    listOfOrder.classList.remove('scrollable')
  }else{
     cart.style.height = `${maxHeight}px`
     listOfOrder.classList.add('scrollable')
  }
}
function addToCart(name, quantity, price, imageUrl){
  cart.style.background = '#fff'
  quantity = parseInt(quantity)
  if(cartItems[name]){
    cartItems[name].quantity = quantity
  }else{
    cartItems[name] = {name: name, quantity: quantity, price: price, image: imageUrl}
    uniqueItems.add(name)
  }
  updateCart()
}
function removeFromCart(name){
  if(cartItems[name]){
    const delItem = cartItems[name].name
    const elementRedBorder = document.querySelector(`.red-border[alt="${delItem}"]`)
    const quantityControl = document.querySelector(`.quantity-control[data-name="${delItem}"]`)
    if (elementRedBorder) {
      elementRedBorder.classList.remove('red-border');
    }
    if (quantityControl) {
      quantityControl.classList.remove('show');
    }
    delete cartItems[name]
    updateCart()
    updateCartHeight()
    }
}
function getTotalItemCount(){
  return Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
}
function updateCart() {
  const cart = document.getElementById('cart')
  cart.classList.add('adding')
  let orderHTML = ''
  let total = 0;
  let hasItems = false;
  if(cartItems && typeof cartItems === 'object' && Object.keys(cartItems).length > 0){
    hasItems = true
  for (const [itemName, itemDetails] of Object.entries(cartItems)) {
    const itemPrice = parseFloat(itemDetails.price);
    const itemTotal = itemDetails.quantity * itemPrice;
    total += itemTotal;
    orderHTML += `
      <div class="order">
        <p class="name fw-bold pb-1">${itemName}</p>
        <div class="details d-flex justify-content-between">
          <p class="details-quantity">${itemDetails.quantity}x</p>
          <p class="details-price fw-light">@$${itemPrice.toFixed(2)}</p>
          <p class="details-total fw-medium">$${itemTotal.toFixed(2)}</p>
        </div>
        <div class="del" onclick="removeFromCart('${itemName}')">
          <svg class="del-svg" xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 10 10">
            <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
          </svg>
        </div>
      </div>`;
  }
  const cartHTML = `
    <h4 class="text-danger fw-semibold">Your Cart(${getTotalItemCount()})</h4>
    <div class="list-of-order">
      ${orderHTML}
    </div>
    <div class="list-text d-flex justify-content-between mt-4">
      <p class="order-total">Order Total</p>
      <h3 class="total">$${total.toFixed(2)}</h3>
    </div>
     <div class="carbon-neutral-delivery d-flex justify-content-center gap-2 mb-2">
                <svg class="carbon-icon" xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
                    <path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/>
                    <path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/>
                </svg>
             <p class="mb-2">   This is a <b>carbon-neutral</b> delivery</p>
            </div>
            <button class="confirm-order_btn mt-2">Confirm Order</button>
  `;
  cart.innerHTML = cartHTML;
  updateCartHeight()
  cart.classList.remove('adding');
}else{
  const cartHTML = `
      <h4 class="text-danger fw-semibold">Your Cart(0)</h4>
      <div class="cake text-center"><svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="none" viewBox="0 0 128 128">
        <path fill="#260F08"
          d="M8.436 110.406c0 1.061 4.636 2.079 12.887 2.829 8.252.75 19.444 1.171 31.113 1.171 11.67 0 22.861-.421 31.113-1.171 8.251-.75 12.887-1.768 12.887-2.829 0-1.061-4.636-2.078-12.887-2.828-8.252-.75-19.443-1.172-31.113-1.172-11.67 0-22.861.422-31.113 1.172-8.251.75-12.887 1.767-12.887 2.828Z"
          opacity=".15" />
        <path fill="#87635A"
          d="m119.983 24.22-47.147 5.76 4.32 35.36 44.773-5.467a2.377 2.377 0 0 0 2.017-1.734c.083-.304.104-.62.063-.933l-4.026-32.986Z" />
        <path fill="#AD8A85" d="m74.561 44.142 47.147-5.754 1.435 11.778-47.142 5.758-1.44-11.782Z" />
        <path fill="#CAAFA7"
          d="M85.636 36.78a2.4 2.4 0 0 0-2.667-2.054 2.375 2.375 0 0 0-2.053 2.667l.293 2.347a3.574 3.574 0 0 1-7.066.88l-1.307-10.667 14.48-16.88c19.253-.693 34.133 3.6 35.013 10.8l1.28 10.533a1.172 1.172 0 0 1-1.333 1.307 4.696 4.696 0 0 1-3.787-4.08 2.378 2.378 0 1 0-4.72.587l.294 2.346a2.389 2.389 0 0 1-.484 1.755 2.387 2.387 0 0 1-1.583.899 2.383 2.383 0 0 1-1.755-.484 2.378 2.378 0 0 1-.898-1.583 2.371 2.371 0 0 0-1.716-2.008 2.374 2.374 0 0 0-2.511.817 2.374 2.374 0 0 0-.493 1.751l.293 2.373a4.753 4.753 0 0 1-7.652 4.317 4.755 4.755 0 0 1-1.788-3.17l-.427-3.547a2.346 2.346 0 0 0-2.666-2.053 2.4 2.4 0 0 0-2.08 2.667l.16 1.173a2.378 2.378 0 1 1-4.72.587l-.107-1.28Z" />
        <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width=".974"
          d="m81.076 28.966 34.187-4.16" />
        <path fill="#87635A"
          d="M7.45 51.793c-.96 8.48 16.746 17.44 39.466 19.947 22.72 2.506 42.08-2.16 43.04-10.667l-3.947 35.493c-.96 8.48-20.24 13.334-43.04 10.667S2.463 95.74 3.423 87.18l4.026-35.387Z" />
        <path fill="#AD8A85"
          d="M5.823 65.953c-.96 8.453 16.746 17.44 39.573 20.027 22.827 2.586 42.053-2.187 43.013-10.667L87.076 87.1c-.96 8.48-20.24 13.333-43.04 10.666C21.236 95.1 3.53 86.22 4.49 77.74l1.334-11.787Z" />
        <path fill="#CAAFA7"
          d="M60.836 42.78a119.963 119.963 0 0 0-10.347-1.627c-24-2.667-44.453 1.893-45.333 10.373l-2.133 18.88a3.556 3.556 0 1 0 7.066.8 3.574 3.574 0 1 1 7.094.8l-.8 7.094a5.93 5.93 0 1 0 11.786 1.333 3.556 3.556 0 0 1 7.067.8l-.267 2.347a3.573 3.573 0 0 0 7.094.826l.133-1.2a5.932 5.932 0 1 1 11.787 1.36l-.4 3.52a3.573 3.573 0 0 0 7.093.827l.933-8.267a1.174 1.174 0 0 1 1.307-.906 1.146 1.146 0 0 1 1.04 1.306 5.947 5.947 0 0 0 11.813 1.334l.534-4.72a3.556 3.556 0 0 1 7.066.8 3.573 3.573 0 0 0 7.094.826l1.786-15.546a2.373 2.373 0 0 0-2.08-2.667L44.143 55.74l16.693-12.96Z" />
        <path fill="#87635A" d="m59.156 57.66 1.68-14.88-16.827 13.173 15.147 1.707Z" />
        <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width=".974"
          d="M9.796 52.06c-.667 5.866 16.24 12.586 37.733 15.04 14.774 1.68 27.867.906 34.854-1.654" />
      </svg></div>
      <p class="text-center">Your added items will appear here</p>
  `
  cart.innerHTML = cartHTML
}
}