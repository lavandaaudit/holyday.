// 🔑 Ваш API ключ Calendarific
const API_KEY = "ВАШ_API_KEY"; // отримати тут: https://calendarific.com/
const COUNTRY = "UA";
const YEAR = new Date().getFullYear();

// ==== Отримання свят ====
async function fetchHolidays() {
  const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${COUNTRY}&year=${YEAR}&type=religious`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.response && data.response.holidays) {
      return data.response.holidays;
    }
  } catch (e) {
    console.error("Помилка API:", e);
  }
  return [];
}

// ==== Побудова таймлайну ====
async function buildTimeline() {
  const holidays = await fetchHolidays();

  // Генеруємо items для vis.js
  const items = holidays.map((h, idx) => {
    // Іконка (якщо немає, ставимо заглушку)
    const icon = h.locations_icon || 'https://via.placeholder.com/32';

    // Назва та опис українською, якщо доступно
    const name = h.name_uk || h.name;
    const description = h.description_uk || h.description || '';

    return {
      id: idx,
      content: `
        <div class="holiday-item">
          <img src="${icon}" alt="">
          <div>
            <strong>${name}</strong><br>
            <small>${description}</small>
          </div>
        </div>
      `,
      start: h.date.iso
    };
  });

  const container = document.getElementById('timeline');
  const dataset = new vis.DataSet(items);

  const timeline = new vis.Timeline(container, dataset, {
    selectable: true,
    showCurrentTime: true,
    zoomMin: 1000 * 60 * 60 * 24, // мінімум 1 день
    template: item => item.content
  });
}

// ==== Запуск ====
buildTimeline();
