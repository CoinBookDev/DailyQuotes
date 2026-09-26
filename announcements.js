async function loadAnnouncements() {
  const container = document.getElementById("announcements");
  if (!container) return;

  try {
    // Load the JSON file (updated by your admin panel)
    const response = await fetch("/announcements.json");
    const data = await response.json();

    const today = new Date();

    // Only show active + date‑valid announcements
    const activeMessages = data.filter(item => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      return item.active && today >= start && today <= end;
    });

    if (activeMessages.length === 0) return;

    // Render each announcement
    activeMessages.forEach(item => {
      const div = document.createElement("div");
      div.className = `announcement-item ${item.type}`;
      div.textContent = item.message;
      container.appendChild(div);
    });

  } catch (error) {
    console.error("Failed to load announcements:", error);
  }
}

// Run when the page loads
document.addEventListener("DOMContentLoaded", loadAnnouncements);
