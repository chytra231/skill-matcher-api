# Task Checklist

A simple checklist web app for adding, ticking off, and deleting tasks. It is plain HTML, CSS, and JavaScript, with no dependencies or build step.

## Running it

Open `index.html` in any modern browser. That's it.

## Features

- **Add tasks:** type and press Enter or click **Add**. Blank entries are ignored.
- **Tick tasks off:** click the checkbox or the task text. Done tasks are struck through.
- **Delete tasks:** click **×** on a task.
- **Clear completed:** removes all done tasks at once.
- **Progress:** shows "X of Y done" with a progress bar.
- **Saved automatically:** tasks are kept in your browser's `localStorage`, so they survive a refresh. The list stays until you clear it; there is no daily reset.
- **Accessible:** it can be used entirely from the keyboard, and it has labels for screen readers.
- **Light and dark themes:** follows your system setting.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `styles.css` | Styling, including light and dark themes |
| `app.js` | Adding, toggling, deleting, saving, and rendering tasks |

## Note

Tasks are stored only in the browser you use. They won't sync to other devices, and clearing your browser's site data removes them.
