console.log("RecomMe | favoritos.js carregado");

$(function () {

    // ==========================
    // PROTEÇÃO DE ROTA
    // ==========================
    const usuario = RecomMe.getUsuario();

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    // ==========================
    // LOGOUT
    // ==========================
    $("#btn-logout").on("click", function (e) {
        e.preventDefault();
        RecomMe.logout();
    });

    // ==========================
    // CARREGAR FAVORITOS
    // ==========================
    carregarFavoritos(usuario.id);

});

// ==========================
// BUSCAR FAVORITOS DO USUÁRIO
// ==========================
function carregarFavoritos(usuarioId) {

    RecomMe.api({
        url: `/favoritos/${usuarioId}`,
        method: "GET"
    })
    .done(lista => {
        const grid = $("#favoritos-grid");
        grid.empty();

        if (!lista || !lista.length) {
            grid.append(`
                <p class="text-muted-light">
                    Você ainda não adicionou nenhum favorito.
                </p>
            `);
            return;
        }

        lista.forEach(f => {
            const c = f.conteudo;
            
            grid.append(`
                <a href="detalhes.html?id=${c.id}" class="fav-card">
                    <div class="fav-icon">
                        <i class="bi bi-star-fill"></i>
                    </div>
                    <h6 class="fw-semibold mt-2">${c.titulo}</h6>
                    <p class="text-muted-light small mb-0">
                        ${c.tipo} · ${c.genero} · ${c.ano}
                    </p>
                </a>
            `);
        });
    })
    .fail(() => {
        RecomMe.toast("Erro ao carregar favoritos.", "danger");
    });
}