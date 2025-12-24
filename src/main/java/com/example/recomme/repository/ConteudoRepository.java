
package com.example.recomme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.recomme.model.Conteudo;

public interface ConteudoRepository extends JpaRepository<Conteudo, Long> {
    
}
