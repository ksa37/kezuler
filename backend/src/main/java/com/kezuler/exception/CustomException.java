package com.kezuler.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomException extends RuntimeException {

    private String code;
    private String message;

    public CustomException(String code, String message) {
        this.code = code;
        this.message = message;
    }

}