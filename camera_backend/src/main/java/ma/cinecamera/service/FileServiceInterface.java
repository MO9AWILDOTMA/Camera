package ma.cinecamera.service;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface FileServiceInterface {
    // Save image in a local directory
    public String saveImageToStorage(String uploadDirectory, MultipartFile imageFile) throws IOException;

    // Delete an image
    public String deleteImage(String imageDirectory, String imageName) throws IOException;
}
