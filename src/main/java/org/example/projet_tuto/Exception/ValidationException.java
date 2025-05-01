package org.example.projet_tuto.Exception;

public class ValidationException extends RuntimeException{
    public ValidationException(String message){
        super(message);
    }
}