# Architecture du Backend - Avolta Belgique

Ce document décrit l'architecture du backend Java Spring Boot pour l'application Avolta Belgique.

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Structure du projet](#2-structure-du-projet)
3. [Couches d'architecture](#3-couches-darchitecture)
4. [Modèle de données](#4-modèle-de-données)
5. [Sécurité](#5-sécurité)
6. [API REST](#6-api-rest)
7. [Gestion des erreurs](#7-gestion-des-erreurs)
8. [Tests](#8-tests)

## 1. Vue d'ensemble

Le backend de l'application Avolta Belgique est construit avec Java 17 et Spring Boot 3.x. Il suit une architecture en couches classique (MVC) avec une séparation claire des responsabilités. L'application expose une API REST sécurisée par JWT pour l'authentification et l'autorisation.

### 1.1. Technologies principales

- **Java 17**: Langage de programmation
- **Spring Boot 3.x**: Framework d'application
- **Spring Data JPA**: Accès aux données
- **Spring Security**: Sécurité et authentification
- **MySQL**: Base de données relationnelle
- **JWT**: Authentification basée sur les tokens
- **Maven**: Gestion des dépendances et build
- **JUnit 5**: Tests unitaires
- **Mockito**: Framework de mock pour les tests
- **Swagger/OpenAPI**: Documentation de l'API

## 2. Structure du projet

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── avolta/
│   │   │           ├── config/        # Configuration Spring
│   │   │           ├── controllers/   # Contrôleurs REST
│   │   │           ├── dto/           # Objets de transfert de données
│   │   │           ├── exceptions/    # Gestion des exceptions
│   │   │           ├── models/        # Entités JPA
│   │   │           ├── repositories/  # Accès aux données
│   │   │           ├── security/      # Configuration de sécurité
│   │   │           ├── services/      # Logique métier
│   │   │           └── Application.java
│   │   └── resources/
│   │       ├── application.properties # Configuration
│   │       └── db/
│   │           └── migration/         # Scripts de migration
│   └── test/                          # Tests unitaires et d'intégration
└── pom.xml                            # Dépendances Maven
```

## 3. Couches d'architecture

### 3.1. Contrôleurs (Controllers)

Les contrôleurs sont responsables de la gestion des requêtes HTTP et de la définition des points d'entrée de l'API REST. Ils délèguent le traitement des requêtes aux services appropriés et transforment les résultats en réponses HTTP.

Exemple de contrôleur:

```java
@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
public class PublicationController {

    private final PublicationService publicationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<PublicationDto>>> getAllPublications() {
        List<PublicationDto> publications = publicationService.getAllPublications();
        return ResponseEntity.ok(ApiResponse.success(publications));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PublicationDto>> createPublication(
            @Valid @RequestBody CreatePublicationRequest request,
            Authentication authentication) {
        PublicationDto createdPublication = publicationService.createPublication(request, authentication.getName());
        return new ResponseEntity<>(ApiResponse.success("Publication created successfully", createdPublication), HttpStatus.CREATED);
    }
}
```

### 3.2. Services (Services)

Les services contiennent la logique métier de l'application. Ils orchestrent les opérations, appliquent les règles métier et coordonnent les interactions avec les repositories.

Exemple de service:

```java
@Service
@RequiredArgsConstructor
public class PublicationService {

    private final PublicationRepository publicationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<PublicationDto> getAllPublications() {
        return publicationRepository.findAll().stream()
                .map(PublicationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PublicationDto createPublication(CreatePublicationRequest request, String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + authorEmail));

        Publication publication = new Publication();
        publication.setTitle(request.getTitle());
        publication.setContent(request.getContent());
        // ... autres propriétés
        publication.setAuthor(author);
        
        Publication savedPublication = publicationRepository.save(publication);
        return PublicationDto.fromEntity(savedPublication);
    }
}
```

### 3.3. Repositories (Repositories)

Les repositories fournissent une abstraction pour l'accès aux données. Ils utilisent Spring Data JPA pour interagir avec la base de données.

Exemple de repository:

```java
@Repository
public interface PublicationRepository extends JpaRepository<Publication, String> {
    List<Publication> findByAuthor(User author);
    List<Publication> findByStatus(Publication.Status status);
    
    @Query("SELECT p FROM Publication p WHERE p.status = 'PUBLISHED' AND p.validFrom <= :now AND p.validTo >= :now")
    List<Publication> findActivePublications(LocalDateTime now);
}
```

### 3.4. Entités (Models)

Les entités représentent les objets métier et sont mappées aux tables de la base de données via JPA.

Exemple d'entité:

```java
@Entity
@Table(name = "publications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_to", nullable = false)
    private LocalDateTime validTo;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int likes = 0;

    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @OneToMany(mappedBy = "publication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public enum Status {
        PENDING, PUBLISHED
    }
}
```

### 3.5. DTOs (Data Transfer Objects)

Les DTOs sont utilisés pour transférer des données entre les couches de l'application et pour exposer des données via l'API REST.

Exemple de DTO:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicationDto {
    private String id;
    private String title;
    private String content;
    private String imageUrl;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private LocalDateTime createdAt;
    private int likes;
    private String category;
    private Publication.Status status;
    private String authorId;
    private String authorName;
    private String authorEmail;
    private List<CommentDto> comments;

    public static PublicationDto fromEntity(Publication publication) {
        PublicationDto dto = new PublicationDto();
        dto.setId(publication.getId());
        dto.setTitle(publication.getTitle());
        // ... autres propriétés
        
        if (publication.getComments() != null) {
            dto.setComments(publication.getComments().stream()
                    .map(CommentDto::fromEntity)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
```

## 4. Modèle de données

### 4.1. Diagramme de classes

```
+----------------+       +----------------+       +----------------+
|      User      |       |  Publication   |       |    Comment     |
+----------------+       +----------------+       +----------------+
| id: String     |       | id: String     |       | id: String     |
| email: String  |       | title: String  |       | content: String|
| password: String|      | content: String|       | createdAt: Date|
| role: Role     |       | imageUrl: String|      | author: User   |
| createdAt: Date|       | validFrom: Date|       | publication:   |
| lastLogin: Date|       | validTo: Date  |       |  Publication   |
| status: Status |       | createdAt: Date|       +----------------+
+----------------+       | likes: int     |
        |                | category: String|
        |                | status: Status |
        |                | author: User   |
        |                +----------------+
        |                        |
        |                        |
        v                        v
+----------------+       +----------------+
|  Publications  |       |    Comments    |
+----------------+       +----------------+
```

### 4.2. Schéma de la base de données

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_login TIMESTAMP,
    status VARCHAR(20) NOT NULL
);

CREATE TABLE publications (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    publication_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE
);

CREATE TABLE newsletter_subscribers (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    last_sent_at TIMESTAMP
);
```

## 5. Sécurité

### 5.1. Authentification JWT

L'authentification est basée sur JSON Web Tokens (JWT). Lorsqu'un utilisateur se connecte avec succès, un token JWT est généré et renvoyé au client. Ce token doit être inclus dans l'en-tête `Authorization` de chaque requête ultérieure.

```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generateToken(userDetails);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ... autres méthodes
}
```

### 5.2. Autorisation basée sur les rôles

L'autorisation est gérée par Spring Security et utilise des annotations comme `@PreAuthorize` pour restreindre l'accès aux endpoints en fonction des rôles des utilisateurs.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource())
            .and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/publications/public/**").permitAll()
                .requestMatchers("/api/newsletter/subscribe").permitAll()
                .anyRequest().authenticated()
            )
            .addFilter(new JwtAuthenticationFilter(authenticationManager(null), jwtTokenProvider))
            .addFilterBefore(new JwtAuthorizationFilter(jwtTokenProvider, userService), 
                            UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    // ... autres méthodes
}
```

## 6. API REST

### 6.1. Endpoints principaux

| Méthode | URL | Description | Rôle requis |
|---------|-----|-------------|-------------|
| POST | /api/auth/login | Authentification | Public |
| POST | /api/auth/register | Création d'un utilisateur | SUPERADMIN |
| GET | /api/publications | Liste des publications | Authentifié |
| GET | /api/publications/public/active | Publications actives | Public |
| GET | /api/publications/public/{id} | Détail d'une publication | Public |
| POST | /api/publications | Création d'une publication | Authentifié |
| PUT | /api/publications/{id} | Mise à jour d'une publication | Authentifié |
| PUT | /api/publications/{id}/approve | Approbation d'une publication | SUPERADMIN |
| DELETE | /api/publications/{id}/reject | Rejet d'une publication | SUPERADMIN |
| POST | /api/publications/public/{id}/like | Like d'une publication | Public |
| GET | /api/publications/{id}/comments | Commentaires d'une publication | Public |
| POST | /api/publications/{id}/comments | Ajout d'un commentaire | Authentifié |
| POST | /api/newsletter/subscribe | Abonnement à la newsletter | Public |
| GET | /api/newsletter/subscribers | Liste des abonnés | Authentifié |
| DELETE | /api/newsletter/subscribers/{id} | Suppression d'un abonné | Authentifié |

### 6.2. Format des réponses

Toutes les réponses de l'API suivent un format standard:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-03-15T14:30:00Z"
}
```

En cas d'erreur:

```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "timestamp": "2025-03-15T14:30:00Z"
}
```

## 7. Gestion des erreurs

### 7.1. Exceptions personnalisées

```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

### 7.2. Gestionnaire d'exceptions global

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ApiResponse.error(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<?>> handleBadCredentialsException(BadCredentialsException ex) {
        return new ResponseEntity<>(ApiResponse.error("Invalid email or password"), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDeniedException(AccessDeniedException ex) {
        return new ResponseEntity<>(ApiResponse.error("Access denied: " + ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    // ... autres gestionnaires d'exceptions
}
```

## 8. Tests

### 8.1. Tests unitaires

Les tests unitaires utilisent JUnit 5 et Mockito pour tester les composants individuels de l'application.

Exemple de test de service:

```java
@ExtendWith(MockitoExtension.class)
public class PublicationServiceTest {

    @Mock
    private PublicationRepository publicationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PublicationService publicationService;

    @Test
    void getAllPublications_ShouldReturnAllPublications() {
        // Given
        List<Publication> publications = Arrays.asList(
            createPublication("1", "Title 1"),
            createPublication("2", "Title 2")
        );
        when(publicationRepository.findAll()).thenReturn(publications);

        // When
        List<PublicationDto> result = publicationService.getAllPublications();

        // Then
        assertEquals(2, result.size());
        assertEquals("Title 1", result.get(0).getTitle());
        assertEquals("Title 2", result.get(1).getTitle());
        verify(publicationRepository).findAll();
    }

    private Publication createPublication(String id, String title) {
        Publication publication = new Publication();
        publication.setId(id);
        publication.setTitle(title);
        // ... autres propriétés
        return publication;
    }
}
```

### 8.2. Tests d'intégration

Les tests d'intégration utilisent `@SpringBootTest` pour tester l'interaction entre les différentes couches de l'application.

Exemple de test d'intégration:

```java
@SpringBootTest
@AutoConfigureMockMvc
public class PublicationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PublicationService publicationService;

    @Test
    @WithMockUser
    void getAllPublications_ShouldReturnPublications() throws Exception {
        // Given
        List<PublicationDto> publications = Arrays.asList(
            createPublicationDto("1", "Title 1"),
            createPublicationDto("2", "Title 2")
        );
        when(publicationService.getAllPublications()).thenReturn(publications);

        // When & Then
        mockMvc.perform(get("/api/publications"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray())
            .andExpect(jsonPath("$.data.length()").value(2))
            .andExpect(jsonPath("$.data[0].title").value("Title 1"))
            .andExpect(jsonPath("$.data[1].title").value("Title 2"));
    }

    private PublicationDto createPublicationDto(String id, String title) {
        PublicationDto dto = new PublicationDto();
        dto.setId(id);
        dto.setTitle(title);
        // ... autres propriétés
        return dto;
    }
}
```

---

Ce document fournit une vue d'ensemble de l'architecture du backend de l'application Avolta Belgique. Pour plus de détails sur des composants spécifiques, veuillez consulter la documentation du code source.