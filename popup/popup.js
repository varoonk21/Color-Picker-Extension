document.addEventListener("DOMContentLoaded", () => {
  const previewBox = document.getElementById('preview-box');
  const pickerBtn = document.getElementById('pick-color-btn');
  const copyBtn = document.getElementById('copy-btn');
  const colorInput = document.getElementById('color-input');
  const formatSelector = document.getElementById('format-selector');
  const recentColors = document.querySelector('.recent-colors');
  const clearBtn = document.getElementById('clear-btn');

  let savedColors = JSON.parse(localStorage.getItem('saved-colors')) || [];
  let pickedColor = savedColors.length > 0 ? savedColors[0] : "#000000";
  applyColor(pickedColor);

  function applyColor(color) {
    pickedColor = color;
    previewBox.style.backgroundColor = color;
    colorInput.value = formatSelector.value === 'rgb' ? hexToRgb(color) : color;
  }


  function saveToLocalStorage(color) {
    if (!savedColors.includes(color)) {
      savedColors.unshift(color);
      if (savedColors.length > 8) savedColors.pop();
      localStorage.setItem('saved-colors', JSON.stringify(savedColors));
    }
  }

  function loadRecentColors() {
    const container = document.querySelector('.recent-colors');
    container.innerHTML = '';
    savedColors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      swatch.title = color;
      swatch.addEventListener('click', () => {
        applyColor(color)
      });
      container.appendChild(swatch);
    });
  }

  pickerBtn.onclick = () => {
    pickColor();
  };

  formatSelector.addEventListener('change', () => {
    const selectedFormat = formatSelector.value;
    if (selectedFormat === "hex") {
      colorInput.value = pickedColor;
    } else if (selectedFormat === "rgb") {
      colorInput.value = hexToRgb(pickedColor);
    }
  });

  function pickColor() {
    const eyeDropper = new EyeDropper();
    eyeDropper.open()
      .then(result => {
        pickedColor = result.sRGBHex;
        applyColor(pickedColor);
        copy();
        saveToLocalStorage(pickedColor);
        loadRecentColors();

      })
      .catch(err => {
        console.error("Error picking color:", err);
      });
  }

  function hexToRgb(hex) {
    if (!hex) return "";
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(h => h + h).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  colorInput.addEventListener("input", () => {
    const value = colorInput.value.trim();
    const isValidHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(value);
    if (isValidHex) {
      applyColor(value);
    }
  });



  function copy() {
    navigator.clipboard.writeText(colorInput.value);

    copyBtn.setAttribute("title", "Copied!");
    setTimeout(() => copyBtn.removeAttribute("title"), 1500);

    copyBtn.innerHTML = `<svg fill="#30d94c" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#30d94c"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>tick-checkbox</title> <path d="M0 26.016v-20q0-2.496 1.76-4.256t4.256-1.76h20q2.464 0 4.224 1.76t1.76 4.256v20q0 2.496-1.76 4.224t-4.224 1.76h-20q-2.496 0-4.256-1.76t-1.76-4.224zM4 26.016q0 0.832 0.576 1.408t1.44 0.576h20q0.8 0 1.408-0.576t0.576-1.408v-20q0-0.832-0.576-1.408t-1.408-0.608h-20q-0.832 0-1.44 0.608t-0.576 1.408v20zM7.584 16q0-0.832 0.608-1.408t1.408-0.576 1.408 0.576l2.848 2.816 7.072-7.040q0.576-0.608 1.408-0.608t1.408 0.608 0.608 1.408-0.608 1.408l-8.48 8.48q-0.576 0.608-1.408 0.608t-1.408-0.608l-4.256-4.256q-0.608-0.576-0.608-1.408z"></path> </g></svg>`
    setTimeout(() => {
      copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 9V6.2C9 5.08 9 4.52 9.218 4.092C9.41 3.715 9.715 3.41 10.092 3.218C10.52 3 11.08 3 12.2 3H17.8C18.92 3 19.48 3 19.908 3.218C20.284 3.41 20.59 3.715 20.782 4.092C21 4.52 21 5.08 21 6.2V11.8C21 12.92 21 13.48 20.782 13.908C20.59 14.284 20.284 14.59 19.908 14.782C19.48 15 18.921 15 17.803 15H15M9 9H6.2C5.08 9 4.52 9 4.092 9.218C3.715 9.41 3.41 9.715 3.218 10.092C3 10.52 3 11.08 3 12.2V17.8C3 18.92 3 19.48 3.218 19.908C3.41 20.284 3.715 20.59 4.092 20.782C4.519 21 5.079 21 6.197 21H11.804C12.921 21 13.481 21 13.908 20.782C14.284 20.59 14.59 20.284 14.782 19.908C15 19.48 15 18.921 15 17.803V15M9 9H11.8C12.92 9 13.48 9 13.908 9.218C14.284 9.41 14.59 9.715 14.782 10.092C15 10.519 15 11.079 15 12.197V15" 
            stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`
    }, 1000);
  }
  copyBtn.addEventListener('click', () => {
    copy();
  });


  clearBtn.addEventListener('click', () => {
    pickedColor = "#000000";
    applyColor(pickedColor);
    recentColors.innerHTML = ``;
    localStorage.removeItem("saved-colors");
    savedColors = [];

  });

  loadRecentColors();



});


