console.log("RecomMe | global.js carregado");

/* =====================================================
   CONFIGURAÇÕES GERAIS
===================================================== */
const API_BASE = "http://localhost:8080/api";

/* =====================================================
   OBJETO GLOBAL
===================================================== */
const RecomMe = {

    /* =========================
       SESSÃO
    ========================= */
    getUsuario() {
        const u = localStorage.getItem("usuario");
        return u ? JSON.parse(u) : null;
    },

    setUsuario(usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
    },

    logout() {
        localStorage.removeItem("usuario");
        window.location.href = "index.html";
    },

    /* =========================
       CONTROLE DE ROTAS
    ========================= */
    controlarSessao() {
        const usuario = this.getUsuario();
        const paginaAtual = window.location.pathname.split("/").pop();

        const paginasProtegidas = [
            "home.html",
            "perfil.html",
            "editar-perfil.html",
            "favoritos.html",
            "detalhes.html"
        ];

        // Não logado tentando acessar página protegida
        if (!usuario && paginasProtegidas.includes(paginaAtual)) {
            window.location.href = "index.html";
        }

        // Logado tentando acessar login/cadastro
        if (usuario && ["index.html", "login.html", "cadastro.html"].includes(paginaAtual)) {
            window.location.href = "home.html";
        }
    },

    /* =========================
       NAVBAR
    ========================= */
    marcarNavAtiva() {
        const atual = window.location.pathname.split("/").pop();

        $(".nav-link-recomme").each(function () {
            if ($(this).attr("href") === atual) {
                $(this).addClass("nav-link-active");
            }
        });
    },

    /* =========================
       AVATAR / DADOS DO USUÁRIO
    ========================= */
    carregarUsuarioNaNavbar() {
        const usuario = this.getUsuario();
        if (!usuario) return;

        if (usuario.fotoPerfil && $("#nav-avatar").length) {
            $("#nav-avatar").attr("src", usuario.fotoPerfil);
        }
    },

    /* =========================
       TOAST
    ========================= */
    toast(msg, type = "primary") {
        let container = $(".toast-container");

        if (!container.length) {
            container = $('<div class="toast-container position-fixed bottom-0 end-0 p-3"></div>');
            $("body").append(container);
        }

        const toast = $(`
            <div class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${msg}</div>
                    <button type="button"
                            class="btn-close btn-close-white me-2 m-auto"
                            data-bs-dismiss="toast"></button>
                </div>
            </div>
        `);

        container.append(toast);
        new bootstrap.Toast(toast[0], { delay: 3000 }).show();
    },

    /* =========================
       AJAX GLOBAL
    ========================= */
    api({ url, method = "GET", data = null }) {
        return $.ajax({
            url: API_BASE + url,
            method,
            contentType: "application/json",
            data: data ? JSON.stringify(data) : null
        });
    }
};

/* =====================================================
   INICIALIZAÇÃO GLOBAL
===================================================== */
$(function () {
    RecomMe.controlarSessao();
    RecomMe.marcarNavAtiva();
    RecomMe.carregarUsuarioNaNavbar();
});

/* =====================================================
   MOSTRAR / OCULTAR SENHA
===================================================== */
$(document).on("click", ".toggle-password-btn", function () {
    const target = $(this).data("target");
    const input = $("#" + target);
    const icon = $(this).find("i");

    if (input.attr("type") === "password") {
        input.attr("type", "text");
        icon.removeClass("bi-eye-fill").addClass("bi-eye-slash-fill");
    } else {
        input.attr("type", "password");
        icon.removeClass("bi-eye-slash-fill").addClass("bi-eye-fill");
    }
});

/* =====================================================
   LOGOUT GLOBAL
===================================================== */
$(document).on("click", "#btn-logout", function (e) {
    e.preventDefault();
    RecomMe.logout();
});