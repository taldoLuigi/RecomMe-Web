console.log("RecomMe | home.js carregado");

$(function () {

    let conteudos = [];
    let filtroAtivo = null;

    // ==========================
    // LOGOUT
    // ==========================
    $("#btn-logout").on("click", function (e) {
        e.preventDefault();
        RecomMe.logout();
    });

    // ==========================
    // FILTROS
    // ==========================
    $("[data-filter]").on("click", function () {

        const filtro = $(this).data("filter");

        if (filtroAtivo === filtro) {
            filtroAtivo = null;
            $("[data-filter]").removeClass("active");
        } else {
            filtroAtivo = filtro;
            $("[data-filter]").removeClass("active");
            $(this).addClass("active");
        }

        renderizarRecomendados();
    });

    // ==========================
    // BUSCA
    // ==========================
    $("#search").on("input", function () {
        renderizarRecomendados();
    });

    // ==========================
    // CARREGAR CONTEÚDOS
    // ==========================
    carregarRecomendados();

    function carregarRecomendados() {
        RecomMe.api({
            url: "/conteudos",
            method: "GET"
        })
                .done(lista => {
                    conteudos = lista || [];
                    renderizarRecomendados();
                })
                .fail(() => {
                    RecomMe.toast("Erro ao carregar conteúdos.", "danger");
                });
    }

    // ==========================
    // RENDERIZAÇÃO COM FILTROS
    // ==========================
    function renderizarRecomendados() {

        const grid = $("#recommended-grid");
        grid.empty();

        let filtrados = [...conteudos];

        // FILTRO POR TIPO
        if (filtroAtivo) {
            filtrados = filtrados.filter(c => {

                if (!c.tipo)
                    return false;

                const tipo = c.tipo.toLowerCase();

                if (filtroAtivo === "filmes" && tipo === "filme")
                    return true;
                if (filtroAtivo === "series" && tipo === "serie")
                    return true;
                if (filtroAtivo === "livros" && tipo === "livro")
                    return true;

                return false;
            });
        }

        // FILTRO POR BUSCA
        const busca = $("#search").val().trim().toLowerCase();
        if (busca.length > 0) {
            filtrados = filtrados.filter(c =>
                c.titulo.toLowerCase().includes(busca)
            );
        }

        if (filtrados.length === 0) {
            grid.append(`<p class="text-muted-light">Nenhum conteúdo encontrado.</p>`);
            return;
        }

        filtrados.forEach(c => {
            grid.append(`
                <div class="recomme-card">
                    <a href="detalhes.html?id=${c.id}">
                        <div class="poster" style="background-image:url('${c.capa || ""}')"></div>
                        <p class="card-title">${c.titulo}</p>
                        <span class="rating">★★★★★</span>
                    </a>
                </div>
            `);
        });
    }

});