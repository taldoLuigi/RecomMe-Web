console.log("RecomMe | cadastro.js carregado");

$("#form-cadastro").on("submit", function (e) {
    e.preventDefault();

    const nome = $("#cad-nome").val().trim();
    const email = $("#cad-email").val().trim();
    const senha = $("#cad-senha").val().trim();

    if (!nome || !email || !senha) {
        return RecomMe.toast("Preencha todos os campos!", "warning");
    }

    if (senha.length < 8) {
        return RecomMe.toast("A senha deve ter no mínimo 8 caracteres.", "warning");
    }

    RecomMe.api({
        url: "/usuarios/cadastro",
        method: "POST",
        data: { nome, email, senha }
    })
    .done(usuario => {

        if (!usuario || !usuario.id) {
            return RecomMe.toast("Erro ao criar conta.", "danger");
        }

        RecomMe.toast("Conta criada com sucesso!", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 700);
    })
    .fail(() => {
        RecomMe.toast("Erro ao criar conta. Verifique os dados.", "danger");
    });
});