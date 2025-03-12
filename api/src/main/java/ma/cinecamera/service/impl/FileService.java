package ma.cinecamera.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.model.Media;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.MediaRepository;
import ma.cinecamera.service.IFileService;

@Service
public class FileService implements IFileService {

    @Autowired
    private MediaRepository mediaRepository;

    private final Logger logger = Logger.getLogger(FileService.class.getName());;

    @Override
    public String saveFileToStorage(String uploadDirectory, MultipartFile imageFile) throws IOException {
	if (imageFile == null || imageFile.isEmpty()) {
	    throw new IllegalArgumentException("File cannot be null or empty");
	}

	String uniqueFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + "_"
		+ imageFile.getOriginalFilename();
	Path uploadPath = Paths.get(uploadDirectory);
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
	Path uploadPath = Paths.get(uploadDirectory);
	if (!Files.exists(uploadPath)) {
	    Files.createDirectories(uploadPath);
	}

	for (MultipartFile file : files) {
	    if (file == null || file.isEmpty()) {
		continue; // Skip empty files
	    }

	    String uniqueFileName = saveFileToStorage(uploadDirectory, file);

	    Media media = Media.builder().name(uniqueFileName).directory(uploadDirectory).mediaType(type)
		    .ownerId(ownerId).build();
	    mediaRepository.save(media);
	}
    }

    @Override
    public List<String> getFilePaths(Long ownerId, String uploadDirectory, MediaType type) {
	String typeName;
	if (type.equals(MediaType.SCREENING_ROOM)) {
	    typeName = "screeningRooms";
	} else {
	    typeName = type.toString().toLowerCase() + 's';
	}
	return mediaRepository.findByMediaTypeAndOwnerId(type, ownerId).stream()
		.map(media -> "/images/" + typeName + "/" + ownerId + "/" + media.getName())
		.collect(Collectors.toList());
    }

    @Override
    public GlobalResp deleteFileFromServer(String imageDirectory, String imageName) {
	Path imagePath = Paths.get(imageDirectory, imageName);

	if (Files.exists(imagePath)) {
	    try {
		Files.delete(imagePath);
		return GlobalResp.builder().message("File deleted successfully").build();
	    } catch (IOException e) {
		return GlobalResp.builder().message("File deleted failed: " + e.getMessage()).build();
	    }
	} else {
	    return GlobalResp.builder().message("File deleting failed, file doesnt exissts").build();
	}
    }

    @Override
    public GlobalResp deleteAllFiles(Long ownerId, MediaType type) {
	List<Media> medias = mediaRepository.findByMediaTypeAndOwnerId(type, ownerId);
	logger.warning("this ownerId:" + ownerId);
	medias.forEach(m -> {
	    logger.warning("this dir:" + m.getDirectory());
	    deleteFileFromServer(m.getDirectory(), m.getName());
	});
	mediaRepository.deleteAllInBatch(medias);
	return GlobalResp.builder().message("Files deleted successfully").id(ownerId).build();
    }

    @Override
    public GlobalResp updateFiles(MultipartFile[] files, Long ownerId, MediaType type, String uploadDirectory)
	    throws IOException {
	if (files == null || files.length == 0) {
	    logger.warning("Files are the same, files are not changed");
	    return GlobalResp.builder().message("Files are the same, files are not changed").build();
	}

	GlobalResp deletingResp = deleteAllFiles(ownerId, type);

	if (deletingResp.getMessage().equalsIgnoreCase("File deleting failed")) {
	    logger.warning("File updating failed, files are not changed");
	    return GlobalResp.builder().message("File updating failed, files are not changed").build();
	}

	saveFiles(files, ownerId, type, uploadDirectory);
	logger.warning("Files updated successfully");
	return GlobalResp.builder().message("Files updated successfully").build();

    }
}