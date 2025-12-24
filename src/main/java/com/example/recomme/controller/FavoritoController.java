package com.example.recomme.controller;

import com.example.recomme.model.Favorito;
import com.example.recomme.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin
public class FavoritoController {

    @Autowired
    private FavoritoRepository favoritoRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private ConteudoRepository conteudoRepo;

    // LISTAR FAVORITOS DO USUÁRIO
    @GetMapping("/{usuarioId}")
    public List<Favorito> listar(@PathVariable Long usuarioId) {
        return favoritoRepo.findByUsuarioId(usuarioId);
    }

    // FAVORITAR CONTEÚDO
    @PostMapping("/{usuarioId}/{conteudoId}")
    public ResponseEntity<Void> favoritar(
            @PathVariable Long usuarioId,
            @PathVariable Long conteudoId) {

        if (favoritoRepo.existsByUsuarioIdAndConteudoId(usuarioId, conteudoId)) {
            return ResponseEntity.ok().build();
        }

        var usuario = usuarioRepo.findById(usuarioId).orElse(null);
        var conteudo = conteudoRepo.findById(conteudoId).orElse(null);

        if (usuario == null || conteudo == null) {
            return ResponseEntity.notFound().build();
        }

        Favorito f = new Favorito();
        f.setUsuario(usuario);
        f.setConteudo(conteudo);

        favoritoRepo.save(f);
        return ResponseEntity.ok().build();
    }

    // DESFAVORITAR CONTEÚDO
    @DeleteMapping("/{usuarioId}/{conteudoId}")
    public ResponseEntity<Void> desfavoritar(
            @PathVariable Long usuarioId,
            @PathVariable Long conteudoId) {

        favoritoRepo.deleteByUsuarioIdAndConteudoId(usuarioId, conteudoId);
        return ResponseEntity.ok().build();
    }
}
