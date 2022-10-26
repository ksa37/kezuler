package com.kezuler.exception;

import com.kezuler.common.ResponseSet;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class ExceptionAdvice {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseSet> customException(CustomException e) {
        Map<String, String> error = new HashMap<>();
        error.put("code", e.getCode());
        error.put("message", e.getMessage());
        ResponseSet responseSet = new ResponseSet(error);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseSet> validException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        for (FieldError f : fieldErrors) {
            errors.put("code", "-9999");
            errors.put("message", f.getField() + "값은 " + f.getDefaultMessage());
        }
        ResponseSet responseSet = new ResponseSet(errors);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.BAD_REQUEST);
    }

}
