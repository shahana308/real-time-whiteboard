# Real-Time Whiteboard

This project is a real-time collaborative whiteboard, allowing users to draw and interact with each other through a shared canvas. It includes various tools and customization features to provide a rich drawing experience.

## Features

- **Real-Time Drawing**: Multiple users can draw simultaneously on the canvas, and all actions are synchronized in real-time.
- **Color Selection**: Two different types of color pickers are available (Circle and Swatch), allowing users to easily pick from a wide range of colors.
- **Brush Size Selection**: Users can customize the brush size using a range slider to fit their drawing needs.
- **Brush Types**: The whiteboard supports different brush types:
  - Normal
  - Blurred
  - Dotted
- **Clear Canvas**: Users can clear the entire whiteboard with a single button.
- **Simple UI**: The user interface is clean, with easy access to all tools, including color pickers, brush settings, and more.
<img width="1728" alt="image" src="https://github.com/user-attachments/assets/46a59d48-ec60-4d58-a755-2fd36e6021a3" />

## Deployment

The project is deployed and accessible at:

[https://real-time-whiteboard-sand.vercel.app](https://real-time-whiteboard-sand.vercel.app)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Ant Design
- **Backend**: Node.js, Socket.io for real-time communication
- **Deployment**: Vercel for hosting the front-end, making it accessible globally

## Installation and Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/real-time-whiteboard.git
   cd real-time-whiteboard
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` to use the whiteboard locally.

## 🚀 Usage

1. **Open the Whiteboard**  
   Start a new session or join an existing one.

2. **Draw and Customize**  
   Use colors, brush sizes, and pencil types to enhance your drawing.

3. **Collaborate in Real Time**  
   Share the session link with others to draw together live.

4. **Create or Join a Session**  
   - **Start New**: Click **"Start New Whiteboard"** to generate a link.  
   - **Join**: Paste an existing link into the form and join the session.

## Future Plans

- **Responsive Design**:
  
  Enhance the whiteboard's UI and layout to ensure it is fully responsive and functional on different screen sizes and devices, including tablets and smartphones.  
  - Optimize canvas rendering for smaller screens.  
  - Adjust UI components for touch interactions.  
  - Ensure a seamless experience on both portrait and landscape orientations.

## Contributions

Contributions are welcome! If you'd like to improve or add features, please fork the repository and submit a pull request.

