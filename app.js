// STIKMANIA B2B - JavaScript Puro (CSP Compatible)

// 1. Loading Screen
window.addEventListener('load', function() {
    var loader = document.getElementById('loader');
    if (loader) {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() { loader.remove(); }, 500);
        }, 800);
    }
});

// 2. Scroll Reveal Animation (Reemplaza AOS)
function reveal() {
    var elements = document.querySelectorAll('.fade-in, .zoom-in, .flip-up');
    elements.forEach(function(element) {
        var windowHeight = window.innerHeight;
        var elementTop = element.getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}
window.addEventListener('scroll', reveal);
reveal(); // Ejecutar al cargar

// 3. FAQ Toggle
var faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(function(question) {
    question.addEventListener('click', function() {
        var answer = this.nextElementSibling;
        var sign = this.querySelector('span:last-child');
        
        if (answer.classList.contains('show')) {
            answer.classList.remove('show');
            sign.textContent = '+';
        } else {
            answer.classList.add('show');
            sign.textContent = '-';
        }
    });
});

// 4. B2B Calculator
var btnCalculate = document.querySelector('.btn-calculate');
if (btnCalculate) {
    btnCalculate.addEventListener('click', calculateB2B);
}

function calculateB2B() {
    var qty = parseInt(document.getElementById('b2bQty').value) || 50;
    var w = parseFloat(document.getElementById('b2bW').value) || 5;
    var h = parseFloat(document.getElementById('b2bH').value) || 5;
    var material = document.getElementById('b2bMaterial').value;
    
    var basePricePerUnit = 0;
    if (material === 'vinyl') basePricePerUnit = 0.15;
    else if (material === 'photo') basePricePerUnit = 0.10;
    else if (material === 'transparent') basePricePerUnit = 0.20;
    
    var area = w * h;
    var sizeMultiplier = 1;
    if (area > 25) sizeMultiplier = 1.5;
    if (area > 50) sizeMultiplier = 2.0;
    
    var total = qty * basePricePerUnit * sizeMultiplier;
    
    var discountText = "";
    if (qty >= 500) {
        total = total * 0.80;
        discountText = "🎉 ¡Descuento del 20% por volumen mayorista aplicado!";
    } else if (qty >= 200) {
        total = total * 0.90;
        discountText = "✨ Descuento del 10% por volumen aplicado.";
    }
    
    var matName = material === 'vinyl' ? 'Vinilo Impermeable' : (material === 'transparent' ? 'Vinilo Transparente' : 'Papel Fotográfico');
    
    document.getElementById('b2bSummary').textContent = qty + ' uds de ' + w + 'x' + h + ' cm en ' + matName;
    document.getElementById('b2bPrice').textContent = '$' + total.toFixed(2) + ' USD';
    document.getElementById('b2bDiscount').textContent = discountText;
    
    var msg = '🏢 *COTIZACIÓN B2B - STIKMANIA*\n\n• Cantidad: ' + qty + ' unidades\n• Tamaño: ' + w + 'x' + h + ' cm\n• Material: ' + matName + '\n• Presupuesto estimado: $' + total.toFixed(2) + ' USD\n\n✅ Me gustaría formalizar este pedido.';
    document.getElementById('b2bWhatsApp').href = 'https://wa.me/5359758756?text=' + encodeURIComponent(msg);
    
    document.getElementById('b2bResult').classList.add('show');
    document.getElementById('b2bResult').scrollIntoView({behavior: 'smooth', block: 'nearest'});
}

// 5. Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ SW registrado:', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ Error SW:', error);
            });
    });
}