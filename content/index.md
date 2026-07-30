---
aliases:
  - Depth Anything Jetson
title: Live Any-View 3D Reconstruction on Jetson Orin Nano
tags:
  - capstone
  - jetson
  - depth-anything-v3
  - 3d-reconstruction
status: planning
---

> [!abstract] Project in one sentence
> Adapt Depth Anything V3 Small to an 8 GB Jetson Orin Nano Super for incremental multi-view point-cloud reconstruction with overlapping windows.

## Research question

> How effectively can Depth Anything V3 Small be adapted for incremental, spatially coherent point-cloud reconstruction on an 8 GB edge device?

## Architecture

```text
calibrated RGB camera
    → slow, overlapping frame selection
    → 4-frame DA3 window with 2 retained overlap frames
    → relative depth + confidence + intrinsics + camera poses
    → confidence-filtered window point cloud
    → overlap-based Sim(3) alignment
    → bounded global point cloud
    → live viewer and export
```

## Locked defaults

- **Model:** `depth-anything/DA3-SMALL`
- **Runtime:** official Python API with PyTorch FP16
- **Primary configuration:** 4 frames, 2-frame overlap, 336 px
- **Fallback:** 3 frames, 2-frame overlap, 280 px
- **Memory gate:** peak used memory below 7.0 GB
- **Confidence filter:** discard the lowest 40% per frame
- **Map bounds:** 30 accepted windows and 1,000,000 points
- **Live target:** one accepted viewer update every five seconds
- **Scale:** arbitrary internal units until an independent 1.0 m reference is applied

## Project notes

### Proposal

- [[Capstone Proposal]] — submission-ready motivation, objectives, tiers, and success criteria
- [[Risks and Limitations]] — scale, alignment, deployment, validity, and scope risks

### Design

- [[System Architecture]] — data flow, sliding-window state, queues, and runtime artifacts
- [[DA3 Model and Outputs]] — checkpoint, inference configuration, output contract, and coordinates
- [[Window Alignment and Mapping]] — Sim(3) registration, point accumulation, bounds, and metric scaling
- [[Final Demo Target and Reference Systems]] — achievable visual outcome, related projects, and explicit stretch goals

### Implementation

- [[Jetson Platform and Feasibility]] — hardware budget, dependency compatibility, and feasibility decision
- [[Camera and Data Collection]] — calibration, capture settings, recordings, and scale reference
- [[Deployment Roadmap]] — ordered phases, implementation gates, and deliverables

### Evaluation

- [[Evaluation Plan]] — evaluation questions, locked test configuration, and acceptance summary
- [[Test Protocols]] — step-by-step resource, geometry, alignment, performance, and stability tests
- [[Results Templates]] — tables, required figures, and reporting guidance

## Milestones

- [ ] Freeze the Jetson software stack and camera mode
- [ ] Calibrate the camera below 0.5 px mean reprojection error
- [ ] Pass the DA3 Small resource-feasibility gate
- [ ] Validate DA3 output shapes and coordinate conventions
- [ ] Export a confidence-filtered point cloud from one window
- [ ] Align two recorded windows with Sim(3)
- [ ] Accumulate a bounded recorded room sweep
- [ ] Integrate live capture and continual viewer updates
- [ ] Apply independent scale normalization and measure the doorway
- [ ] Complete the five-minute performance test
- [ ] Complete the 15-minute stability run

## Primary sources

- [Depth Anything 3 paper](https://arxiv.org/abs/2511.10647)
- [Official Depth Anything 3 repository](https://github.com/ByteDance-Seed/Depth-Anything-3)
- [Official DA3 Small model card](https://huggingface.co/depth-anything/DA3-SMALL)
- [Official DA3 Python API](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/docs/API.md)
- [Official DA3-Streaming documentation](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/da3_streaming/README.md)
