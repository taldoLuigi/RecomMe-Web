
package com.example.recomme.controller;


import com.example.recomme.model.Conteudo;
import com.example.recomme.repository.ConteudoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/conteudos")
@CrossOrigin
public class ConteudoController {

    @Autowired
    private ConteudoRepository repo;

    @GetMapping
    public List<Conteudo> listar() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conteudo> detalhes(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Conteudo> criar(@RequestBody Conteudo conteudo) {
        Conteudo salvo = repo.save(conteudo);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }
}
