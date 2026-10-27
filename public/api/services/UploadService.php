<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Image uploads for Admin CMS with optional crop, compress, and WebP output.
 */
final class UploadService
{
    private string $uploadsDir;
    private int $maxBytes;

    /** @var array<string, string> */
    private array $allowedMime = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];

    public function __construct(?string $uploadsDir = null, int $maxBytes = 5_242_880)
    {
        $this->uploadsDir = $uploadsDir ?? (dirname(__DIR__) . '/storage/uploads');
        $this->maxBytes = $maxBytes;

        if (!is_dir($this->uploadsDir)) {
            if (!@mkdir($this->uploadsDir, 0755, true) && !is_dir($this->uploadsDir)) {
                throw new \RuntimeException('Uploads directory could not be created.');
            }
        }
        if (!is_writable($this->uploadsDir)) {
            throw new \RuntimeException('Uploads directory is not writable.');
        }

        $deny = $this->uploadsDir . '/.htaccess';
        if (!is_file($deny)) {
            @file_put_contents($deny, "Options -Indexes\n");
        }
    }

    /**
     * @param array<string, mixed> $file from $_FILES['file']
     * @param array{
     *   webp?: bool,
     *   maxWidth?: int,
     *   maxHeight?: int,
     *   quality?: int,
     *   crop?: array{x?: int|float, y?: int|float, width?: int|float, height?: int|float}
     * } $options
     * @return array{url: string, path: string, token: string, mime: string, size: int, width?: int, height?: int}
     */
    public function store(array $file, array $options = []): array
    {
        $error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($error !== UPLOAD_ERR_OK) {
            throw new \InvalidArgumentException('Upload failed.');
        }

        $tmp = (string) ($file['tmp_name'] ?? '');
        $size = (int) ($file['size'] ?? 0);
        if ($tmp === '' || !is_uploaded_file($tmp)) {
            throw new \InvalidArgumentException('Invalid upload.');
        }
        if ($size <= 0 || $size > $this->maxBytes) {
            throw new \InvalidArgumentException('File too large (max 5MB).');
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmp) ?: '';
        if (!isset($this->allowedMime[$mime])) {
            throw new \InvalidArgumentException('Only JPG, PNG, WEBP, GIF images are allowed.');
        }

        $subdir = gmdate('Y/m');
        $dir = $this->uploadsDir . '/' . $subdir;
        if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
            throw new \RuntimeException('Could not create upload subdirectory.');
        }

        $wantWebp = ($options['webp'] ?? true) !== false;
        $maxW = max(0, (int) ($options['maxWidth'] ?? 1920));
        $maxH = max(0, (int) ($options['maxHeight'] ?? 1920));
        $quality = max(40, min(95, (int) ($options['quality'] ?? 82)));
        $crop = is_array($options['crop'] ?? null) ? $options['crop'] : null;

        $processed = $this->processImage($tmp, $mime, $wantWebp, $maxW, $maxH, $quality, $crop);
        $ext = $processed['ext'];
        $outMime = $processed['mime'];
        $binary = $processed['data'];
        $width = $processed['width'];
        $height = $processed['height'];

        $name = rankrise_uuid() . '.' . $ext;
        $dest = $dir . '/' . $name;
        if (file_put_contents($dest, $binary) === false) {
            throw new \RuntimeException('Failed to write optimized image.');
        }

        $relative = $subdir . '/' . $name;
        $token = str_replace('/', '--', $relative);
        $finalSize = (int) filesize($dest);

        return [
            'url' => '/api/index.php/v1/uploads/' . rawurlencode($token),
            'path' => $relative,
            'token' => $token,
            'mime' => $outMime,
            'size' => $finalSize,
            'width' => $width,
            'height' => $height,
            'optimized' => true,
            'format' => $ext,
        ];
    }

    /**
     * @param array{x?: mixed, y?: mixed, width?: mixed, height?: mixed}|null $crop
     * @return array{data: string, mime: string, ext: string, width: int, height: int}
     */
    private function processImage(
        string $tmp,
        string $mime,
        bool $wantWebp,
        int $maxW,
        int $maxH,
        int $quality,
        ?array $crop
    ): array {
        if (!function_exists('imagecreatefromstring')) {
            // GD missing — store original bytes
            $raw = file_get_contents($tmp);
            if ($raw === false) {
                throw new \RuntimeException('Could not read upload.');
            }
            $ext = $this->allowedMime[$mime];
            return ['data' => $raw, 'mime' => $mime, 'ext' => $ext, 'width' => 0, 'height' => 0];
        }

        $raw = file_get_contents($tmp);
        if ($raw === false) {
            throw new \RuntimeException('Could not read upload.');
        }
        $src = @imagecreatefromstring($raw);
        if ($src === false) {
            throw new \InvalidArgumentException('Invalid image data.');
        }

        $srcW = imagesx($src);
        $srcH = imagesy($src);

        // Crop (pixel coords relative to original)
        if ($crop !== null) {
            $cx = max(0, (int) round((float) ($crop['x'] ?? 0)));
            $cy = max(0, (int) round((float) ($crop['y'] ?? 0)));
            $cw = max(1, (int) round((float) ($crop['width'] ?? $srcW)));
            $ch = max(1, (int) round((float) ($crop['height'] ?? $srcH)));
            if ($cx + $cw > $srcW) {
                $cw = $srcW - $cx;
            }
            if ($cy + $ch > $srcH) {
                $ch = $srcH - $cy;
            }
            if ($cw > 0 && $ch > 0) {
                $cropped = imagecrop($src, ['x' => $cx, 'y' => $cy, 'width' => $cw, 'height' => $ch]);
                if ($cropped !== false) {
                    imagedestroy($src);
                    $src = $cropped;
                    $srcW = imagesx($src);
                    $srcH = imagesy($src);
                }
            }
        }

        // Resize down if needed
        $dstW = $srcW;
        $dstH = $srcH;
        if ($maxW > 0 && $maxH > 0 && ($srcW > $maxW || $srcH > $maxH)) {
            $ratio = min($maxW / $srcW, $maxH / $srcH);
            $dstW = max(1, (int) floor($srcW * $ratio));
            $dstH = max(1, (int) floor($srcH * $ratio));
        }

        $dst = imagecreatetruecolor($dstW, $dstH);
        if ($dst === false) {
            imagedestroy($src);
            throw new \RuntimeException('Could not allocate image canvas.');
        }
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
        imagefilledrectangle($dst, 0, 0, $dstW, $dstH, $transparent);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $dstW, $dstH, $srcW, $srcH);
        imagedestroy($src);

        ob_start();
        $canWebp = $wantWebp && function_exists('imagewebp');
        if ($canWebp) {
            imagewebp($dst, null, $quality);
            $data = (string) ob_get_clean();
            imagedestroy($dst);
            return [
                'data' => $data,
                'mime' => 'image/webp',
                'ext' => 'webp',
                'width' => $dstW,
                'height' => $dstH,
            ];
        }

        // Fallback JPEG compress
        imagejpeg($dst, null, $quality);
        $data = (string) ob_get_clean();
        imagedestroy($dst);
        return [
            'data' => $data,
            'mime' => 'image/jpeg',
            'ext' => 'jpg',
            'width' => $dstW,
            'height' => $dstH,
        ];
    }

    public function resolveAbsolute(string $relativePath): ?string
    {
        $clean = str_replace(['\\', "\0"], ['/', ''], $relativePath);
        if (str_contains($clean, '--') && !str_contains($clean, '/')) {
            $clean = str_replace('--', '/', $clean);
        }
        $clean = ltrim($clean, '/');
        if ($clean === '' || str_contains($clean, '..')) {
            return null;
        }
        $parts = explode('/', $clean);
        foreach ($parts as $p) {
            if ($p === '' || $p === '.' || $p === '..') {
                return null;
            }
            if (!preg_match('/^[a-zA-Z0-9._\-]+$/', $p)) {
                return null;
            }
        }
        $full = $this->uploadsDir . '/' . $clean;
        $realBase = realpath($this->uploadsDir);
        $realFile = realpath($full);
        if ($realBase === false || $realFile === false) {
            return null;
        }
        if (!str_starts_with($realFile, $realBase . DIRECTORY_SEPARATOR) && $realFile !== $realBase) {
            return null;
        }
        if (!is_file($realFile)) {
            return null;
        }
        return $realFile;
    }
}
