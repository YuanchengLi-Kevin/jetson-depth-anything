---
aliases:
  - Depth Anything Jetson
tags:
  - capstone
  - jetson
  - monocular-depth
status: planning
---

# Depth Anything V2 on Jetson Orin Nano Super

> [!abstract] Project in one sentence
> Deploy and evaluate Depth Anything V2 Small for live monocular depth estimation on a Jetson Orin Nano Super, with TensorRT FP16 optimization and a practical camera-based demonstration.

## Research question

> How effectively can Depth Anything V2 be optimized for real-time monocular depth estimation on a resource-constrained edge platform?

## Project notes

- [[Capstone Proposal]] — motivation, scope, deliverables, and success criteria
- [[Model and Hardware]] — model choice, device constraints, and starting configuration
- [[Deployment Plan]] — path from PyTorch to a live TensorRT application
- [[Evaluation Plan]] — experiments, metrics, and result tables
- [[Risks and Limitations]] — deployment risks and the relative-depth limitation

## Current direction

- **Primary model:** Depth Anything V2 Small
- **Primary optimization:** TensorRT FP16
- **Input:** USB or CSI camera
- **Output:** live relative-depth map
- **Application layer:** obstacle warning or navigation aid
- **Primary comparison:** PyTorch FP32/FP16 versus TensorRT FP16

## Milestones

- [ ] Establish a PyTorch CUDA baseline
- [ ] Run inference on recorded images and video
- [ ] Add live USB or CSI camera capture
- [ ] Export the model to ONNX
- [ ] Build and validate a TensorRT FP16 engine on the Jetson
- [ ] Separate and time capture, preprocessing, inference, and visualization
- [ ] Benchmark speed, latency, memory, power, temperature, and accuracy
- [ ] Implement the demonstration application
- [ ] Analyze accuracy–performance trade-offs
- [ ] Prepare the final report and presentation

## Next actions

- [ ] Record the exact JetPack, CUDA, cuDNN, TensorRT, and Python versions
- [ ] Confirm the camera and storage hardware
- [ ] Define the accuracy dataset and ground-truth method
- [ ] Choose the final demonstration scenario
- [ ] Create the first baseline benchmark

