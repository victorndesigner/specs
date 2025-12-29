document.addEventListener('DOMContentLoaded', () => {
    initParticulas();
    renderizarSpecs();
    // Função typewriter removida conforme solicitação
});

/*
function initTypewriter() {
    const title = document.querySelector('.cabecalho-logo h1');
    if (!title) return;

    // Configurações
    const purplePart = "Specs";
    const whitePart = " do Bolt";
    const fullText = purplePart + whitePart;

    // Estado inicial: Começa completo
    let charIndex = fullText.length;
    let isDeleting = false;

    function typeLoop() {
        // 1. Renderizar o estado atual
        let html = '';
        if (charIndex <= purplePart.length) {
            // Apenas parte roxa visível (parcial ou completa)
            html = `<span class="r-purple">${purplePart.substring(0, charIndex)}</span>`;
        } else {
            // Parte roxa completa + parte branca (parcial ou completa)
            html = `<span class="r-purple">${purplePart}</span><span class="r-white">${whitePart.substring(0, charIndex - purplePart.length)}</span>`;
        }

        title.innerHTML = html;

        // 2. Definir próxima ação e velocidade
        let typeSpeed = 100;

        if (!isDeleting && charIndex === fullText.length) {
            // Texto completo: esperar antes de apagar
            typeSpeed = 3000; // 3 segundos de pausa
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Texto apagado: esperar um pouco antes de reescrever
            typeSpeed = 500;
            isDeleting = false;
        } else {
            // Processo de digitação ou apagamento
            typeSpeed = isDeleting ? 50 : 100;
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
        }

        setTimeout(typeLoop, typeSpeed);
    }

    // Inicia o loop imediatamente
    typeLoop();
}
*/

function renderizarSpecs() {
    const container = document.getElementById('container-blocos');
    const servidorDisplay = document.getElementById('servidor-nome');

    // Define servidorNome se não existir (fallback)
    const nomeServidor = (typeof servidorNome !== 'undefined') ? servidorNome : "Servidor Desconhecido";
    if (servidorDisplay) servidorDisplay.textContent = nomeServidor;

    if (typeof blocosInfo === 'undefined' || !container) return;

    // Ordena: mostrar=true vem primeiro
    const specsOrdenadas = [...blocosInfo].sort((a, b) => (b.mostrar ? 1 : 0) - (a.mostrar ? 1 : 0));

    specsOrdenadas.forEach((info, index) => {
        const bloco = document.createElement('div');
        bloco.className = 'bloco-spec';
        // Adiciona delay na animação para efeito cascata
        bloco.style.animation = `surgirSuave 0.6s ease-out ${index * 0.1}s forwards`;

        let conteudoHTML = `
            <div class="spec-header">
                <span class="spec-nome">${info.nome}</span>
                ${info.mostrar ? `<button class="btn-acao" onclick="copiarID('${info.id}')">Copiar ID</button>` : ''}
            </div>
            <div class="imagem-container">
        `;

        if (info.mostrar) {
            conteudoHTML += `<img src="${info.imagem}" alt="${info.nome}" class="imagem-spec" loading="lazy">`;
        } else {
            conteudoHTML += `<div class="placeholder-box">Bolt ainda não upou...</div>`;
        }

        conteudoHTML += `</div>`; // fecha imagem-container

        if (info.mostrar) {
            conteudoHTML += `<button class="btn-acao btn-visualizar" onclick="visualizarImagem('${info.imagem}')">Visualizar Imagem</button>`;
        }

        bloco.innerHTML = conteudoHTML;
        container.appendChild(bloco);
    });
}

// Funções globais para uso no onClick inline
// Funções globais para uso no onClick inline
window.copiarID = function (id, btnElement) {
    if (!btnElement) btnElement = event.target; // Tenta capturar do evento global se não passado

    navigator.clipboard.writeText(id).then(() => {
        // Feedback visual simples
        const originalText = btnElement.textContent;
        const originalBackground = btnElement.style.background;
        const originalColor = btnElement.style.color;
        const originalBorder = btnElement.style.borderColor;

        btnElement.textContent = "Copiado!";
        btnElement.style.background = "var(--cor-destaque)";
        btnElement.style.color = "#fff"; // White text
        btnElement.style.borderColor = "var(--cor-destaque)";

        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.style.background = originalBackground;
            btnElement.style.color = originalColor;
            btnElement.style.borderColor = originalBorder;
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('ID: ' + id);
    });
};

window.visualizarImagem = function (src) {
    window.open(src, '_blank');
};

function initParticulas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particulas-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let w, h;
    let particulas = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function criarParticula(isMobile) {
        const maxOpacity = isMobile ? 0.3 : 0.5; // Opacidade reduzida no mobile
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            tamanho: Math.random() * 2 + 1,
            cor: `rgba(187, 134, 252, ${Math.random() * maxOpacity})`
        };
    }

    function init() {
        resize();
        const isMobile = w < 768;
        const quantidade = isMobile ? 10 : 15; // 10 mobile, 15 PC conforme novo padrão ultra-clean

        for (let i = 0; i < quantidade; i++) {
            particulas.push(criarParticula(isMobile));
        }
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);
        particulas.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.fillStyle = p.cor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    init();
}
