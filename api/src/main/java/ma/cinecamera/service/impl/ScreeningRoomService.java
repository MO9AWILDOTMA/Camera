package ma.cinecamera.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.slugify.Slugify;

import ma.cinecamera.dto.req.ScreeningRoomReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.ScreeningRoomRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.ScreeningRoomMapper;
import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.enums.ActivityType;
import ma.cinecamera.model.enums.MediaCategory;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.ScreeningRoomRepository;
import ma.cinecamera.service.IFileService;
import ma.cinecamera.service.IScreeningRoomService;
import ma.cinecamera.service.ISeatService;

@Service
public class ScreeningRoomService implements IScreeningRoomService {

    @Autowired
    private ScreeningRoomRepository repository;

    @Autowired
    private ScreeningRoomMapper mapper;

    @Autowired
    private IFileService fileService;

    @Autowired
    private ISeatService seatService;

    private final Logger logger = Logger.getLogger(ScreeningRoom.class.getName());

    @Autowired
    private ActivityService activityService;

//  @Value("${screeningRoom.file.upload.directory}")
    private final String uploadDirectory = "uploads/images/screeningRooms";

    private final Slugify slg = new Slugify();

    @Override
    public ScreeningRoom getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Screening Room Not Found"));
    }

    @Override
    public ListResponse getAllScreeningRooms(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	Page<ScreeningRoom> res = repository.findAll(pageable);
	List<ScreeningRoom> sRooms = res.getContent();
	Long totalElements = res.getTotalElements();
	Integer totalPages = res.getTotalPages();
	List<ScreeningRoomRespDto> respDto = mapper.entitiesToDto(sRooms).stream().map(d -> {
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), uploadDirectory, MediaType.SCREENING_ROOM));
	    return d;
	}).collect(Collectors.toList());

	return ListResponse.builder().content(respDto).totalElements(totalElements).totalPages(totalPages).build();
    }

    @Override
    public ScreeningRoomRespDto getScreeningRoomDetail(String slug) {
	ScreeningRoom sRoom = repository.findBySlug(slug)
		.orElseThrow(() -> new ResourceNotFoundException("Screening Room Not Found"));
	ScreeningRoomRespDto respDto = mapper.entityToDto(sRoom);

	// Set image paths in the response DTO
	String uniqueUploadDir = uploadDirectory + "/" + respDto.getId();
	respDto.setPicturePaths(fileService.getFilePaths(respDto.getId(), uniqueUploadDir, MediaType.SCREENING_ROOM));

	return respDto;
    }

    @Override
    public ScreeningRoomRespDto createScreeningRoom(ScreeningRoomReqDto dto) throws IOException {
	ScreeningRoom sRoom = mapper.DtoToEntity(dto);

	if (dto.getImageFiles() == null || dto.getImageFiles().length == 0) {
	    throw new IllegalArgumentException("No image files provided");
	}

	sRoom.setSlug(slg.slugify(sRoom.getName()));
	ScreeningRoom savedScreeningRoom = repository.save(sRoom);

	seatService.createSeats(savedScreeningRoom);

	String uniqueUploadDir = uploadDirectory + "/" + savedScreeningRoom.getId();

	// Save associated image files
	fileService.saveFiles(dto.getImageFiles(), savedScreeningRoom.getId(), MediaType.SCREENING_ROOM,
		MediaCategory.IMAGE, uniqueUploadDir);

	activityService.createActivity(ActivityType.SCREENING_ROOM, sRoom.getName());

	ScreeningRoomRespDto respDto = mapper.entityToDto(savedScreeningRoom);

	// Set image paths in the response DTO
	respDto.setPicturePaths(
		fileService.getFilePaths(savedScreeningRoom.getId(), uniqueUploadDir, MediaType.SCREENING_ROOM));

	return respDto;
    }

    @Override
    public ScreeningRoomRespDto updateScreeningRoom(Long id, ScreeningRoomReqDto dto) throws IOException {
	ScreeningRoom sRoom = getById(id);

	sRoom.setName(dto.getName());
	sRoom.setSlug(slg.slugify(sRoom.getName()));
	if (dto.getTotalSeats() != sRoom.getTotalSeats()) {
	    seatService.deleteSeats(sRoom.getSeats());
	    seatService.createSeats(sRoom);
	}
	ScreeningRoom updatedRoom = repository.save(sRoom);

	String uniqueUploadDir = uploadDirectory + "/" + updatedRoom.getId();

	fileService.updateFiles(dto.getImageFiles(), updatedRoom.getId(), MediaType.SCREENING_ROOM, MediaCategory.IMAGE,
		uniqueUploadDir);
	ScreeningRoomRespDto respDto = mapper.entityToDto(updatedRoom);

	// Set image paths in the response DTO
	respDto.setPicturePaths(
		fileService.getFilePaths(updatedRoom.getId(), uniqueUploadDir, MediaType.SCREENING_ROOM));

	return respDto;
    }

    @Override
    public GlobalResp deleteScreeningRoom(Long id) {
	ScreeningRoom sRoom = getById(id);
	fileService.deleteAllFiles(id, MediaType.SCREENING_ROOM);

	repository.delete(sRoom);
	return GlobalResp.builder().message("Showtime deleted succussfully").id(id).createdAt(sRoom.getCreatedAt())
		.updatedAt(sRoom.getUpdatedAt()).build();
    }

}
