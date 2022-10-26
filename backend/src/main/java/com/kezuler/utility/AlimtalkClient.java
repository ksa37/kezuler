package com.kezuler.utility;

import com.kezuler.common.AppProperties;
import com.kezuler.domain.Alimtalk;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

@Slf4j
public class AlimtalkClient {

    public static void sendAlimtalk(AppProperties app, JSONObject content)  {

        try {
            String hosturl = app.getNcpSensHost();
            String requestUrl = app.getNcpSensPreurl() + app.getNcpSensService() + "/messages";
            String method = "POST";					// method
            String timestamp = String.valueOf(System.currentTimeMillis());			// current timestamp (epoch)
            String accessKey = app.getNcpSensAccessKey();			// access key id (from portal or Sub Account)
            String secretKey = app.getNcpSensSecretKey();
            System.out.println(hosturl + " " + requestUrl + " " + method + " " + timestamp + " " + accessKey + " " + secretKey );

            URL url = new URL(hosturl + requestUrl);

            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setUseCaches(false);
            con.setDoOutput(true);
            con.setDoInput(true);
            con.setRequestProperty("content-type", "application/json");
            con.setRequestProperty("x-ncp-apigw-timestamp", timestamp);
            con.setRequestProperty("x-ncp-iam-access-key", accessKey);
            con.setRequestProperty("x-ncp-apigw-signature-v2", makeSignature(requestUrl, timestamp, method, accessKey, secretKey));
            con.setRequestMethod(method);
            con.setDoOutput(true);

            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.write(content.toString().getBytes());
            wr.flush();
            wr.close();

            int responseCode = con.getResponseCode();
            BufferedReader br;
            System.out.println("responseCode" +" " + responseCode);
            if(responseCode==202) { // 정상 호출
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {  // 에러 발생
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();

            System.out.println(response.toString());

        } catch (Exception e) {

        }
    }

    public static JSONArray getTemplate(AppProperties app, String templateCode)  {

        try {
            String hosturl = app.getNcpSensHost();
            String requestUrl = app.getNcpSensPreurl() + app.getNcpSensService() + "/templates?channelId=" + app.getNcpSensChannelid() + "&templateCode=" + templateCode;
            String method = "GET";					// method
            String timestamp = String.valueOf(System.currentTimeMillis());			// current timestamp (epoch)
            String accessKey = app.getNcpSensAccessKey();			// access key id (from portal or Sub Account)
            String secretKey = app.getNcpSensSecretKey();

            URL url = new URL(hosturl + requestUrl);

            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setUseCaches(false);
            con.setDoOutput(true);
            con.setDoInput(true);
            con.setRequestProperty("content-type", "application/json");
            con.setRequestProperty("x-ncp-apigw-timestamp", timestamp);
            con.setRequestProperty("x-ncp-iam-access-key", accessKey);
            con.setRequestProperty("x-ncp-apigw-signature-v2", makeSignature(requestUrl, timestamp, method, accessKey, secretKey));
            con.setRequestMethod(method);
            con.setDoOutput(true);



            int responseCode = con.getResponseCode();
            BufferedReader br;
            System.out.println("responseCode" +" " + responseCode);
            if(responseCode==200) { // 정상 호출
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {  // 에러 발생
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();
            System.out.println(response.toString());

            JSONArray resultArr = new JSONArray(response.toString());
            return resultArr;


        } catch (Exception e) {
            return null;
        }
    }


    public static String makeSignature(String url, String timestamp, String method, String accessKey, String secretKey) {

        try {
            String space = " ";					// one space
            String newLine = "\n";					// new line

            String message = new StringBuilder()
                    .append(method)
                    .append(space)
                    .append(url)
                    .append(newLine)
                    .append(timestamp)
                    .append(newLine)
                    .append(accessKey)
                    .toString();

            SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);

            byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
            String encodeBase64String = Base64.encodeBase64String(rawHmac);

            return encodeBase64String;
        } catch (Exception e) {
            log.info("Error ::: makeSignature : {}", e.getMessage());
        }
        return null;
    }

    public static JSONObject makeBody(Alimtalk alimtalk) {



        JSONObject bodyJson = new JSONObject();
        bodyJson.put("plusFriendId", "@케쥴러");
        bodyJson.put("templateCode", alimtalk.getType());

        JSONArray  msgArr = new JSONArray();
        JSONObject msgJson = new JSONObject();
        msgJson.put("to", alimtalk.getPhone());
        msgJson.put("content", alimtalk.getContent());

        msgArr.put(msgJson);

        JSONArray  btnArr = new JSONArray();

        JSONArray buttons = new JSONArray(alimtalk.getButtons());
        for (int i = 0; i < buttons.length(); i++) {
            JSONObject jsonObject = buttons.getJSONObject(i);
            JSONObject btnJson = new JSONObject();
            btnJson.put("type", jsonObject.getString("type"));
            btnJson.put("name", jsonObject.getString("name"));
            btnJson.put("linkMobile", jsonObject.getString("linkMobile"));
            btnJson.put("linkPc", jsonObject.getString("linkPc"));
            btnArr.put(btnJson);
        }


        msgJson.put("buttons", btnArr);

        bodyJson.put("messages", msgArr);

        return bodyJson;

    }

    public static String replaceVariable(String origin, Map<String, String> replace) {

        for (String key : replace.keySet()) {
            String format = String.format("#\\{%s\\}", key);
            origin = origin.replaceAll(format, replace.get(key));
        }
        return origin;
    }

    public static String replacePhonenumber(String phone) {
        String[] split = phone.split(" ");
        String notNatinal = "0" + split[1];
        String notHyphen = notNatinal.replaceAll("-", "");
        return notHyphen;
    }
}
