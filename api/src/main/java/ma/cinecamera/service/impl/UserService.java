package ma.cinecamera.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.dto.req.ProfileUpdateReq;
import ma.cinecamera.dto.req.RolesDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.UserRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.UserMapper;
import ma.cinecamera.model.Role;
import ma.cinecamera.model.User;
import ma.cinecamera.model.enums.MediaCategory;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.RoleRepository;
import ma.cinecamera.repository.UserRepository;
import ma.cinecamera.service.IFileService;
import ma.cinecamera.service.IUserService;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private IFileService fileService;

    @Autowired
    private UserMapper mapper;

    @Autowired
    private PasswordEncoder encoder;

//  @Value("${user.file.upload.directory}")
    private final String uploadDirectory = "uploads/images/users";

    private final Logger logger = Logger.getLogger(UserService.class.getName());

    @Override
    public User getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
    }

    @Override
    public ListResponse getAll(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	Page<User> res = repository.findAll(pageable);
	Long totalElements = res.getTotalElements();
	Integer totalPages = res.getTotalPages();
	List<User> users = res.getContent();
	List<UserRespDto> respDto = mapper.entitiesToDto(users).stream().map(d -> {
	    d.setPicture(getPicturePath(d.getId()));
	    return d;
	}).collect(Collectors.toList());

	return ListResponse.builder().content(respDto).totalElements(totalElements).totalPages(totalPages).build();
    }

    @Override
    public UserRespDto getDetail(Long id) {
	User user = getById(id);

	UserRespDto respDto = mapper.entityToDto(user);
	respDto.setPicture(getPicturePath(id));
	return respDto;
    }

    private String getPicturePath(Long id) {
	List<String> pathList = fileService.getFilePaths(id, uploadDirectory, MediaType.USER);
	return pathList != null && pathList.size() > 0 ? pathList.get(0) : "";
    }

    @Override
    @Transactional
    public UserRespDto update(Long id, ProfileUpdateReq dto) throws IOException {
	if (dto == null) {
	    throw new IllegalArgumentException("Movie data cannot be null");
	}

	User user = getById(id);

	user.setFirstName(dto.getFirstName());
	user.setEmail(dto.getEmail());
	user.setEnable(dto.getEnable() != null ? dto.getEnable() : user.getEnable());
	user.setPhone(dto.getPhone() != null && dto.getPhone().length() > 0 ? dto.getPhone() : user.getPhone());
	user.setLastName(
		dto.getLastName() != null && dto.getLastName().length() > 0 ? dto.getLastName() : user.getLastName());

	if (dto.getPassword() != null && dto.getPassword().length() > 0) {
	    String encodedPass = encoder.encode(dto.getPassword());
	    user.setPassword(encodedPass);
	}

	User updatedUser = repository.save(user);

	if (dto.getImageFile() != null) {
	    String uniqueUploadDir = uploadDirectory + "/" + id;

	    MultipartFile[] files = new MultipartFile[1];

	    files[0] = dto.getImageFile();

	    fileService.updateFiles(files, id, MediaType.USER, MediaCategory.IMAGE, uniqueUploadDir);
	} else {
	    logger.warning("**** File isnt here **** " + dto.getImageFile());
	}

	UserRespDto respDto = mapper.entityToDto(updatedUser);
	respDto.setPicture(getPicturePath(id));
	return respDto;
    }

    @Override
    public GlobalResp delete(Long id) {
	User user = getById(id);
	repository.delete(user);
	fileService.deleteAllFiles(id, MediaType.USER);
	return GlobalResp.builder().message("User deleted successfully").id(id).createdAt(user.getCreatedAt())
		.updatedAt(user.getUpdatedAt()).build();
    }

    @Override
    public GlobalResp assignRoles(Long id, RolesDto dto) {
	User user = getById(id);

	List<Role> roles = roleRepository.findByNames(dto.getRoles());
	user.setRoles(roles);

	repository.save(user);
	return GlobalResp.builder().message("Roles assigned successfully").id(id).createdAt(user.getCreatedAt())
		.updatedAt(user.getUpdatedAt()).build();
    }

    @Override
    public UserRespDto getMyAccount() {
	Long id = getConnectedUserId();
	return getDetail(id);
    }

    @Override
    public UserRespDto updateMyAccount(ProfileUpdateReq dto) throws IOException {
	Long id = getConnectedUserId();
	return update(id, dto);
    }

    @Override
    public GlobalResp deleteMyAccount() {
	Long id = getConnectedUserId();
	return delete(id);
    }

    @Override
    public Long getConnectedUserId() {
	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	// Check if the user is authenticated and not anonymous
	if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)
		&& authentication.isAuthenticated()) {
	    Object principal = authentication.getPrincipal();
	    if (principal instanceof org.springframework.security.core.userdetails.User) {
		org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) principal;
		return repository.findByEmail(user.getUsername())
			.orElseThrow(() -> new ResourceNotFoundException("User Not Found")).getId();
	    }
	} else {
	    throw new ResourceNotFoundException("User Not Authenticated");
	}

	return null; // Return null if the user is not authenticated or anonymous
    }

}
