// ----------------------------------------------
// ANIMAÇÕES GLOBAIS DE ENTRADA (FADE IN UP)
// ----------------------------------------------

gsap.registerPlugin(ScrollTrigger);

// Verifica se o usuário prefere sem animações para acessibilidade
gsap.matchMedia().add(
    "(prefers-reduced-motion: no-preference)",
    () => {

        // 1. Animação da Seção Home (Textos)
        const animacaoHomeTextos = gsap.timeline({
            defaults: { ease: "power3.out" }
        });

        // O h1, subtitulo e descricao da home já estão visíveis no início,
        // então podemos animá-los de cara quando a página carrega.
        animacaoHomeTextos
            .from(".hero-conteudo .subtitulo", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.2
            })
            .from(".hero-conteudo h1", {
                y: 40,
                opacity: 0,
                duration: 1
            }, "-=0.6")
            .from(".hero-conteudo .descricao", {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, "-=0.6");


        // 2. Animação da Seção "Sobre"
        const animacaoSobre = gsap.timeline({
            scrollTrigger: {
                trigger: "#sobre",
                start: "top 80%", // Dispara quando o topo da seção atinge 80% da altura da tela
                once: true // Anima apenas uma vez
            },
            defaults: { ease: "power3.out" }
        });

        animacaoSobre
            .from(".sobre-texto .subtitulo", { y: 30, opacity: 0, duration: 0.8 })
            .from(".sobre-texto h2", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
            .from(".sobre-texto .texto-destaque", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
            .from(".sobre-texto > p:not(.subtitulo)", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
            .from(".sobre-card", { x: 50, opacity: 0, duration: 1 }, "-=0.8");

        // Animação interna do card de informações na seção Sobre
        gsap.from(".sobre-info", {
            scrollTrigger: {
                trigger: ".sobre-card",
                start: "top 85%",
                once: true
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15, // Anima um por um
            ease: "power3.out"
        });


        // 3. Animação do cabeçalho da Seção "Tecnologias"
        // Esta animação já está implementada no script.js, então vamos focar nas outras seções

        // 4. Animação do cabeçalho da Seção "Projetos"
        // (O card do projeto destaque já está animado no script.js)
        gsap.from(".projetos-header > *", {
            scrollTrigger: {
                trigger: "#projetos",
                start: "top 85%",
                once: true
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });

        // 5. A Seção "Contato" já possui animações específicas no script.js,
        // então não precisamos duplicar a lógica aqui para evitar conflitos.
    }
);
