# 🧠 Prats Second Brain

A powerful, **infinite-canvas style productivity tool** designed to help you organize your life, studies, and projects visually. "Prats Second Brain" goes beyond simple to-do lists by allowing you to arrange tasks spatially, group them into smart containers, use AI to generate study plans, and manage everything across multiple notebooks.

---

## ✨ Core Features

### 📝 Smart Task Management
| Feature | Description |
|---------|-------------|
| **Visual Task Cards** | Create beautiful task cards with titles and multiple sub-items |
| **Drag & Drop** | Freely move tasks anywhere on the infinite canvas |
| **Sub-task Strikethrough** | Click on individual items to mark them complete with strikethrough |
| **Color Coding** | Customize task card colors for better visual organization |
| **Inline Editing** | Double-click to edit task titles and items directly |
| **Add/Delete Items** | Dynamically add new sub-items or remove existing ones |

> **💡 Tip:** Strikedthrough items stay on the card until you manually move the task to the trash — giving you full control over your workflow.

---

### 🤖 AI-Powered Productivity
| Feature | Description |
|---------|-------------|
| **AI Create (Gemini)** | Enter any topic (e.g., "Learn React in 2 weeks") and Gemini AI generates a structured study plan with organized task cards |
| **Logic Create** | Paste syllabus text or notes, and the app intelligently parses them into organized task cards automatically |
| **Smart Parsing** | Detects chapters, modules, and bullet points to create hierarchical tasks |

> **🚀 Why it helps:** Stop manually creating study plans — let AI do the heavy lifting so you can focus on learning!

---

### 📂 Multi-Notebook System
| Feature | Description |
|---------|-------------|
| **Multiple Notebooks** | Create separate workspaces for different projects, subjects, or life areas |
| **Collapsible Sidebar** | Toggle the notebook sidebar for a cleaner workspace |
| **Rename & Delete** | Easily manage your notebooks with right-click options |
| **Automatic Saving** | Each notebook's data is persisted separately in local storage |

> **📚 Use Case:** Create notebooks like "College - Semester 5", "Personal Projects", "Side Hustle Ideas", etc.

---

### 🗂️ Groups / Sections
| Feature | Description |
|---------|-------------|
| **Group Tasks** | Select multiple tasks and group them into a visual section/container |
| **Resizable Groups** | Drag group edges to resize — groups will prevent content overflow |
| **Color-Coded Sections** | Each section can have its own color for visual distinction |
| **Smart Drag Confirmation** | When dragging a task out of a group, you'll get a confirm dialog |
| **Ungroup or Delete** | Option to ungroup (release tasks) or delete group with all tasks |

> **🎯 Why it helps:** Perfect for organizing tasks by priority, week, module, or any category you prefer!

---

### 🏷️ Sticky Labels
| Feature | Description |
|---------|-------------|
| **Add Text Labels** | Place text notes anywhere on the canvas (like digital sticky notes) |
| **Customizable Colors** | Choose from 8 vibrant label colors (yellow, pink, blue, green, etc.) |
| **Multiple Sizes** | Small, Medium, and Large label sizes available |
| **Editable Text** | Double-click to edit label content |
| **Context Menu** | Access color and size options via context menu |

> **📌 Use Case:** Add labels like "URGENT", "In Progress", "Waiting for Review" anywhere on your canvas!

---

### 🎨 Infinite Canvas Experience
| Feature | Description |
|---------|-------------|
| **Pan Navigation** | Click and drag on empty space, or hold `Spacebar` + drag |
| **Zoom In/Out** | Use `Ctrl + Scroll` or on-screen buttons |
| **Reset View** | One-click to reset zoom to 100% |
| **Touch Support** | Full touch/pinch support for mobile and tablet devices |
| **Dark Mode** | Automatically respects your system's dark mode preference |

---

### 🗑️ Completion & History
| Feature | Description |
|---------|-------------|
| **Trash Zone** | Drag completed tasks to the trash bin to clear your canvas |
| **Completed History** | Click the trash bin to view all completed tasks |
| **Expandable View** | Expand individual tasks to see completed sub-items |
| **Restore Tasks** | Accidentally deleted? Restore any task back to the canvas |
| **Undo Toast** | 5-second undo notification appears after deleting — one-click restore! |

> **✅ Why it helps:** Never lose your work — everything is recoverable!

---

### 💾 Data Management
| Feature | Description |
|---------|-------------|
| **Auto-Save** | All data automatically saved to browser local storage |
| **Export All Data** | Download complete backup of all notebooks as JSON |
| **Import All Data** | Restore from a full backup file |
| **Export Single Notebook** | Share just one notebook with friends |
| **Import Single Notebook** | Add a shared notebook to your collection |
| **Text Export/Import** | Copy-paste friendly format for mobile/quick sharing |

> **🔄 Pro Tip:** Regularly export your data to keep backups safe!

---

### 🎛️ Selection & Bulk Actions
| Feature | Description |
|---------|-------------|
| **Selection Mode** | Toggle selection mode from toolbar |
| **Multi-Select** | Hold `Shift` + Click to select multiple tasks individually |
| **Move Selected** | Drag all selected tasks together |
| **Group Selected** | Create a group from selected tasks with one click |

---

### 🔧 Additional Features
| Feature | Description |
|---------|-------------|
| **Collapsible Header** | Toggle the top toolbar for full-screen focus mode |
| **Organize Tasks** | One-click to auto-arrange tasks in a clean grid |
| **Delete Confirmation** | Safety dialogs prevent accidental deletions |
| **Undo/Redo** | Full history support for all actions |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (Latest LTS recommended)
- **pnpm** (or npm/yarn)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "chumma to do list maker"
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables**
   
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   > **Note:** The AI Create feature requires a valid Gemini API key. Get one free at [Google AI Studio](https://makersuite.google.com/app/apikey).

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal).

---

## 🎮 Controls & Shortcuts

| Action | Desktop | Mobile |
|--------|---------|--------|
| **Pan Canvas** | Click + Drag empty space / `Spacebar` + Drag | Two-finger swipe |
| **Zoom** | `Ctrl` + Scroll / Mouse Wheel | Pinch to zoom |
| **Move Task** | Click + Drag task header | Touch + Drag |
| **Edit Task** | Double-click title/item | Double-tap |
| **Select Multiple** | `Shift` + Click | Toggle Select mode |
| **Undo** | `Ctrl` + `Z` | - |
| **Redo** | `Ctrl` + `Y` / `Ctrl` + `Shift` + `Z` | - |
| **Delete** | `Del` / `Backspace` | Context Menu |
| **Cancel/Deselect**| `Esc` | Tap Empty Space |

---

## 🛠️ Built With

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library with Hooks |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Beautiful icons |
| **Google GenAI SDK** | Gemini AI integration |

---

## 📱 Mobile Responsive

Prats Second Brain is fully responsive and works beautifully on:
- 📱 **Mobile Phones** — Compact toolbar, touch-friendly controls
- 📲 **Tablets** — Optimized layout with pinch-to-zoom
- 💻 **Desktop** — Full feature set with keyboard shortcuts

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <strong>Prats</strong>
</p>
