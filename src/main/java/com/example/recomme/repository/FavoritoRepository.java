
package com.example.recomme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.recomme.model.Favorito;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioId(Long usuarioId);
    
    @Modifying
    @Transactional
    void deleteByUsuarioIdAndConteudoId(Long usuarioId, Long conteudoId);
    
    @Modifying
    @Transactional
    void deleteByUsuarioId(Long usuarioId);
    
    boolean existsByUsuarioIdAndConteudoId(Long usuarioId, Long conteudoId);
}
