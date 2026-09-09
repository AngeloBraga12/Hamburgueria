const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = [];

cartBtn.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'flex';
});

cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

menu.addEventListener('click', (event) => {
    const parentButton = event.target.closest('.add-to-cart-btn');
    if (!parentButton) return;

    const name = parentButton.dataset.name;
    const price = Number.parseFloat(parentButton.dataset.price);

    if (!name || Number.isNaN(price)) return;
    addToCart(name, price);
});

function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal();
}

function updateCartModal() {
    cartItemContainer.innerHTML = '';
    let total = 0;
    let quantity = 0;

    cart.forEach((item) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
                </div>
            </div>
        `;

        total += item.price * item.quantity;
        quantity += item.quantity;
        cartItemContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    cartCounter.textContent = quantity;
}

cartItemContainer.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-from-cart-btn');
    if (!removeButton) return;

    removeItemCart(removeButton.dataset.name);
});

function removeItemCart(name) {
    const index = cart.findIndex((item) => item.name === name);
    if (index === -1) return;

    const item = cart[index];

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    updateCartModal();
}

addressInput.addEventListener('input', () => {
    const hasAddress = addressInput.value.trim() !== '';

    addressInput.classList.toggle('border-red-500', !hasAddress);
    addressWarn.classList.toggle('hidden', hasAddress);
});

checkoutBtn.addEventListener('click', () => {
    if (!checkRestaurantOpen()) {
        Toastify({
            text: 'Ops, o restaurante está fechado.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style: { background: '#ef4444' },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    const address = addressInput.value.trim();
    if (!address) {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add('border-red-500');
        addressInput.focus();
        return;
    }

    const cartItem = cart
        .map((item) => `${item.name} | Quantidade: ${item.quantity} | Preço unitário: R$ ${item.price.toFixed(2)}`)
        .join('\n');

    const message = encodeURIComponent(`${cartItem}\nEndereço: ${address}`);
    const phone = '12981765685';

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');

    cart = [];
    addressInput.value = '';
    addressWarn.classList.add('hidden');
    addressInput.classList.remove('border-red-500');
    updateCartModal();
    cartModal.style.display = 'none';
});

function checkRestaurantOpen() {
    const hour = new Date().getHours();
    return hour >= 18 && hour < 22;
}

const spanItem = document.getElementById('date-span');
const isOpen = checkRestaurantOpen();

spanItem.classList.toggle('bg-green-600', isOpen);
spanItem.classList.toggle('bg-red-500', !isOpen);
