// ----------------------------------------------
// animação de entrada da seção de tecnologias com GSAP e ScrollTrigger
// ----------------------------------------------
gsap.registerPlugin(ScrollTrigger);

const grade = document.querySelector(".tecnologias-grid");

const cardsOriginais = Array.from(
    grade.querySelectorAll(".card-tecnologia")
);

// Divide os 8 cards em 2 grupos
const grupos = [
    cardsOriginais.slice(0, 4),
    cardsOriginais.slice(4, 8)
];

// Limpa a grade para reconstruir em duas vias
grade.replaceChildren();

grupos.forEach((lista, index) => {

    const faixa = document.createElement("div");
    faixa.className = "tecnologias-faixa";

    if (index === 1) {
        faixa.classList.add("faixa-direita");
    }

    const trilho = document.createElement("div");
    trilho.className = "tecnologias-trilho";

    const grupo = document.createElement("div");
    grupo.className = "tecnologias-grupo";

    lista.forEach(card => grupo.appendChild(card));

    // Duplica os cards para criar o loop infinito

    const copia = grupo.cloneNode(true);

    // Evita que leitores de tela anunciem
    // os mesmos cards duas vezes.
    copia.setAttribute("aria-hidden", "true");

    // Adiciona os cards duplicados
    trilho.append(grupo, copia);
    faixa.appendChild(trilho);
    grade.appendChild(faixa);

});


// Criamos uma timeline vinculada ao scroll da seção inteira

gsap.from(".tecnologias-header > *", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",

    scrollTrigger: {
        trigger: "#tecnologias",
        start: "top 80%",
        once: true
    }
});


const cards = document.querySelectorAll(".card-tecnologia");

cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // Posição X do mouse dentro do card
        const y = e.clientY - rect.top;  // Posição Y do mouse dentro do card

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calcula a rotação baseada na distância até o centro
        const rotateX = ((y - centerY) / centerY) * -15; // Inclina até 15 graus
        const rotateY = ((x - centerX) / centerX) * 15;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 800,
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto" // Evita conflitos se o mouse se mover rapidamente
        });
    });

    // Quando o mouse sai, o card volta suavemente ao normal
    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto",
            onComplete: () => {
                gsap.set(card, {
                    clearProps: "transform"
                });
            }
        });
    });
});

// ----------------------------------------------
// Animação da seção Hero
// ----------------------------------------------

const animacaoHome = gsap.timeline({
    defaults: {
        ease: "power4.out", // Desaceleração mais dramática e suave
        duration: 1.2
    }
});

animacaoHome
    // 1. Subtítulo: junta as letras aos poucos enquanto ganha foco
    .from(".hero .subtitulo", {
        y: 20,
        letterSpacing: "0.25em", // Começa mais espaçado e contrai para o original
        filter: "blur(8px)",
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        clearProps: "letterSpacing,filter"
    })

    // 2. Título Principal (H1): sobe com inclinação 3D e foco progressivo
    .from(".hero h1", {
        y: 80,
        rotationX: -20, // Inclinação 3D sutil
        transformPerspective: 1000,
        scale: 0.95,
        filter: "blur(12px)",
        opacity: 0,
        duration: 1.4,
        clearProps: "transform,filter"
    }, "-=1.0") // Começa 1s antes do subtítulo terminar

    // 3. Descrição: subida suave emergindo do desfoque
    .from(".hero .descricao", {
        y: 40,
        filter: "blur(6px)",
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "transform,filter"
    }, "-=0.9");

// ----------------------------------------------
// Animação da seção sobre mim
// ----------------------------------------------   


const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {

    const animacaoSobre = gsap.timeline({
        scrollTrigger: {
            trigger: "#sobre",
            start: "top 75%",
            once: true
        },
        defaults: {
            ease: "power3.out"
        }
    });

    animacaoSobre
        // 1. Esquerda: Textos entram em cascata suave
        .from(".sobre-texto > *", {
            x: -35,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            clearProps: "all"
        })

        // 2. Direita (O Card): Abre de cima para baixo como uma máscara
        .fromTo(".sobre-card",
    {
        clipPath: "inset(0% 0% 100% 0% round 20px)",
        y: 30,
        opacity: 0
    },
    {
        clipPath: "inset(0% 0% 0% 0% round 20px)",
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power4.out",
        clearProps: "clipPath,transform,opacity"
    },
    "-=0.6"
)

        // 3. Itens dentro do Card: Sobem suavemente acompanhando a abertura
        .from(".sobre-card > *", {
            y: 15,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            clearProps: "all"
        }, "-=0.6")

});



// ----------------------------------------------
// GALERIA INTERATIVA — OHNEYMAR!
// ----------------------------------------------

