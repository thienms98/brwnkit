# BrownKit

# MVP Roadmap

## Phase 1 - Foundation

### Authentication

- Login
- Logout

### Product Management

- CRUD Product
- Upload Thumbnail
- Upload GLB Model

### Storage

- Local Storage hoặc S3-compatible storage

### Database

User
Product
ProductPart
MaterialOption
SavedConfig

## Phase 2 - 3D Viewer

### ThreeJS Viewer

- Load GLB
- Orbit Controls
- HDR Environment

### Camera

- Rotate
- Zoom
- Reset Camera

### Performance

- Lazy Loading
- Suspense
- Draco Compression

## Phase 3 - Configurator

### Mesh Detection

Tự động đọc:

Chair
├─ Seat
├─ Legs
└─ Backrest

### Dynamic Configuration

Admin chọn:

Seat -> Editable
Legs -> Editable
Backrest -> Editable

### Material Editor

Người dùng:

- Đổi màu
- Đổi texture
- Reset

## Phase 4 - Save & Share

### Save Configuration

Ví dụ:

`{
  "Seat": "#ff0000",
  "Legs": "#000000"
}`

### Share Link

/configs/abc123

### Load Shared Config

Mở URL sẽ khôi phục cấu hình.

## Phase 5 - Admin Dashboard

### Product Analytics

- Tổng lượt xem
- Tổng cấu hình
  ###Configuration History

- Danh sách cấu hình đã lưu.

### Product Library

- Quản lý model.

```

```
