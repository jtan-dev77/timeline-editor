# Flick - Web-Based Video Editor

A modern, browser-based video editing application built with React, TypeScript, and Tailwind CSS. Flick provides an intuitive timeline-based interface for editing videos, audio, and text overlays directly in your web browser.

## About

Flick is a lightweight video editor that runs entirely in the browser. It supports multiple media types including video (MP4, MOV), audio (MP3, WAV, M4A), and text overlays. The application features a professional timeline interface with drag-and-drop functionality, making video editing accessible without requiring desktop software.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jtan-dev77/timeline-editor
cd Flick
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be available in the `dist` directory.

## Main Features

### Media Management
- **Video Upload**: Support for MP4 and MOV formats
- **Audio Upload**: Support for MP3, WAV, and M4A formats
- **Text Overlays**: Add customizable text elements to your timeline

### Timeline Editing
- **Multi-track Timeline**: Separate tracks for video, audio, and text
- **Clip Manipulation**: 
  - Drag clips to reposition on timeline
  - Resize clips by dragging handles
  - Split clips at playhead position
  - Delete clips
- **Zoom Controls**: Logarithmic zoom slider for precise timeline navigation

### Playback Controls
- **Play/Pause**: Control playback with timeline controls
- **Seeking**: Click on timeline to jump to specific time
- **Frame Navigation**: Skip forward/backward by 5 seconds

### Clip Properties
- **Speed Control**: Adjust playback speed (0.1x to 16x) with logarithmic slider
- **Opacity**: Control video opacity (0-100%)
- **Mute**: Toggle audio/video muting
- **Trim**: Adjust clip start and end times
- **Text Styling**: 
  - Font size, family, color
  - Bold and italic formatting
  - Drag-and-drop positioning in preview area

### Preview
- **Real-time Preview**: See changes instantly in the preview area
- **Aspect Ratio Preservation**: Videos maintain their aspect ratio while fitting the preview area
- **Interactive Text**: Drag text overlays directly in the preview to position them

## What Can Be Improved

### Core Functionality
- **Export Functionality**: Add ability to export edited videos
- **Undo/Redo**: Implement history management for editing operations
- **Keyboard Shortcuts**: Add keyboard shortcuts for common actions (space for play/pause, etc.)
- **Timeline Scrubbing**: Improve timeline interaction for smoother seeking

### Media Features
- **Video Thumbnails**: Generate and display thumbnails for video clips
- **Audio Waveform Visualization**: Show audio waveforms in timeline
- **Image Support**: Full implementation of image overlay functionality
- **More Format Support**: Expand supported video/audio formats

### Editing Capabilities
- **Transitions**: Add fade, crossfade, and other transition effects
- **Video Effects**: Color correction, filters, and other video effects
- **Audio Mixing**: Multiple audio tracks with individual volume controls
- **Keyframe Animation**: Animate properties over time

### User Experience
- **Project Save/Load**: Save and load project files
- **Performance Optimization**: Better handling of large video files
- **Error Handling**: More robust error messages and recovery
- **Responsive Design**: Improve mobile/tablet support
- **Accessibility**: Enhanced keyboard navigation and screen reader support

### Technical Improvements
- **State Management**: Consider Redux or Zustand for complex state
- **Video Processing**: Client-side video processing library integration
- **Caching**: Implement better caching for media files
- **Testing**: Add unit and integration tests
