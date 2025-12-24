console.log("RecomMe | login.js carregado");

$("#form-login").on("submit", function (e) {
    e.preventDefault();

    const email = $("#login-email").val().trim();
    const senha = $("#login-password").val().trim();

    if (!email || !senha) {
        return RecomMe.toast("Preencha todos os campos!", "warning");
    }

    RecomMe.api({
        url: "/usuarios/login",
        method: "POST",
        data: { email, senha }
    })
    .done(usuario => {

        // Login inválido
        if (!usuario || !usuario.id) {
            return RecomMe.toast("E-mail ou senha inválidos.", "danger");
        }

        // Login OK
        RecomMe.setUsuario(usuario);
        RecomMe.toast("Login realizado com sucesso!", "success");

        setTimeout(() => {
            window.location.href = "home.html";
        }, 600);
    })
    .fail(() => {
        RecomMe.toast("Erro ao conectar com o servidor.", "danger");
    });
});