package ma.cinecamera.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.service.FileServiceInterface;

@Service
public class FileService implements FileServiceInterface {

    @Override
    public String saveImageToStorage(String uploadDirectory, MultipartFile imageFile) throws IOException {
	if (imageFile == null || imageFile.isEmpty()) {
	    throw new IllegalArgumentException("File cannot be null or empty");
	}

	String uniqueFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + "_"
		+ imageFile.getOriginalFilename();
	Path uploadPath = Path.of(uploadDirectory);
	Path filePath = uploadPath.resolve(uniqueFileName);

	if (!Files.exists(uploadPath)) {
	    Files.createDirectories(uploadPath);
	}

	Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

	return uniqueFileName;
    }

    // Delete an image
    @Override
    public String deleteImage(String imageDirectory, String imageName) throws IOException {
	Path imagePath = Path.of(imageDirectory, imageName);

	if (Files.exists(imagePath)) {
	    Files.delete(imagePath);
	    return "Success";
	} else {
	    return "Failed"; // Handle missing images
	}
    }
}