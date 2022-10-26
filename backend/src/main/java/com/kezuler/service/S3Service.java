package com.kezuler.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

@Slf4j
@Service
@NoArgsConstructor
public class S3Service {
    private AmazonS3 s3Client;

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    @PostConstruct
    public void setS3Client() {
        log.info(" Enter -> [ S3Service setS3Client ] ");

        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);

        s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(this.region)
                .build();
    }

    public String uploadProfile(String url) {
        log.info(" Enter -> [ S3Service uploadProfileByUrl ] ");

        try {
            String storeFileName = createStoreFileName(url);
            InputStream in = new BufferedInputStream(new URL(url).openStream());
            return upload(in, storeFileName);
        } catch (Exception e) {
            log.info(e.getMessage());
            return null;
        }

    }


    public String upload(InputStream file, String storageName) {
        log.info(" Enter -> [ S3Service upload ] ");

        String extractStorage = extractStorage(storageName);
        boolean isExistObject = s3Client.doesObjectExist(bucket, extractStorage);
        if (isExistObject) {
            storageName = createStoreFileName(storageName);
        }

        s3Client.putObject(new PutObjectRequest(bucket, storageName, file, null)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        return s3Client.getUrl(bucket, storageName).toString();
    }


    public String update(MultipartFile file, String oldName) throws IOException {
        log.info(" Enter -> [ S3Service update ] ");

        if (oldName != null) {
            String extractStorage = extractStorage(oldName);
            boolean isExistObject = s3Client.doesObjectExist(bucket, extractStorage);

            if (isExistObject) {
                s3Client.deleteObject(bucket, extractStorage);
            }
            oldName = createStoreFileName(oldName);
        } else {
            oldName = createStoreFileName(file.getOriginalFilename());
        }
        String upload = upload(file.getInputStream(), oldName);
        log.info(" :::::::::::::: upload name : {}", upload );
        return upload;
    }

    public void delete(String fileName) {
        log.info(" Enter -> [ S3Service delete ] ");
        if (fileName != null) {
            String extractStorage = extractStorage(fileName);

            boolean isExistObject = s3Client.doesObjectExist(bucket, extractStorage);

            if (isExistObject) {
                s3Client.deleteObject(bucket, extractStorage);
            }
        }

    }


    private String createStoreFileName(String originFilename) {
        String ext = extractExt(originFilename);
        String uuid = RandomStringUtils.randomAlphanumeric(10);
        return uuid + "." + ext;
    }

    private String extractExt(String originFilename) {
        int pos = originFilename.lastIndexOf(".");
        return originFilename.substring(pos + 1);
    }

    private String extractStorage(String originFilename) {
        int pos = originFilename.lastIndexOf("/");
        return originFilename.substring(pos + 1);
    }


}