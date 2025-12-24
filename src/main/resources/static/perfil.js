console.log("RecomMe | perfil.js carregado");

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
    // CARREGAMENTO
    // ==========================
    carregarPerfil(usuario.id);
    carregarFavoritos(usuario.id);

});

// ==========================
// BUSCAR DADOS DO USUÁRIO
// ==========================
function carregarPerfil(usuarioId) {

    RecomMe.api({
        url: `/usuarios/${usuarioId}`,
        method: "GET"
    })
    .done(u => {
        $("#perfil-nome").text(u.nome);
        $("#perfil-status").text(
            u.status ? `"${u.status}"` : "Sem status definido"
        );

        $("#perfil-info").text(
            `Membro desde ${formatarData(u.dataCadastro)}`
        );

        if (u.fotoPerfil) {
            $("#perfil-foto").css(
                "background-image",
                `url(${u.fotoPerfil})`
            );
        }
    })
    .fail(() => {
        RecomMe.toast("Erro ao carregar perfil.", "danger");
    });
}

// ==========================
// LISTAR FAVORITOS DO USUÁRIO
// ==========================
function carregarFavoritos(usuarioId) {
    RecomMe.api({
        url: `/favoritos/${usuarioId}`,
        method: "GET"
    })
    .done(lista => {
        const grid = $("#perfil-favoritos");
        grid.empty();

        if (!lista || !lista.length) {
            grid.append(`<p class="text-muted-light small">Nenhum favorito ainda.</p>`);
            return;
        }

        lista.slice(0, 6).forEach(f => {
            grid.append(`
                <a href="detalhes.html?id=${f.conteudo.id}" class="recomme-card small">
                    <div class="poster"></div>
                    <p class="card-title">${f.conteudo.titulo}</p>
                </a>
            `);
        });
    });
}


// ==========================
// FORMATAR DATA
// ==========================
function formatarData(data) {
    if (!data) return "";

    const d = new Date(data);
    return d.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric"
    });
}