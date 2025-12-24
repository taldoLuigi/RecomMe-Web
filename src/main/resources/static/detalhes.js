console.log("RecomMe | detalhes.js carregado");

$(function () {

    const usuario = RecomMe.getUsuario();

    // ==========================
    // LOGOUT
    // ==========================
    $("#btn-logout").on("click", function (e) {
        e.preventDefault();
        RecomMe.logout();
    });

    // ==========================
    // PEGAR ID DA URL
    // ==========================
    const params = new URLSearchParams(window.location.search);
    const conteudoId = params.get("id");

    if (!conteudoId) {
        RecomMe.toast("Conteúdo inválido.", "warning");
        window.location.href = "home.html";
        return;
    }

    let isFavorito = false;

    carregarDetalhes(conteudoId);

    if (usuario) {
        verificarFavorito(usuario.id, conteudoId);
    }

    // ==========================
    // FAVORITAR / DESFAVORITAR
    // ==========================
    $("#btn-favoritar").on("click", function () {

        if (!usuario) {
            RecomMe.toast("Faça login para favoritar.", "warning");
            return;
        }

        if (isFavorito) {
            desfavoritar(usuario.id, conteudoId);
        } else {
            favoritar(usuario.id, conteudoId);
        }
    });

    // ==========================
    // FUNÇÕES
    // ==========================
    function favoritar(usuarioId, conteudoId) {
        RecomMe.api({
            url: `/favoritos/${usuarioId}/${conteudoId}`,
            method: "POST"
        })
        .done(() => {
            isFavorito = true;
            atualizarBotao();
            RecomMe.toast("Adicionado aos favoritos!", "success");
        })
        .fail(() => {
            RecomMe.toast("Erro ao favoritar.", "danger");
        });
    }

    function desfavoritar(usuarioId, conteudoId) {
        RecomMe.api({
            url: `/favoritos/${usuarioId}/${conteudoId}`,
            method: "DELETE"
        })
        .done(() => {
            isFavorito = false;
            atualizarBotao();
            RecomMe.toast("Removido dos favoritos.", "info");
        })
        .fail(() => {
            RecomMe.toast("Erro ao remover favorito.", "danger");
        });
    }

    function verificarFavorito(usuarioId, conteudoId) {
        RecomMe.api({
            url: `/favoritos/${usuarioId}`,
            method: "GET"
        })
        .done(lista => {
            isFavorito = lista.some(f => f.conteudo.id === Number(conteudoId));
            atualizarBotao();
        });
    }

    function atualizarBotao() {
        const btn = $("#btn-favoritar");

        if (isFavorito) {
            btn
                .removeClass("btn-outline")
                .addClass("btn-warning")
                .html('<i class="bi bi-star-fill"></i> Desfavoritar');
        } else {
            btn
                .removeClass("btn-warning")
                .addClass("btn-outline")
                .html('<i class="bi bi-star"></i> Favoritar');
        }
    }

});

// ==========================
// BUSCAR CONTEÚDO POR ID
// ==========================
function carregarDetalhes(id) {
    RecomMe.api({
        url: `/conteudos/${id}`,
        method: "GET"
    })
    .done(c => {
        $("#detalhe-titulo").text(c.titulo);
        $("#detalhe-info").text(
            `${c.tipo} · ${c.genero} · ${c.ano} · ${c.duracao}`
        );
        $("#detalhe-sinopse").text(c.sinopse || "Sinopse não disponível.");
    })
    .fail(() => {
        RecomMe.toast("Conteúdo não encontrado.", "danger");
        window.location.href = "home.html";
    });
}