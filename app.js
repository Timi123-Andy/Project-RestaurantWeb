// SIDEBAR
const burger = document.getElementById("burgerBtn");
const menu = document.getElementById("mobileMenu");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.getElementById("overlay");

burger.onclick = () => {
  menu.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
  burger.classList.add("burger-open");
};

closeBtn.onclick = closeMenu;
overlay.onclick = closeMenu;

function closeMenu(){
  menu.classList.add("translate-x-full");
  overlay.classList.add("hidden");
  burger.classList.remove("burger-open");
}

/* navbar shrink on scroll */
window.addEventListener("scroll",()=>{
  const nav = document.getElementById("navbar");
  if(window.scrollY > 50){
    nav.classList.add("navbar-shrink");
  } else {
    nav.classList.remove("navbar-shrink");
  }
});

/* ================= CART ================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

// ADD TO CART
function addToCart(name, price){
  const existing = cart.find(i => i.name === name);

  if(existing){
    existing.qty++;
  } else {
    cart.push({name, price, qty:1});
  }

  saveCart();
  updateCartUI();
  showToast(name + " added to cart");
}

// SAVE
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

//TOAST MESSAGE
function showToast(message){
  const toast = document.getElementById("toast");
  if(!toast) return;

  toast.textContent = message;
  toast.classList.remove("opacity-0","pointer-events-none");

  setTimeout(()=>{
    toast.classList.add("opacity-0","pointer-events-none");
  }, 2000);
}

// UPDATE COUNTS
function updateCartUI(){
  const floatCount = document.getElementById("floatCount");
  const navCount = document.getElementById("cartCount");

  let totalQty = cart.reduce((sum,i)=>sum+i.qty,0);
  total = cart.reduce((sum,i)=>sum+i.price*i.qty,0);

  if(floatCount) floatCount.textContent = totalQty;
  if(navCount) navCount.textContent = totalQty;

  renderFloatingCart();
  renderCheckout();
}

/* ================= FLOATING CART ================= */
function renderFloatingCart(){
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if(!list) return;

  list.innerHTML = "";

  cart.forEach(item=>{
    list.innerHTML += `
      <li class="flex justify-between border-b py-2">
        ${item.name} x ${item.qty}
        <span>₦${item.price * item.qty}</span>
      </li>
    `;
  });

  if(totalEl) totalEl.textContent = total;
}

// ================= CHECKOUT CART =================
function renderCheckout() {
  const container = document.getElementById("checkoutItems");
  const totalEl = document.getElementById("totalAmount");
  if(!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="flex justify-between text-gray-300 items-center py-2 border-b">
        <div>
          <b>${item.name}</b> <br>
          ₦${item.price} x ${item.qty}
        </div>
        <div class="flex items-center gap-2">
          <button onclick="decreaseQty(${index})" class="px-2 py-1 bg-gray-500 rounded">−</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${index})" class="px-2 py-1 bg-gray-500 rounded">+</button>
          <button onclick="removeItem(${index})" class="px-2 py-1 bg-red-600 text-white rounded">🗑</button>
        </div>
      </div>
    `;
  });

  if(totalEl) totalEl.textContent = total;
}

// ================= CART FUNCTIONS =================
function increaseQty(i){
  cart[i].qty++;
  saveCart();
  renderCheckout();
  updateCartUI();
}

function decreaseQty(i){
  if(cart[i].qty > 1){
    cart[i].qty--;
  } else {
    cart.splice(i, 1);
  }
  saveCart();
  renderCheckout();
  updateCartUI();
}

function removeItem(i){
  cart.splice(i,1);
  saveCart();
  renderCheckout();
  updateCartUI();
}

// Clear cart
function clearCart(){
  cart = [];
  saveCart();
  renderCheckout();
  updateCartUI();
}

//Place Order 
function placeOrder(){
  if(cart.length === 0){
    showSuccessToast("Cart is empty");
    return;
  }

  cart = [];
  localStorage.removeItem("cart");

  updateCartUI();
  renderCheckout();

  showSuccessToast("Order placed successfully 🎉");
  
  setTimeout(()=>{
  window.location.href = "index.html";
}, 2500);
}

//TOAST MESSAGE
function showSuccessToast(message){
  const toast = document.getElementById("successToast");
  if(!toast) return;

  toast.textContent = message;
  toast.classList.remove("opacity-0","pointer-events-none");

  setTimeout(()=>{
    toast.classList.add("opacity-0","pointer-events-none");
  }, 2500);
}

/* ================= PAGE LOAD ================= */
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartUI();

  const floating = document.getElementById("floatingCart");
  const panel = document.getElementById("cartPanel");

  if(floating && panel){
    floating.onclick = ()=> panel.classList.toggle("open");
  }
});

/* ================= SEARCH ================= */
const searchInput = document.getElementById("searchInput");
if(searchInput){
  searchInput.addEventListener("keyup", ()=>{
    const val = searchInput.value.toLowerCase();
    document.querySelectorAll(".menu-item").forEach(item=>{
      item.style.display =
        item.innerText.toLowerCase().includes(val) ? "block":"none";
    });
  });
}

/* ================= FILTER ================= */
function filterMenu(cat){
  document.querySelectorAll(".menu-item").forEach(item=>{
    if(cat==="all" || item.dataset.category===cat){
      item.style.display="block";
    }else{
      item.style.display="none";
    }
  });
}

/* ================= SCROLL ANIMATION ================= */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("active");
    }
  });
});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
  
  /* ABOUT PAGE*/
  if (document.querySelectorAll(".about-reveal").length) {
  document.querySelectorAll(".about-reveal").forEach(el => observer.observe(el));
}
  

// Close sidebar when screen resized to desktop
window.addEventListener("resize", ()=>{
  if(window.innerWidth>768){
    closeMenu();
  }
});
