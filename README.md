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

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be available in the `dist` directory.

## Main Features

### Media Management
- **Video Upload**: Support for MP4 and MOV formats with automatic thumbnail generation
- **Audio Upload**: Support for MP3, WAV, and M4A formats with automatic waveform generation
- **Text Overlays**: Add customizable text elements to your timeline
- **Video Thumbnails**: Automatic thumbnail generation for video clips displayed in timeline
- **Audio Waveforms**: Automatic waveform visualization for audio clips in timeline

### Timeline Editing
- **Multi-track Timeline**: Separate tracks for video, audio, and text
- **Visual Feedback**: 
  - Video clips display thumbnails when wide enough
  - Audio clips display waveform visualization
- **Clip Manipulation**: 
  - Drag clips to reposition on timeline
  - Resize clips by dragging handles
  - Split clips at playhead position
  - Delete clips
- **Zoom Controls**: Logarithmic zoom slider for precise timeline navigation

### Playback Controls
- **Play/Pause**: Control playback with timeline controls or Spacebar keyboard shortcut
- **Seeking**: Click on timeline to jump to specific time
- **Frame Navigation**: Skip forward/backward by 5 seconds using buttons or arrow keys
- **Keyboard Shortcuts**: 
  - `Space` - Play/Pause
  - `←` (Left Arrow) - Move backward 5 seconds
  - `→` (Right Arrow) - Move forward 5 seconds

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
- **Timeline Scrubbing**: Improve timeline interaction for smoother seeking
- **Additional Keyboard Shortcuts**: Add more shortcuts (e.g., Delete key for removing clips, S for split)

### Media Features
- **Image Support**: Full implementation of image overlay functionality
- **More Format Support**: Expand supported video/audio formats
- **Multiple Thumbnails**: Generate multiple thumbnails across video duration for better timeline preview
- **Waveform Customization**: Allow users to customize waveform colors and styles

### Editing Capabilities
- **Transitions**: Add fade, crossfade, and other transition effects
- **Video Effects**: Color correction, filters, and other video effects
- **Audio Mixing**: Multiple audio tracks with individual volume controls
- **Keyframe Animation**: Animate properties over time

### User Experience
- **Project Save/Load**: Save and load project files
- **Performance Optimization**: Better handling of large video files and waveform generation for long audio files
- **Thumbnail Caching**: Cache generated thumbnails to improve performance on repeated uploads
- **Error Handling**: More robust error messages and recovery
- **Responsive Design**: Improve mobile/tablet support
- **Accessibility**: Enhanced keyboard navigation and screen reader support
- **Keyboard Shortcuts Help**: Add a help modal showing all available keyboard shortcuts

### Technical Improvements
- **State Management**: Consider Redux or Zustand for complex state
- **Video Processing**: Client-side video processing library integration
- **Caching**: Implement better caching for media files, thumbnails, and waveforms
- **Web Workers**: Move waveform and thumbnail generation to Web Workers for better performance
- **Testing**: Add unit and integration tests
- **Audio Context Management**: Optimize AudioContext usage for waveform generation
