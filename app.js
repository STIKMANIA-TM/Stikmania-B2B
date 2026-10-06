// STIKMANIA B2B - Main JavaScript (CSP Compatible)

// 1. Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 800);
    }
});

// 2. AOS Animation Init
if (typeof AOS !== 'undefined') {
    AOS.init({ 
        duration: 800, 
        once: true, 
        offset: 100, 
        easing: 'ease-out-cubic' 
    });
}

// 3. Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    reveals.forEach(element => {
        var windowHeight = window.innerHeight;
        var elementTop = element.getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add("active");
        }
    });
}
window.addEventListener("scroll", reveal);
reveal();

// 4. FAQ Toggle (Sin onclick en línea)
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const sign = this.querySelector('span:last-child');
        
        if (answer.classList.contains('show')) {
            answer.classList.remove('show');
            sign.textContent = '+';
        } else {
            answer.classList.add('show');
            sign.textContent = '-';
        }
    });
});

// 5. B2B Calculator (Sin onclick en línea)
const btnCalculate = document.querySelector('.btn-calculate');
if (btnCalculate) {
    btnCalculate.addEventListener('click', calculateB2B);
}

function calculateB2B() {
    const qty = parseInt(document.getElementById('b2bQty').value) || 50;
    const w = parseFloat(document.getElementById('b2bW').value) || 5;
    const h = parseFloat(document.getElementById('b2bH').value) || 5;
    const material = document.getElementById('b2bMaterial').value;
    
    // Lógica B2B: Precio base por unidad disminuye con el volumen
    let basePricePerUnit = 0;
    if (material === 'vinyl') basePricePerUnit = 0.15;
    else if (material === 'photo') basePricePerUnit = 0.10;
    else if (material === 'transparent') basePricePerUnit = 0.20;
    
    // Factor de tamaño
    const area = w * h;
    let sizeMultiplier = 1;
    if (area > 25) sizeMultiplier = 1.5;
    if (area > 50) sizeMultiplier = 2.0;
    
    let total = qty * basePricePerUnit * sizeMultiplier;
    
    // Descuentos por volumen B2B
    let discountText = "";
    if (qty >= 500) {
        total = total * 0.80; // 20% descuento
        discountText = "🎉 ¡Descuento del 20% por volumen mayorista aplicado!";
    } else if (qty >= 200) {
        total = total * 0.90; // 10% descuento
        discountText = "✨ Descuento del 10% por volumen aplicado.";
    }
    
    const matName = material === 'vinyl' ? 'Vinilo Impermeable' : (material === 'transparent' ? 'Vinilo Transparente' : 'Papel Fotográfico');
    
    document.getElementById('b2bSummary').textContent = `${qty} uds de ${w}x${h} cm en ${matName}`;
    document.getElementById('b2bPrice').textContent = `$${total.toFixed(2)} USD`;
    document.getElementById('b2bDiscount').textContent = discountText;
    
    // WhatsApp Link
    const msg = `🏢 *COTIZACIÓN B2B - STIKMANIA*\n\n• Cantidad: ${qty} unidades\n• Tamaño: ${w}x${h} cm\n• Material: ${matName}\n• Presupuesto estimado: $${total.toFixed(2)} USD\n\n✅ Me gustaría formalizar este pedido o agendar una llamada para revisar los detalles de diseño.`;
    document.getElementById('b2bWhatsApp').href = `https://wa.me/5359758756?text=${encodeURIComponent(msg)}`;
    
    document.getElementById('b2bResult').classList.add('show');
    document.getElementById('b2bResult').scrollIntoView({behavior: 'smooth', block: 'nearest'});
}

// 6. Service Worker Registration (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('✅ SW registrado:', registration.scope))
            .catch(error => console.log('❌ Error SW:', error));
    });
}