const projetos = document.querySelectorAll(".projeto-destaque");

const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

projetos.forEach((projeto) => {
    const imagens = projeto.querySelectorAll(".projeto-imagens img");
    const indicadores = projeto.querySelectorAll(".galeria-indicadores span");
    const anterior = projeto.querySelector(".galeria-anterior");
    const proximo = projeto.querySelector(".galeria-proximo");

    if (!imagens.length) return;

    let indiceAtual = 0;
    let intervalo = null;
    let animando = false;

    // 1. Animação de entrada do Card quando rola a página (ScrollTrigger)
    if (!movimentoReduzido) {
        gsap.from(projeto, {
            scrollTrigger: {
                trigger: projeto,
                start: "top 80%",
                once: true
            },
            y: 60,
            opacity: 0,
            scale: 0.96,
            duration: 1.05,
            ease: "power3.out",
            clearProps: "all"
        });
    }

    // 2. Função que troca a imagem com transição suave GSAP
    function mostrarImagem(novoIndice, direcao = 1) {
        const proximoIndice = (novoIndice + imagens.length) % imagens.length;
        if (proximoIndice === indiceAtual || animando) return;

        const imagemAtual = imagens[indiceAtual];
        const novaImagem = imagens[proximoIndice];

        // Atualiza indicadores (tracinhos embaixo da foto)
        indicadores.forEach((ind, i) => {
            ind.classList.toggle("ativo", i === proximoIndice);
        });

        // Atualiza acessibilidade e classes
        imagemAtual.setAttribute("aria-hidden", "true");
        novaImagem.setAttribute("aria-hidden", "false");
        imagemAtual.classList.remove("ativa");
        novaImagem.classList.add("ativa");

        // Se o usuário preferir sem movimento, troca sem animar
        if (movimentoReduzido) {
            indiceAtual = proximoIndice;
            return;
        }

        animando = true;

        // Animação suave entre a imagem que sai e a que entra
        gsap.fromTo(novaImagem,
            {
                opacity: 0,
                scale: 1.04,
                xPercent: direcao * 5 // Desliza sutilmente da direção do clique
            },
            {
                opacity: 1,
                scale: 1,
                xPercent: 0,
                duration: 0.55,
                ease: "power2.out",
                clearProps: "transform,opacity",
                onComplete: () => {
                    animando = false;
                }
            }
        );

        indiceAtual = proximoIndice;
    }

    function proximaImagem() {
        mostrarImagem(indiceAtual + 1, 1);
    }

    function imagemAnterior() {
        mostrarImagem(indiceAtual - 1, -1);
    }

    // Reinicia o timer automático quando o usuário interage manualmente
    function reiniciarTimer() {
        if (!temMouse || movimentoReduzido || !intervalo) return;
        clearInterval(intervalo);
        intervalo = setInterval(proximaImagem, 3000);
    }

    // 3. Eventos de clique nas setas
    if (proximo) {
        proximo.addEventListener("click", () => {
            proximaImagem();
            reiniciarTimer();
        });
    }

    if (anterior) {
        anterior.addEventListener("click", () => {
            imagemAnterior();
            reiniciarTimer();
        });
    }

    // 4. Permite clicar diretamente nos indicadores inferiores
    indicadores.forEach((indicador, i) => {
        indicador.style.cursor = "pointer";
        indicador.addEventListener("click", () => {
            const direcao = i > indiceAtual ? 1 : -1;
            mostrarImagem(i, direcao);
            reiniciarTimer();
        });
    });

    // 5. Suporte a Swipe (arrastar com o dedo no celular)
    let toqueInicioX = 0;
    projeto.addEventListener("touchstart", (e) => {
        toqueInicioX = e.changedTouches[0].screenX;
    }, { passive: true });

    projeto.addEventListener("touchend", (e) => {
        const toqueFimX = e.changedTouches[0].screenX;
        const diferenca = toqueInicioX - toqueFimX;

        if (Math.abs(diferenca) > 40) { // Sensibilidade do arrasto
            if (diferenca > 0) proximaImagem();
            else imagemAnterior();
        }
    }, { passive: true });

    // 6. Autoplay inteligente ao passar o mouse
    projeto.addEventListener("mouseenter", () => {
        if (!temMouse || movimentoReduzido) return;
        clearInterval(intervalo);
        intervalo = setInterval(proximaImagem, 3000);
    });

    projeto.addEventListener("mouseleave", () => {
        clearInterval(intervalo);
        intervalo = null;
        mostrarImagem(0, -1); // Volta suavemente para a capa ao tirar o mouse
    });
});



