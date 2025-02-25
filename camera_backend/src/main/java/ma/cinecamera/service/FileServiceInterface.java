package ma.cinecamera.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.model.enums.MediaType;

@Service
public interface FileServiceInterface {
    // Save image in a local directory
    public String saveImageToStorage(String uploadDirectory, MultipartFile imageFile) throws IOException;

    void saveFiles(MultipartFile[] files, Long ownerId, MediaType type, String uploadDirectory) throws IOException;

    public List<String> getImagePaths(Long ownerId, String uploadDirectory, MediaType type);

    GlobalResp deleteImage(String imageDirectory, String imageName) throws IOException;

    GlobalResp deleteAllImages(Long ownerId, MediaType type);
}
