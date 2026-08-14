const cart = {};
let currentLang = 'ar';

window.addEventListener('DOMContentLoaded', () => {
    const promoVideo = document.getElementById('promoVideo');
    const transitionLogoContainer = document.getElementById('transitionLogoContainer');

    if (promoVideo) {
        promoVideo.addEventListener('ended', () => {
            promoVideo.style.display = 'none';
            if (transitionLogoContainer) {
                transitionLogoContainer.style.display = 'block';
            }
        });
    }
});

function toggleSidebar() {
    document.getElementById('sidebarNav').classList.toggle('active');
}

function filterCategory(category, element = null) {
    const cards = document.querySelectorAll('.box-card');
    const titleEl = document.getElementById('categoryTitle');

    document.getElementById('sidebarNav').classList.remove('active');

    if (element) {
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        element.classList.add('active');
    }

    const titles = {
        'all': currentLang === 'ar' ? 'جميع الوجبات والعروض' : 'All Offers & Meals',
        'single': currentLang === 'ar' ? 'وجبات الفرد' : 'Single Meals',
        'two': currentLang === 'ar' ? 'وجبات لفردين' : 'Double Meals',
        'family': currentLang === 'ar' ? 'وجبات العائلة' : 'Family Meals'
    };
    if (titleEl) titleEl.innerText = titles[category] || titles['all'];

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('mealsGrid').scrollIntoView({ behavior: 'smooth' });
}

function updateQty(mealId, change) {
    const card = document.querySelector(`[data-id="${mealId}"]`);
    const mealName = card.dataset.name;

    if (!cart[mealId]) {
        cart[mealId] = { name: mealName, qty: 0 };
    }

    cart[mealId].qty += change;

    if (cart[mealId].qty <= 0) {
        delete cart[mealId];
        document.getElementById(`qty-${mealId}`).innerText = 0;
    } else {
        document.getElementById(`qty-${mealId}`).innerText = cart[mealId].qty;
    }

    renderCartModal();
}

function renderCartModal() {
    const listContainer = document.getElementById('cartItemsList');
    let totalQty = 0;
    listContainer.innerHTML = '';

    if (Object.keys(cart).length === 0) {
        listContainer.innerHTML = `<p class="empty-msg">${currentLang === 'ar' ? 'السلة فارغة حالياً' : 'Cart is empty'}</p>`;
    } else {
        for (let id in cart) {
            const item = cart[id];
            totalQty += item.qty;
            listContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #222;">
                    <span>${item.name}</span>
                    <strong>${item.qty}</strong>
                </div>
            `;
        }
    }

    document.getElementById('cartBadge').innerText = totalQty;
    document.getElementById('totalMealsCount').innerText = totalQty;
}

function toggleCartModal() {
    document.getElementById('cartModal').classList.toggle('active');
}

function sendOrderToWhatsapp() {
    if (Object.keys(cart).length === 0) {
        alert("السلة فارغة، فضلاً اختر الوجبات أولاً!");
        return;
    }

    let totalQty = 0;
    let message = "طلب جديد من البيك الشامي 🔥🍔\n---------------------------\n";

    for (let id in cart) {
        const item = cart[id];
        totalQty += item.qty;
        message += `• ${item.name} (العدد: ${item.qty})\n`;
    }

    message += `---------------------------\nإجمالي الوجبات: ${totalQty}\n`;
    message += `📍 العنوان: شارع نفق المحروسه سيدي بشر الترام بجوار مكتب البريد، الإسكندرية`;

    const phoneNumber = "201287307518";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}
