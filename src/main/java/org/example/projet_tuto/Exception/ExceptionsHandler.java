package org.example.projet_tuto.Exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class ExceptionsHandler {

    private static final Logger log = LoggerFactory.getLogger(ExceptionsHandler.class);

    @ExceptionHandler({QcmNotFoundException.class, StreamingNotFoundException.class, AnnonceExceptionHandler.class})
    public ResponseEntity<Map<String, String>> handlerNotFound(RuntimeException ex) {
        log.warn("Not found exception: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", ex.getMessage() != null ? ex.getMessage() : "An error occurred"));
    }
}
