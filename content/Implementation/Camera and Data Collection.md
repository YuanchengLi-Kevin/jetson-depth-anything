---
tags:
  - camera
  - calibration
  - data-collection
  - evaluation
status: planning
---

# Camera and Data Collection

## Camera configuration

- Use one USB or CSI RGB camera
- Lock capture resolution for calibration, recording, and live operation
- Lock focus and exposure where supported
- Record camera model, capture mode, focus, exposure, and timestamp method
- Use active cooling and the Jetson's 25 W mode during final recordings

## Calibration

Use OpenCV's pinhole camera model and an accurately measured checkerboard. Capture images across the field of view with varied position, angle, and distance.

Save:

- Image width and height
- `fx`, `fy`, `cx`, and `cy`
- Distortion coefficients
- Checkerboard dimensions and square size
- Accepted image count
- Per-image, mean, and maximum reprojection error
- Camera identifier and capture settings

Mean reprojection error must be below 0.5 pixels. Recalibrate if the camera mode, focus, or resolution changes.

DA3 predicts its own intrinsics. Compare them with the calibration for diagnosis, but use DA3-returned intrinsics for DA3 back-projection.

## Frame capture and selection

- Undistort captured RGB before selection
- Preserve a unique frame identifier and timestamp
- Keep the camera preview responsive
- Move slowly through one small, mostly static indoor room
- Select frames at approximately 2 Hz
- Maintain visible overlap and useful parallax
- Avoid rapid rotation, motion blur, people, and moving objects
- Preserve the exact selected frame pixels for reuse in overlapping windows

The primary window retains two overlap frames. Candidate replacement may affect only new non-overlap frames before inference begins.

## Recorded sequences

Create:

1. **Development sweep:** used for debugging preprocessing, output conventions, and alignment implementation.
2. **Untouched evaluation sweep:** used once with the locked configuration for reported results.

Both sweeps should cover the same controlled room with slow, high-overlap motion. Do not tune thresholds on the evaluation sweep.

## Independent scale reference

Place a rigid, independently measured 1.0 m segment where it is visible in the first accepted window.

- Photograph and label the physical reference
- Keep both endpoints visible and away from reflective surfaces
- Record endpoint selection in the raw relative point cloud
- Use it only to compute the global metric scale
- Do not use the evaluation doorway as the scale reference

## Doorway evaluation target

Select one clearly reconstructed doorway and physically measure:

- Inside-frame width
- Inside-frame height

Photograph the measurements and preserve the endpoint-selection procedure for [[Test Protocols]].

## Data records

For each selected frame retain:

- Frame identifier
- Timestamp
- Calibration identifier
- Durable RGB file or run-local reference
- Window memberships
- Whether the frame is overlap or new geometry

## Related notes

- [[System Architecture]]
- [[DA3 Model and Outputs]]
- [[Window Alignment and Mapping]]
- [[Test Protocols]]
