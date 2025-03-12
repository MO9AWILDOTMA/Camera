package ma.cinecamera.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.model.enums.MediaType;

@Service
public interface IFileService {
    // Save image in a local directory
    public String saveFileToStorage(String uploadDirectory, MultipartFile imageFile) throws IOException;

    void saveFiles(MultipartFile[] files, Long ownerId, MediaType type, String uploadDirectory) throws IOException;

    public List<String> getFilePaths(Long ownerId, String uploadDirectory, MediaType type);

    GlobalResp deleteFileFromServer(String imageDirectory, String imageName) throws IOException;

    GlobalResp deleteAllFiles(Long ownerId, MediaType type);

    GlobalResp updateFiles(MultipartFile[] files, Long ownerId, MediaType type, String uploadDirectory)
	    throws IOException;

}
