package com.example.recomme.controller;

import com.example.recomme.model.Usuario;
import com.example.recomme.repository.FavoritoRepository;
import com.example.recomme.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin
public class UsuarioController {

    @Autowired
    private UsuarioRepository repo;

    @Autowired
    private FavoritoRepository favoritoRepo;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario dados) {

        Optional<Usuario> opt = repo.findByEmail(dados.getEmail());

        if (opt.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        Usuario usuario = opt.get();

        if (!usuario.getSenha().equals(dados.getSenha())) {
            return ResponseEntity.status(401).build();
        }

        usuario.setSenha(null);
        return ResponseEntity.ok(usuario);
    }

    // CADASTRO
    @PostMapping("/cadastro")
    public Usuario cadastrar(@RequestBody Usuario u) {
        u.setDataCadastro(LocalDate.now());
        return repo.save(u);
    }

    // BUSCAR PERFIL
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
        return repo.findById(id)
                .map(u -> {
                    u.setSenha(null);
                    return ResponseEntity.ok(u);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ATUALIZAR PERFIL
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(
            @PathVariable Long id,
            @RequestBody Usuario dados) {

        Optional<Usuario> opt = repo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario u = opt.get();
        u.setNome(dados.getNome());
        u.setEmail(dados.getEmail());
        u.setStatus(dados.getStatus());
        u.setFotoPerfil(dados.getFotoPerfil());

        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            u.setSenha(dados.getSenha());
        }

        Usuario salvo = repo.save(u);
        salvo.setSenha(null);
        return ResponseEntity.ok(salvo);
    }

    // DELETAR CONTA
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long id) {

        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        favoritoRepo.deleteByUsuarioId(id);

        repo.deleteById(id);

        return ResponseEntity.ok().build();
    }
}
