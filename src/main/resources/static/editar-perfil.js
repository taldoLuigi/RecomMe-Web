console.log("RecomMe | editar-perfil.js carregado");

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
    // CARREGAR DADOS ATUAIS
    // ==========================
    carregarDados(usuario.id);

    // ==========================
    // SALVAR ALTERAÇÕES
    // ==========================
    $("#form-editar-perfil").on("submit", function (e) {
        e.preventDefault();

        const dados = {
            nome: $("#perfil-nome").val().trim(),
            email: $("#perfil-email").val().trim(),
            senha: $("#perfil-senha").val().trim(),
            status: $("#perfil-status").val().trim(),
            fotoPerfil: $("#perfil-foto").val().trim()
        };

        RecomMe.api({
            url: `/usuarios/${usuario.id}`,
            method: "PUT",
            data: dados
        })
        .done(u => {
            RecomMe.setUsuario(u);
            RecomMe.toast("Perfil atualizado com sucesso!", "success");

            setTimeout(() => {
                window.location.href = "perfil.html";
            }, 800);
        })
        .fail(() => {
            RecomMe.toast("Erro ao atualizar perfil.", "danger");
        });
    });

    // ==========================
    // DELETAR CONTA
    // ==========================
    $("#btn-deletar").on("click", function () {

        if (!confirm("Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.")) {
            return;
        }

        RecomMe.api({
            url: `/usuarios/${usuario.id}`,
            method: "DELETE"
        })
        .done(() => {
            localStorage.clear();
            RecomMe.toast("Conta deletada com sucesso.", "danger");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        })
        .fail(() => {
            RecomMe.toast("Erro ao deletar conta.", "danger");
        });
    });

});

// ==========================
// FUNÇÕES AUXILIARES
// ==========================
function carregarDados(usuarioId) {
    RecomMe.api({
        url: `/usuarios/${usuarioId}`,
        method: "GET"
    })
    .done(u => {
        $("#perfil-nome").val(u.nome);
        $("#perfil-email").val(u.email);
        $("#perfil-status").val(u.status || "");
        $("#perfil-foto").val(u.fotoPerfil || "");

        if (u.fotoPerfil) {
            $("#nav-avatar").attr("src", u.fotoPerfil);
        }
    })
    .fail(() => {
        RecomMe.toast("Erro ao carregar dados do perfil.", "danger");
    });
}