// ----------------------------------------------
// ANIMAÇÃO DA SEÇÃO CONTATO
// ----------------------------------------------

gsap.matchMedia().add(
    "(prefers-reduced-motion: no-preference)",
    () => {

        const animacaoContato = gsap.timeline({
            scrollTrigger: {
                trigger: "#contato",
                start: "top 75%",
                once: true
            },
            defaults: {
                ease: "power3.out"
            }
        });

        animacaoContato
            .from(".contato-info > *", {
                x: -40,
                opacity: 0,
                duration: 0.9,
                stagger: 0.15,
                clearProps: "transform,opacity"
            })

            .from(".contato-painel", {
                x: 50,
                opacity: 0,
                duration: 1,
                clearProps: "transform,opacity"
            }, "-=0.7");

    }
);


// PARTE DO OBJ 3D

gsap.matchMedia().add(
    "(prefers-reduced-motion: no-preference)",
    () => {
        const orb = document.querySelector(".hero-3d");
        const home = document.querySelector("#home");

        if (!orb || !home) return;

        // Define perspectiva 3D para que a inclinação funcione perfeitamente
        gsap.set(orb, { transformPerspective: 1000 });

        // 1. EFEITO GRAVIDADE ZERO (Flutuação contínua usando 'y')
        gsap.to(orb, {
            y: -18,
            duration: 2.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        // 2. SAÍDA CINEMATOGRÁFICA NO SCROLL (Usa 'yPercent' para não conflitar com a flutuação)
        gsap.to(orb, {
            yPercent: -28,          // Sobe proporcionalmente ao tamanho dele
            xPercent: 12,           // Desvia levemente para a direita (movimento orbital)
            rotation: 14,           // Gira suavemente enquanto sobe
            scale: 0.65,            // Diminui dando sensação de distância
            filter: "blur(10px)",   // Desfoque de profundidade (Depth of Field)
            autoAlpha: 0,
            ease: "power1.in",      // Começa sutil no início do scroll e acelera na saída

            scrollTrigger: {
                trigger: "#home",
                start: "top top",
                end: "bottom 35%",
                scrub: 1.2,         // Suavização mais cremosa ao rolar a página
                invalidateOnRefresh: true
            }
        });

        // 3. INTERAÇÃO 3D COM O MOUSE (Apenas em dispositivos com mouse)
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            // quickTo é a função de alta performance do GSAP para seguir o mouse
            const rotX = gsap.quickTo(orb, "rotationX", { duration: 0.6, ease: "power3.out" });
            const rotY = gsap.quickTo(orb, "rotationY", { duration: 0.6, ease: "power3.out" });

            home.addEventListener("mousemove", (e) => {
                const { innerWidth, innerHeight } = window;
                // Calcula a posição do mouse de -0.5 a 0.5
                const xPos = (e.clientX / innerWidth) - 0.5;
                const yPos = (e.clientY / innerHeight) - 0.5;

                rotY(xPos * 25);  // Inclina para os lados (até 12.5 graus)
                rotX(-yPos * 25); // Inclina para cima/baixo
            });

            home.addEventListener("mouseleave", () => {
                rotX(0);
                rotY(0);
            });
        }
    }
);


// ----------------------------------------------
// EFEITO INTERATIVO DA FOTO
// ----------------------------------------------

const fotoContainer = document.querySelector(".sobre-foto");
const foto = fotoContainer?.querySelector("img");

const permiteEfeito = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
).matches;

if (fotoContainer && foto && permiteEfeito) {

    // Cria movimentos suavizados
    const moverX = gsap.quickTo(foto, "x", {
        duration: 0.5,
        ease: "power3.out"
    });

    const moverY = gsap.quickTo(foto, "y", {
        duration: 0.5,
        ease: "power3.out"
    });

    fotoContainer.addEventListener("mouseenter", () => {
        gsap.to(foto, {
            scale: 1.08,
            duration: 0.6,
            ease: "power3.out"
        });
    });

    fotoContainer.addEventListener("mousemove", (e) => {

        const rect = fotoContainer.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centroX = rect.width / 2;
        const centroY = rect.height / 2;

        // Movimento limitado
        moverX(((x - centroX) / centroX) * 10);
        moverY(((y - centroY) / centroY) * 10);

        // Posição da iluminação
        fotoContainer.style.setProperty("--mouse-x", `${x}px`);
        fotoContainer.style.setProperty("--mouse-y", `${y}px`);
    });

    fotoContainer.addEventListener("mouseleave", () => {
        moverX(0);
        moverY(0);

        gsap.to(foto, {
            scale: 1,
            duration: 0.6,
            ease: "power3.out"
        });
    });
}
