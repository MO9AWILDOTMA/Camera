package ma.cinecamera.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
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
import ma.cinecamera.model.enums.MediaCategory;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.MediaRepository;
import ma.cinecamera.service.IFileService;

@Service
public class FileService implements IFileService {

    @Autowired
    private MediaRepository mediaRepository;

    private final Logger logger = Logger.getLogger(FileService.class.getName());;

    private static final long MAX_VIDEO_SIZE = 100 * 1024 * 1024;
    private static final List<String> ALLOWED_VIDEO_EXTENSIONS = Arrays.asList("mp4", "mkv", "avi");
    private static final List<String> ALLOWED_VIDEO_MIME_TYPES = Arrays.asList("video/mp4", "video/x-matroska",
	    "video/x-msvideo");

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
    private static final List<String> ALLOWED_IMAGE_MIME_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif",
	    "image/webp");

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
    public void saveFiles(MultipartFile[] files, Long ownerId, MediaType ownerType, MediaCategory category,
	    String uploadDirectory) throws IOException {
	Path uploadPath = Paths.get(uploadDirectory);
	if (!Files.exists(uploadPath)) {
	    Files.createDirectories(uploadPath);
	    logger.warning("Directory created: " + uploadPath);
	} else {
	    logger.warning("Directory already exists: " + uploadPath);
	}

	for (MultipartFile file : files) {
	    if (file == null || file.isEmpty()) {
		continue; // Skip empty files
	    }

	    validateFile(file, category); // Validate based on category

	    String uniqueFileName = saveFileToStorage(uploadDirectory, file);

	    logger.warning("Saving file: " + file.getOriginalFilename() + " to " + uploadPath.toString());

	    Media media = Media.builder().name(uniqueFileName).directory(uploadDirectory).mediaCategory(category)
		    .mediaType(ownerType).ownerId(ownerId).build();
	    mediaRepository.save(media);
	}
    }

    private void validateFile(MultipartFile file, MediaCategory category) throws IOException {
	String fileName = file.getOriginalFilename();
	String fileExtension = getFileExtension(fileName);
	String mimeType = file.getContentType();
	long fileSize = file.getSize();

	if (category == MediaCategory.VIDEO) { // Validate videos
	    if (!ALLOWED_VIDEO_EXTENSIONS.contains(fileExtension.toLowerCase())) {
		throw new IOException("Invalid video format. Allowed: " + ALLOWED_VIDEO_EXTENSIONS);
	    }
	    if (!ALLOWED_VIDEO_MIME_TYPES.contains(mimeType)) {
		throw new IOException("Invalid video MIME type. Allowed: " + ALLOWED_VIDEO_MIME_TYPES);
	    }
	    if (fileSize > MAX_VIDEO_SIZE) {
		throw new IOException("Video file size exceeds the 100MB limit.");
	    }
	} else if (category == MediaCategory.IMAGE) { // Validate images
	    if (!ALLOWED_IMAGE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
		throw new IOException("Invalid image format. Allowed: " + ALLOWED_IMAGE_EXTENSIONS);
	    }
	    if (!ALLOWED_IMAGE_MIME_TYPES.contains(mimeType)) {
		throw new IOException("Invalid image MIME type. Allowed: " + ALLOWED_IMAGE_MIME_TYPES);
	    }
	    if (fileSize > MAX_IMAGE_SIZE) {
		throw new IOException("Image file size exceeds the 5MB limit.");
	    }
	} else {
	    throw new IOException("Unsupported media category.");
	}
    }

    private String getFileExtension(String fileName) {
	if (fileName == null || !fileName.contains(".")) {
	    return "";
	}
	return fileName.substring(fileName.lastIndexOf(".") + 1);
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
    public GlobalResp updateFiles(MultipartFile[] files, Long ownerId, MediaType type, MediaCategory mediaCategory,
	    String uploadDirectory) throws IOException {
	if (files == null || files.length == 0) {
	    logger.warning("Files are the same, files are not changed");
	    return GlobalResp.builder().message("Files are the same, files are not changed").build();
	} else {
	    logger.warning("Files arent the same, files are processed");
	}

	GlobalResp deletingResp = deleteAllFiles(ownerId, type);

	if (deletingResp.getMessage().equalsIgnoreCase("File deleting failed")) {
	    logger.warning("File updating failed, files are not changed");
	    return GlobalResp.builder().message("File updating failed, files are not changed").build();
	} else {
	    logger.warning("Old File deleting successfully");
	}

	saveFiles(files, ownerId, type, mediaCategory, uploadDirectory);
	logger.warning("Files updated successfully");
	return GlobalResp.builder().message("Files updated successfully").build();

    }
}