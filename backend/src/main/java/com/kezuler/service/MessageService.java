package com.kezuler.service;

import com.kezuler.common.AppProperties;
import com.kezuler.domain.Account;
import com.kezuler.domain.Alimtalk;
import com.kezuler.repository.AlimtalkRepository;
import com.kezuler.utility.AlimtalkClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final AppProperties app;
    private final AlimtalkRepository alimtalkRepository;

    @Transactional
    public void sendAlimtalk(Account account, String type, Map<String, String> replace) {
        if (account.getPhoneNumber() == null) {
            return ;
        }

        JSONArray resultArr = AlimtalkClient.getTemplate(app, type);
        JSONObject jsonObject = resultArr.getJSONObject(0);
        String content = jsonObject.getString("content");
        JSONArray btnArr = jsonObject.getJSONArray("buttons");

        Alimtalk alimtalk = Alimtalk.builder()
                .event(type.equals("signup") ? null : replace.get("eventId"))
                .type(type)
                .template(content)
                .content(AlimtalkClient.replaceVariable(content, replace))
                .phone(AlimtalkClient.replacePhonenumber(account.getPhoneNumber()))
                .buttons(AlimtalkClient.replaceVariable(btnArr.toString(), replace))
                .account(account)
                .build();


        Alimtalk save = alimtalkRepository.save(alimtalk);

        JSONObject bodyJson = AlimtalkClient.makeBody(save);

        AlimtalkClient.sendAlimtalk(app, bodyJson);
    }


}
