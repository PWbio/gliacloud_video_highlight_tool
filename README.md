# Demo URL
http://gliacloud.s3-website-us-east-1.amazonaws.com/

# Video Highlight Tool - Frontend Homework Assignment

- You should provide
  - Code on github
  - Document about your technical choices
  - An active url to run your work

- Support platforms:
    - Desktop: windows & mac, latest Chrome
    - Mobile: iOS & Android, latest Chrome & Safari
 
- You can use claude or any AI tools to complete this homework.

## 1. Project Overview

Your task is to build a demo of a video highlight editing tool. This tool uses AI to help users create highlight clips from uploaded videos and add transcripts to these clips.

*This image shows an example layout. Feel free to modify the design as long as you meet all the requirements.*
<img width="1359" alt="image" src="https://gist.github.com/user-attachments/assets/d632451a-d688-42f1-abf7-9bcb7f1faaef">


## 2. Key Features

### 2.1 Video Upload [completed]
- Users can upload video files [v]

### 2.2 Mock AI Processing [completed]
- Use a mock API to simulate AI processing [v]
- The mock API should return:
  - Full video transcript [v]
  - Transcript split into sections [v]
  - Titles for each section [v]
  - Suggested highlight sentences [v]
- All this data should be in JSON format [v]

### 2.3 User Interface

#### 2.3.1 Layout [completed]
- Split screen design:
  - Left side: Editing area [v]
  - Right side: Preview area [v]

#### 2.3.2 Editing Area (Left) [completed]
- Shows the transcript with:
  - Section titles [v]
  - Sentences and their timestamps [v]
- Users can select or unselect sentences for the highlight clip [v]
- Clickable timestamps for easy navigation [v]
- Auto-scrolls to follow preview playback [v]

#### 2.3.3 Preview Area (Right)
- Shows the edited highlight clip, not the original video [v]
- Video player with standard controls (play, pause, seek) [v]
- Displays selected transcript text overlaid on the video [v]
- Timeline showing selected highlights [v]
- Smooth transition between selected clips [!]

#### 2.3.4 Synchronization [completed]
- Editing Area to Preview Area:
  - Clicking a timestamp updates the preview timeline to that time [v]
  - Selecting/unselecting sentences updates the preview content [v]
- Preview Area to Editing Area:
  - During playback, the current sentence is highlighted in the editing area [v]
  - The editing area automatically scrolls to keep the current sentence visible [v]

### 2.4 Transcript Overlay [completed]
- Selected sentences appear as text overlay on the video in the preview area [v]
- Text timing matches the audio of the selected clip [v]

## 3. Evaluation Note

Your submission will be evaluated based on the following criteria:

- Implementation of the required features
- Code quality and organization
- Documentation quality
- User experience (UX) design
- Responsive web design (RWD) implementation
- Quality and appropriateness of mock data
- Overall efficacy and polish of the demo
