package ma.cinecamera.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.model.Media;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.MediaRepository;
import ma.cinecamera.service.FileServiceInterface;

@Service
public class FileService implements FileServiceInterface {

    @Autowired
    private MediaRepository mediaRepository;

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

	try (InputStream inputStream = imageFile.getInputStream()) {
	    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
	}

	return uniqueFileName;
    }

    @Override
    @Transactional
    public void saveFiles(MultipartFile[] files, Long ownerId, MediaType type, String uploadDirectory)
	    throws IOException {
	Path uploadPath = Path.of(uploadDirectory);
	if (!Files.exists(uploadPath)) {
	    Files.createDirectories(uploadPath);
	}

	for (MultipartFile file : files) {
	    if (file == null || file.isEmpty()) {
		continue; // Skip empty files
	    }

	    String uniqueFileName = saveImageToStorage(uploadDirectory, file);

	    Media media = Media.builder().name(uniqueFileName).directory(uploadDirectory).mediaType(type)
		    .ownerId(ownerId).build();
	    mediaRepository.save(media);
	}
    }

    @Override
    public List<String> getImagePaths(Long ownerId, String uploadDirectory, MediaType type) {
	return mediaRepository.findByMediaTypeAndOwnerId(type, ownerId).stream()
		.map(media -> "/images/" + type.toString().toLowerCase() + 's' + "/" + media.getName())
		.collect(Collectors.toList());
    }

    @Override
    public GlobalResp deleteImage(String imageDirectory, String imageName) throws IOException {
	Path imagePath = Path.of(imageDirectory, imageName);

	if (Files.exists(imagePath)) {
	    Files.delete(imagePath);
	    return GlobalResp.builder().message("File deleted successfully").build();
	} else {
	    return GlobalResp.builder().message("File deleting failed").build();
	}
    }

    @Override
    public GlobalResp deleteAllImages(Long ownerId, MediaType type) {
	List<Media> medias = mediaRepository.findByMediaTypeAndOwnerId(type, ownerId);
	medias.stream().map(m -> {
	    try {
		deleteImage(m.getDirectory(), m.getName());
	    } catch (IOException e) {
		return GlobalResp.builder().message("File deleting failed").build();
	    }
	    return m;
	});
	mediaRepository.deleteAllInBatch(medias);
	return GlobalResp.builder().message("Files deleted successfully").build();
    }
}