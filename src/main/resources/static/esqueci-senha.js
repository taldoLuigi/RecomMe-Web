console.log("RecomMe | esqueci-senha.js carregado");

$("#form-reset").on("submit", function (e) {
    e.preventDefault();

    const email = $("#reset-email").val().trim();

    if (!email) {
        return RecomMe.toast("Digite seu e-mail!", "warning");
    }

    RecomMe.api({
        url: "/usuarios/reset-senha",
        method: "POST",
        data: { email }
    })
    .done(() => {
        RecomMe.toast(
            "Enviamos um link de redefinição para esse e-mail.",
            "success"
        );
    })
    .fail(() => {
        RecomMe.toast(
            "Erro ao solicitar redefinição de senha.",
            "danger"
        );
    });
});