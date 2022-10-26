package com.kezuler.common;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.tomcat.util.json.JSONParser;
import org.apache.tomcat.util.json.ParseException;

import java.io.IOException;

@Getter
@Setter
@NoArgsConstructor
public class ResponseSet {

    private Object result;

    public ResponseSet(Object returnData) {
        this.result = jsonToObject(returnData);
    }

    private Object jsonToObject(Object object) {
        try {
            ObjectMapper objectmapper = new ObjectMapper();
            objectmapper.configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
            objectmapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
            String jsonString = objectmapper.writeValueAsString(object);
            JSONParser parser = new JSONParser(jsonString);
            Object obj = parser.parse();
            return obj;
        }
        catch (IOException | ParseException e) {
            System.out.print(e.getCause());
        }
        return null;
    }
}