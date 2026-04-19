---
title: Droplet Detection
permalink: /projects/droplet-data/
layout: single
author_profile: true
toc: true
---

# Droplet Detection with YOLOv8 
**Repository:** [droplet-data](https://github.com/panda-yoo/droplet-data)

A computer vision project focused on detecting droplets in experimental images using **YOLOv8 object detection**. The goal was to automate image-based droplet analysis for scientific data processing.

### Project Overview

This project involved building a custom object detection dataset, training a YOLO model, and performing inference on unseen droplet images.

### Dataset Preparation

Images were manually labeled using **CVAT**.

- Total labeled images: **465**
- Training images: **369**
- Validation / test images: **96**

Dataset structure used for YOLO training:
### Result 
![img](../assets/files/project_files/droplet-data/0005890_infer.png)
```text
    dataset/
    ├── images/
    │   ├── train/
    │   └── val/
    └── labels/
        ├── train/
        └── val/
```